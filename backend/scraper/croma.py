"""
Croma.com Playwright Scraper
Fetches real-time product prices from Croma search results.
"""
import re
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout


async def scrape_croma(query: str) -> dict | None:
    """
    Scrapes Croma for the first matching product price.
    """
    url = f"https://www.croma.com/searchB?q={query.replace(' ', '+')}"

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
            )
            context = await browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0.0.0 Safari/537.36"
                ),
                locale="en-IN"
            )
            page = await context.new_page()
            await page.route("**/*.{png,jpg,jpeg,gif,svg,woff,woff2}", lambda r: r.abort())

            await page.goto(url, timeout=20000, wait_until="domcontentloaded")

            try:
                await page.wait_for_selector('.product-item', timeout=8000)
            except PlaywrightTimeout:
                await browser.close()
                return None

            # Croma price selectors
            price_selectors = ['.pdpPrice', '.new-price', 'span.amount', '.price']

            for selector in price_selectors:
                price_el = await page.query_selector(selector)
                if price_el:
                    price_text = await price_el.inner_text()
                    price_clean = re.sub(r'[^\d]', '', price_text)
                    if price_clean and int(price_clean) > 100:
                        title_el = await page.query_selector('.product-title, h3.product-name, .cp-name')
                        title = await title_el.inner_text() if title_el else query

                        link_el = await page.query_selector('a.product-title, a.cp-name, .product-item a')
                        href = await link_el.get_attribute('href') if link_el else ''
                        product_link = f"https://www.croma.com{href}" if href and href.startswith('/') else url

                        # MRP
                        mrp_el = await page.query_selector('.old-price, .mrp, .strike-price')
                        original_price = None
                        if mrp_el:
                            mrp_text = await mrp_el.inner_text()
                            mrp_clean = re.sub(r'[^\d]', '', mrp_text)
                            original_price = int(mrp_clean) if mrp_clean else None

                        await browser.close()
                        return {
                            "platformId": "croma",
                            "price": int(price_clean),
                            "originalPrice": original_price,
                            "inStock": True,
                            "coupon": "Check Croma for HDFC/ICICI bank offers",
                            "directLink": product_link,
                            "productTitle": title[:80]
                        }

            await browser.close()
            return None

    except Exception as e:
        print(f"[Croma Scraper] Error: {e}")
        return None
