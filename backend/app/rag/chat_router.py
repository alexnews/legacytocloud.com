"""FastAPI router for RAG chat over news articles."""

from __future__ import annotations

import json
import logging

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.pipeline.news_models import Article
from app.rag.llm_client import check_ollama, generate_stream
from app.rag.retriever import find_similar_articles, keyword_search_articles
from app.rag.schemas import ChatRequest, ChatSource, ChatStatusResponse

logger = logging.getLogger(__name__)

router = APIRouter()

# Lazy-check whether sentence-transformers is available
_embedder_available: bool | None = None


def _check_embedder() -> bool:
    global _embedder_available
    if _embedder_available is None:
        try:
            from app.rag.embedder import get_model
            get_model()
            _embedder_available = True
        except Exception as exc:
            logger.warning("Embedding model not available: %s", exc)
            _embedder_available = False
    return _embedder_available


@router.get("/chat/status", response_model=ChatStatusResponse)
async def chat_status(db: AsyncSession = Depends(get_db)):
    """Check chat readiness: embedding count and Ollama availability."""
    total = await db.scalar(
        select(func.count(Article.id)).where(Article.status == "published")
    ) or 0

    try:
        embedded = await db.scalar(
            text("SELECT count(*) FROM pipeline.article_embeddings")
        ) or 0
    except Exception:
        embedded = 0

    ollama_ok = await check_ollama()

    return ChatStatusResponse(
        total_articles=total,
        embedded_articles=embedded,
        model_name="all-MiniLM-L6-v2",
        ollama_available=ollama_ok,
    )


def _sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


@router.post("/chat")
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    """RAG chat: embed question → find similar articles → stream answer."""

    articles = []

    # Try vector search first
    if _check_embedder():
        try:
            from app.rag.embedder import embed_text
            query_vec = embed_text(req.question)
            articles = await find_similar_articles(query_vec, db, top_k=5)
        except Exception as exc:
            logger.warning("Vector search failed, falling back to keyword: %s", exc)

    # Fallback to keyword search
    if not articles:
        try:
            articles = await keyword_search_articles(req.question, db, top_k=5)
        except Exception as exc:
            logger.error("Keyword search also failed: %s", exc)

    if not articles:
        async def no_articles():
            yield _sse({"sources": []})
            yield _sse({"token": "No matching articles found. Try different keywords."})
            yield _sse({"done": True})
        return StreamingResponse(no_articles(), media_type="text/event-stream")

    # 4. Build sources list
    sources = [
        ChatSource(
            title=a["title"],
            slug=a["slug"],
            source=a.get("source"),
            similarity=round(float(a["similarity"]), 3),
        )
        for a in articles
    ]

    # 5. Stream response
    async def event_stream():
        yield _sse({"sources": [s.model_dump() for s in sources]})

        ollama_ok = await check_ollama()
        if not ollama_ok:
            # Fallback: return article summaries without LLM
            yield _sse({"token": "Here are the most relevant articles I found:\n\n"})
            for i, a in enumerate(articles[:3], 1):
                summary = a.get("summary") or (a.get("content") or "")[:300]
                title = a["title"]
                yield _sse({"token": f"**{i}. {title}**\n{summary}\n\n"})
            yield _sse({"done": True})
            return

        # Stream from Ollama
        try:
            async for token in generate_stream(req.question, articles):
                yield _sse({"token": token})
        except Exception as exc:
            logger.error("LLM streaming error: %s", exc)
            yield _sse({"token": f"\n\n[Error generating response: {exc}]"})

        yield _sse({"done": True})

    return StreamingResponse(event_stream(), media_type="text/event-stream")
