"""Local embedding using sentence-transformers (no paid API needed)."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

_model: SentenceTransformer | None = None

MODEL_NAME = "all-MiniLM-L6-v2"
DIMENSION = 384


def get_model() -> SentenceTransformer:
    """Lazy-load the embedding model (first call takes ~2s)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model %s ...", MODEL_NAME)
        _model = SentenceTransformer(MODEL_NAME)
        logger.info("Embedding model loaded.")
    return _model


def embed_text(text: str) -> list[float]:
    """Embed a single text string, returns 384-dim vector."""
    model = get_model()
    return model.encode(text, normalize_embeddings=True).tolist()


def embed_batch(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts, returns list of 384-dim vectors."""
    model = get_model()
    return model.encode(texts, normalize_embeddings=True, batch_size=32).tolist()
