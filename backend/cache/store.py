"""
In-memory cache store (Redis-optional).
Falls back to a Python dict when Redis is not available.
"""
import os
import json
import time
from dotenv import load_dotenv

load_dotenv()

# Simple in-memory cache fallback
_memory_cache: dict = {}

# Try to connect to Redis if available
_redis_client = None
try:
    import redis
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    _redis_client = redis.from_url(redis_url, decode_responses=True, socket_connect_timeout=2)
    _redis_client.ping()  # Test connection
    print("[Cache] Redis connected successfully")
except Exception:
    print("[Cache] Redis not available, using in-memory cache")
    _redis_client = None


def get_cached(key: str) -> dict | None:
    """Retrieve a cached value. Returns None if not found or expired."""
    if _redis_client:
        try:
            val = _redis_client.get(key)
            return json.loads(val) if val else None
        except Exception:
            pass

    # Fallback: in-memory cache
    entry = _memory_cache.get(key)
    if entry and time.time() < entry["expires_at"]:
        return entry["data"]
    elif entry:
        del _memory_cache[key]  # Expired
    return None


def set_cached(key: str, value: dict, ttl: int = 1800) -> None:
    """Store a value in cache with TTL in seconds (default 30 min)."""
    if _redis_client:
        try:
            _redis_client.setex(key, ttl, json.dumps(value))
            return
        except Exception:
            pass

    # Fallback: in-memory cache
    _memory_cache[key] = {
        "data": value,
        "expires_at": time.time() + ttl
    }
