"""
Price data normalizer - unifies scraper output into a consistent format
"""

PLATFORM_META = {
    "amazon": {
        "name": "Amazon",
        "color": "#ff9900",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "rating": 4.6,
        "delivery": "Free Express (Tomorrow)",
        "returnPolicy": "7 Days Replacement"
    },
    "flipkart": {
        "name": "Flipkart",
        "color": "#2874f0",
        "logo": "https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png",
        "rating": 4.5,
        "delivery": "Standard Delivery (2 Days)",
        "returnPolicy": "7 Days Exchange"
    },
    "croma": {
        "name": "Croma",
        "color": "#00e699",
        "logo": "https://images.croma.com/image/upload/v1637841961/Croma%20Assets/CMS/Category%20Icon/Final_Icon/croma_logo.png",
        "rating": 4.4,
        "delivery": "Same Day Store Pickup / 24h Delivery",
        "returnPolicy": "Physical Store Support"
    },
    "reliance": {
        "name": "Reliance Digital",
        "color": "#e42529",
        "logo": "https://www.reliancedigital.in/build/client/images/reliance_digital_logo.png",
        "rating": 4.3,
        "delivery": "2-3 Business Days",
        "returnPolicy": "7 Days Easy Return"
    }
}


def normalize_prices(raw_prices: list) -> list:
    """
    Takes raw scraper output and normalizes into a consistent schema
    that the React frontend expects.
    """
    normalized = []

    for item in raw_prices:
        if not item or not item.get("price"):
            continue

        platform_id = item.get("platformId", "unknown")
        meta = PLATFORM_META.get(platform_id, {})
        price = item["price"]
        original_price = item.get("originalPrice") or price

        # Calculate discount %
        discount_pct = 0
        if original_price and original_price > price:
            discount_pct = round(((original_price - price) / original_price) * 100, 1)

        normalized.append({
            "platformId": platform_id,
            "price": price,
            "originalPrice": original_price,
            "discountPercent": discount_pct,
            "inStock": item.get("inStock", True),
            "coupon": item.get("coupon", "Check platform for offers"),
            "directLink": item.get("directLink", "#"),
            "productTitle": item.get("productTitle", ""),
            "lastUpdated": "Just Now (Live)",
            # Meta (merged for frontend convenience)
            "platformName": meta.get("name", platform_id.capitalize()),
            "platformColor": meta.get("color", "#888"),
            "delivery": meta.get("delivery", "Standard Delivery"),
            "returnPolicy": meta.get("returnPolicy", "As per platform policy"),
            "platformRating": meta.get("rating", 4.0)
        })

    # Sort cheapest first
    normalized.sort(key=lambda x: x["price"])
    return normalized
