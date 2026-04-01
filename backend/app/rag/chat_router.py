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
from app.rag.embedder import embed_text
from app.rag.llm_client import check_ollama, generate_stream
from app.rag.retriever import find_similar_articles
from app.rag.schemas import ChatRequest, ChatSource, ChatStatusResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/chat/status", response_model=ChatStatusResponse)
async def chat_status(db: AsyncSession = Depends(get_db)):
    """Check chat readiness: embedding count and Ollama availability."""
    total = await db.scalar(
        select(func.count(Article.id)).where(Article.status == "published")
    ) or 0

    embedded = await db.scalar(
        text("SELECT count(*) FROM pipeline.article_embeddings")
    ) or 0

    ollama_ok = await check_ollama()

    return ChatStatusResponse(
        total_articles=total,
        embedded_articles=embedded,
        model_name="all-MiniLM-L6-v2",
        ollama_available=ollama_ok,
    )


@router.post("/chat")
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    """RAG chat: embed question → find similar articles → stream LLM answer.

    Returns Server-Sent Events:
      - First event: {"sources": [...]}  (retrieved articles)
      - Subsequent events: {"token": "..."}  (streamed LLM tokens)
      - Final event: {"done": true}
    """
    # 1. Embed the question
    query_vec = embed_text(req.question)

    # 2. Find similar articles
    articles = await find_similar_articles(query_vec, db, top_k=5)

    if not articles:
        async def no_articles():
            yield f"data: {json.dumps({'sources': []})}\n\n"
            yield f"data: {json.dumps({'token': 'No articles found in the database. Please make sure articles have been embedded.'})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        return StreamingResponse(no_articles(), media_type="text/event-stream")

    # 3. Build sources list
    sources = [
        ChatSource(
            title=a["title"],
            slug=a["slug"],
            source=a.get("source"),
            similarity=round(float(a["similarity"]), 3),
        )
        for a in articles
    ]

    # 4. Stream LLM response
    async def event_stream():
        # Send sources first
        yield f"data: {json.dumps({'sources': [s.model_dump() for s in sources]})}\n\n"

        # Check Ollama
        ollama_ok = await check_ollama()
        if not ollama_ok:
            # Fallback: return article summaries without LLM
            yield f"data: {json.dumps({'token': 'Ollama is not running. Here are the most relevant articles:\\n\\n'})}\n\n"
            for i, a in enumerate(articles[:3], 1):
                summary = a.get("summary") or (a.get("content") or "")[:200]
                title = a["title"]
                msg = f"{i}. **{title}**\n{summary}\n\n"
                yield f"data: {json.dumps({'token': msg})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
            return

        # Stream from Ollama
        try:
            async for token in generate_stream(req.question, articles):
                yield f"data: {json.dumps({'token': token})}\n\n"
        except Exception as exc:
            logger.error("LLM streaming error: %s", exc)
            yield f"data: {json.dumps({'token': f'\\n\\n[Error generating response: {exc}]'})}\n\n"

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
