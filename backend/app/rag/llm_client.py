"""Ollama HTTP client for local LLM inference (no paid API)."""

from __future__ import annotations

import json
import logging
from typing import AsyncGenerator

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

RAG_SYSTEM_PROMPT = """You are a helpful assistant for LegacyToCloud, a data engineering platform.
Answer the user's question based ONLY on the provided article context below.
If the context doesn't contain enough information to answer, say so honestly.
Cite article titles when referencing specific information.
Keep answers concise and informative."""


def _build_prompt(question: str, articles: list[dict]) -> str:
    """Build the RAG prompt with article context."""
    context_parts = []
    for i, art in enumerate(articles, 1):
        content = (art.get("content") or art.get("summary") or "")[:1500]
        context_parts.append(
            f"[Article {i}] \"{art['title']}\" (source: {art.get('source', 'unknown')})\n{content}"
        )

    context_block = "\n\n---\n\n".join(context_parts)

    return f"""{RAG_SYSTEM_PROMPT}

## Article Context

{context_block}

## User Question

{question}

## Answer"""


async def check_ollama() -> bool:
    """Check if Ollama is running and accessible."""
    settings = get_settings()
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            resp = await client.get(f"{settings.ollama_base_url}/api/tags")
            return resp.status_code == 200
    except Exception:
        return False


async def generate_stream(
    question: str,
    articles: list[dict],
) -> AsyncGenerator[str, None]:
    """Stream tokens from Ollama for a RAG query."""
    settings = get_settings()
    prompt = _build_prompt(question, articles)

    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream(
            "POST",
            f"{settings.ollama_base_url}/api/generate",
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": True,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "num_predict": 512,
                },
            },
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    token = data.get("response", "")
                    if token:
                        yield token
                    if data.get("done"):
                        break
                except json.JSONDecodeError:
                    continue
