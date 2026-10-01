"""
Google Gemini AI Integration
Provides intelligent deal analysis using the Gemini API.
"""
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
_api_key = os.getenv("GEMINI_API_KEY", "")
if _api_key and _api_key != "your_gemini_api_key_here":
    genai.configure(api_key=_api_key)
    _model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config=genai.types.GenerationConfig(
            temperature=0.3,
            max_output_tokens=300
        )
    )
    _gemini_enabled = True
else:
    _model = None
    _gemini_enabled = False


async def get_ai_analysis(product_name: str, platform_prices: list) -> dict:
    """
    Uses Gemini to analyze scraped prices and generate a smart deal recommendation.
    Falls back to rule-based analysis if API key is not configured.
    """
    if not platform_prices:
        return _fallback_analysis(product_name, [])

    if not _gemini_enabled:
        return _fallback_analysis(product_name, platform_prices)

    # Build price summary for the prompt
    cheapest = platform_prices[0]
    price_lines = []
    for p in platform_prices:
        discount_info = f" (was ₹{p['originalPrice']:,})" if p.get("originalPrice") and p["originalPrice"] > p["price"] else ""
        price_lines.append(f"- {p['platformName']}: ₹{p['price']:,}{discount_info} | In Stock: {p['inStock']}")

    price_summary = "\n".join(price_lines)

    prompt = f"""You are Comprize AI, an expert Indian e-commerce shopping analyst.

Product: {product_name}

Live prices scraped right now from Indian platforms:
{price_summary}

Cheapest option: {cheapest['platformName']} at ₹{cheapest['price']:,}

Analyze:
1. Is this a good deal? (Consider if discount is significant)
2. Best platform to buy from?
3. Any buying advice (wait for sale, buy now, etc.)?

Respond in JSON with this exact format:
{{
  "verdict": "BUY NOW or WAIT FOR SALE",
  "verdictColor": "#10b981 (green for buy) or #f59e0b (amber for wait)",
  "dealScore": <number 1-10>,
  "summary": "<2 sentence recommendation>",
  "bestPlatform": "<platform name>",
  "maxSavings": <number in rupees vs most expensive>
}}"""

    try:
        response = _model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code block if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        import json
        result = json.loads(text)
        result["aiPowered"] = True
        result["model"] = "gemini-1.5-flash"
        return result
    except Exception as e:
        print(f"[Gemini AI] Error: {e}")
        return _fallback_analysis(product_name, platform_prices)


def _fallback_analysis(product_name: str, platform_prices: list) -> dict:
    """
    Rule-based fallback when Gemini API is not available.
    """
    if not platform_prices:
        return {
            "verdict": "SEARCH REQUIRED",
            "verdictColor": "#6b7280",
            "dealScore": 5.0,
            "summary": f"Search for {product_name} to get live price comparison across platforms.",
            "bestPlatform": "Unknown",
            "maxSavings": 0,
            "aiPowered": False,
            "model": "rule-based"
        }

    cheapest = platform_prices[0]
    highest_price = max(p["price"] for p in platform_prices)
    max_savings = highest_price - cheapest["price"]

    avg_discount = sum(p.get("discountPercent", 0) for p in platform_prices) / len(platform_prices)

    if avg_discount > 15:
        verdict = "BUY NOW"
        verdict_color = "#10b981"
        deal_score = round(min(9.5, 7.0 + avg_discount / 10), 1)
    elif avg_discount > 5:
        verdict = "GOOD DEAL"
        verdict_color = "#3b82f6"
        deal_score = round(min(8.0, 6.5 + avg_discount / 10), 1)
    else:
        verdict = "WAIT FOR SALE"
        verdict_color = "#f59e0b"
        deal_score = 5.5

    return {
        "verdict": verdict,
        "verdictColor": verdict_color,
        "dealScore": deal_score,
        "summary": (
            f"Comprize found {len(platform_prices)} live prices for {product_name}. "
            f"{cheapest['platformName']} is cheapest at ₹{cheapest['price']:,}, "
            f"saving you ₹{max_savings:,} vs the highest price."
        ),
        "bestPlatform": cheapest["platformName"],
        "maxSavings": max_savings,
        "aiPowered": False,
        "model": "rule-based"
    }
