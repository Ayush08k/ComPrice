"""
Reliance Digital Playwright Scraper
Fetches real-time product prices from Reliance Digital search results.
"""
import re
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout


async def scrape_reliance(query: str) -> dict | None:
    """
    Scrapes Reliance Digital for the first matching product price.
    """
    url = f"https://www.reliancedigital.in/search?q={query.replace(' ', '+')}"

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
                await page.wait_for_selector('.product-item, .product__list--item, .Grid__Cell', timeout=8000)
            except PlaywrightTimeout:
                await browser.close()
                return None

            price_selectors = [
                'span.pdp__offerPrice',
                'span.product__price--new',
                '.product-price',
                'p.price',
                '.price-tag'
            ]

            for selector in price_selectors:
                price_el = await page.query_selector(selector)
                if price_el:
                    price_text = await price_el.inner_text()
                    price_clean = re.sub(r'[^\d]', '', price_text)
                    if price_clean and int(price_clean) > 100:
                        title_el = await page.query_selector('.product__title, .product-title, p.product__name')
                        title = await title_el.inner_text() if title_el else query

                        link_el = await page.query_selector('a.product__link, a.product-link, .product-item a')
                        href = await link_el.get_attribute('href') if link_el else ''
                        product_link = f"https://www.reliancedigital.in{href}" if href and href.startswith('/') else url

                        mrp_el = await page.query_selector('span.pdp__price, .product__price--old, .mrp')
                        original_price = None
                        if mrp_el:
                            mrp_text = await mrp_el.inner_text()
                            mrp_clean = re.sub(r'[^\d]', '', mrp_text)
                            original_price = int(mrp_clean) if mrp_clean and int(mrp_clean) > int(price_clean) else None

                        await browser.close()
                        return {
                            "platformId": "reliance",
                            "price": int(price_clean),
                            "originalPrice": original_price,
                            "inStock": True,
                            "coupon": "Check Reliance Digital for cashback offers",
                            "directLink": product_link,
                            "productTitle": title[:80]
                        }

            await browser.close()
            return None

    except Exception as e:
        print(f"[Reliance Scraper] Error: {e}")
        return None
