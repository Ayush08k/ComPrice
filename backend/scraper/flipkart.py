"""
Flipkart.com Playwright Scraper
Fetches real-time product prices from Flipkart search results.
"""
import re
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout


async def scrape_flipkart(query: str) -> dict | None:
    """
    Scrapes Flipkart for the first matching product price.
    Returns normalized price data or None on failure.
    """
    url = f"https://www.flipkart.com/search?q={query.replace(' ', '+')}&otracker=search"

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

            # Block images to speed up
            await page.route("**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf}", lambda r: r.abort())

            await page.goto(url, timeout=20000, wait_until="domcontentloaded")

            # Handle Flipkart login popup if it appears
            try:
                close_btn = await page.wait_for_selector('button._2KpZ6l._2doB4z', timeout=3000)
                if close_btn:
                    await close_btn.click()
            except PlaywrightTimeout:
                pass

            # Wait for product grid
            try:
                await page.wait_for_selector('div._1AtVbE', timeout=8000)
            except PlaywrightTimeout:
                await browser.close()
                return None

            # Try multiple Flipkart price selectors (they change frequently)
            price_selectors = [
                '._30jeq3._1_WHN1',  # Main price in search results
                '._30jeq3',
                '.Nx9bqj.CxhGGd',
                '._1_WHN1'
            ]

            for selector in price_selectors:
                price_el = await page.query_selector(selector)
                if price_el:
                    price_text = await price_el.inner_text()
                    price_clean = re.sub(r'[^\d]', '', price_text)
                    if price_clean and int(price_clean) > 100:
                        # Get product title
                        title_el = await page.query_selector('._4rR01T, .s1Q9rs, .IRpwTa')
                        title = await title_el.inner_text() if title_el else query

                        # Get product link
                        link_el = await page.query_selector('a._1fQZEK, a.s1Q9rs, a._2rpwqI')
                        href = await link_el.get_attribute('href') if link_el else ''
                        product_link = f"https://www.flipkart.com{href}" if href.startswith('/') else href

                        # Get original/MRP price
                        mrp_el = await page.query_selector('._3I9_wc, ._3auQ3N')
                        original_price = None
                        if mrp_el:
                            mrp_text = await mrp_el.inner_text()
                            mrp_clean = re.sub(r'[^\d]', '', mrp_text)
                            original_price = int(mrp_clean) if mrp_clean else None

                        await browser.close()
                        return {
                            "platformId": "flipkart",
                            "price": int(price_clean),
                            "originalPrice": original_price,
                            "inStock": True,
                            "coupon": "Check Flipkart for bank offers",
                            "directLink": product_link or url,
                            "productTitle": title[:80]
                        }

            await browser.close()
            return None

    except Exception as e:
        print(f"[Flipkart Scraper] Error: {e}")
        return None
