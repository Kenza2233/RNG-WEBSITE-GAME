
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to the local HTML file
        await page.goto(f"file://{os.getcwd()}/index.html")

        # Wait for the page to load and animations to settle
        await page.wait_for_load_state('networkidle')
        await page.wait_for_timeout(1000)

        # Screenshot the initial Market view
        await page.screenshot(path="jules-scratch/verification/01_market_view_final.png")

        # Navigate to the Leaderboard view
        await page.click('a[href="#leaderboard"]')
        await page.wait_for_timeout(500) # Wait for view to switch

        # Screenshot the Leaderboard view
        await page.screenshot(path="jules-scratch/verification/02_leaderboard_view_final.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
