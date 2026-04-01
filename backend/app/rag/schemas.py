"""Pydantic schemas for the chat/RAG API."""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=500)


class ChatSource(BaseModel):
    title: str
    slug: str
    source: str | None = None
    similarity: float


class ChatStatusResponse(BaseModel):
    total_articles: int
    embedded_articles: int
    model_name: str
    ollama_available: bool
