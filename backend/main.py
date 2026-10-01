"""
ComPrice Backend - FastAPI Price Scraping & AI Analysis Server
"""
import os
import asyncio
from datetime import datetime
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from scraper.amazon import scrape_amazon
from scraper.flipkart import scrape_flipkart
from scraper.croma import scrape_croma
from scraper.reliance import scrape_reliance
from scraper.normalizer import normalize_prices
from ai.gemini import get_ai_analysis
from cache.store import get_cached, set_cached

load_dotenv()

app = FastAPI(
    title="ComPrice Price API",
    description="Real-time price comparison API for Indian e-commerce platforms",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ComPrice Backend is Live 🚀", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/api/prices")
async def get_prices(q: str = Query(..., min_length=2, description="Product search query")):
    """
    Fetch real-time prices for a product across all Indian e-commerce platforms.
    Results are cached for 30 minutes.
    """
    cache_key = f"prices:{q.lower().strip()}"

    # Try cache first
    cached = get_cached(cache_key)
    if cached:
        cached["fromCache"] = True
        return cached

    # Run all scrapers concurrently with timeout
    try:
        results = await asyncio.gather(
            scrape_amazon(q),
            scrape_flipkart(q),
            scrape_croma(q),
            scrape_reliance(q),
            return_exceptions=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraper error: {str(e)}")

    # Filter out errors and normalize
    raw_prices = [r for r in results if isinstance(r, dict) and r.get("price")]
    platform_prices = normalize_prices(raw_prices)

    if not platform_prices:
        raise HTTPException(
            status_code=404,
            detail=f"No prices found for '{q}'. Try a more specific product name."
        )

    # Get AI analysis
    ai_summary = await get_ai_analysis(q, platform_prices)

    response = {
        "query": q,
        "platformPrices": platform_prices,
        "aiSummary": ai_summary,
        "lastSynced": datetime.now().strftime("%I:%M %p"),
        "fromCache": False,
        "totalPlatforms": len(platform_prices)
    }

    # Cache for 30 minutes
    set_cached(cache_key, response, ttl=1800)

    return response


@app.get("/api/trending")
async def get_trending():
    """
    Returns a list of popular Indian tech products to show in the catalog
    (fetched live or from recent cache).
    """
    trending_queries = [
        "iPhone 15 Pro Max",
        "Samsung Galaxy S24 Ultra",
        "OnePlus 12 5G",
        "MacBook Air M3",
        "Sony WH-1000XM5"
    ]

    catalog = []
    for query in trending_queries:
        cache_key = f"prices:{query.lower().strip()}"
        cached = get_cached(cache_key)
        if cached and cached.get("platformPrices"):
            # Get cheapest for catalog display
            prices = [p["price"] for p in cached["platformPrices"] if p.get("price")]
            if prices:
                cheapest = min(prices)
                cheapest_platform = next(
                    (p for p in cached["platformPrices"] if p.get("price") == cheapest), None
                )
                catalog.append({
                    "id": query.lower().replace(" ", "-"),
                    "name": query,
                    "cheapestPrice": cheapest,
                    "cheapestPlatform": cheapest_platform.get("platformId") if cheapest_platform else "unknown",
                    "query": query
                })

    return {"trending": catalog, "count": len(catalog)}
