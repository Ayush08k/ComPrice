"""
Amazon.in Playwright Scraper
Fetches real-time product prices from Amazon India search results.
"""
import asyncio
import re
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout


async def scrape_amazon(query: str) -> dict | None:
    """
    Scrapes Amazon.in for the first matching product price.
    Returns normalized price data or None on failure.
    """
    url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}&i=electronics"

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-blink-features=AutomationControlled"
                ]
            )
            context = await browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0.0.0 Safari/537.36"
                ),
                locale="en-IN",
                timezone_id="Asia/Kolkata"
            )
            page = await context.new_page()

            # Block images/fonts to speed up loading
            await page.route("**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf}", lambda r: r.abort())

            await page.goto(url, timeout=20000, wait_until="domcontentloaded")

            # Wait for search results
            try:
                await page.wait_for_selector('[data-component-type="s-search-result"]', timeout=8000)
            except PlaywrightTimeout:
                await browser.close()
                return None

            # Extract first in-stock result
            results = await page.query_selector_all('[data-component-type="s-search-result"]')

            for result in results[:5]:
                try:
                    # Get price
                    price_whole = await result.query_selector('.a-price-whole')
                    if not price_whole:
                        continue

                    price_text = await price_whole.inner_text()
                    price_clean = re.sub(r'[^\d]', '', price_text)
                    if not price_clean or int(price_clean) < 100:
                        continue

                    # Get product title
                    title_el = await result.query_selector('h2 a span')
                    title = await title_el.inner_text() if title_el else query

                    # Get product link
                    link_el = await result.query_selector('h2 a')
                    href = await link_el.get_attribute('href') if link_el else ''
                    product_link = f"https://www.amazon.in{href}" if href.startswith('/') else href

                    # Check for "Add to Cart" / availability
                    out_of_stock = await result.query_selector('.a-color-price')
                    in_stock = True
                    if out_of_stock:
                        oos_text = await out_of_stock.inner_text()
                        if 'unavailable' in oos_text.lower() or 'out of stock' in oos_text.lower():
                            in_stock = False

                    # Look for original/MRP price
                    mrp_el = await result.query_selector('.a-price.a-text-price .a-offscreen')
                    original_price = None
                    if mrp_el:
                        mrp_text = await mrp_el.inner_text()
                        mrp_clean = re.sub(r'[^\d]', '', mrp_text)
                        original_price = int(mrp_clean) if mrp_clean else None

                    await browser.close()
                    return {
                        "platformId": "amazon",
                        "price": int(price_clean),
                        "originalPrice": original_price,
                        "inStock": in_stock,
                        "coupon": "Check Amazon for bank offers",
                        "directLink": product_link or url,
                        "productTitle": title[:80]
                    }

                except Exception:
                    continue

            await browser.close()
            return None

    except Exception as e:
        print(f"[Amazon Scraper] Error: {e}")
        return None
