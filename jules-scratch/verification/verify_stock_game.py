from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto(f'file://{os.path.abspath("index.html")}')

    # 1. Initial state
    page.screenshot(path="jules-scratch/verification/01_initial.png")

    # 2. Buy 10 shares of the first stock
    page.fill("#buy-qty-0", "10")
    page.click("#buy-btn-0")
    page.screenshot(path="jules-scratch/verification/02_after_buy.png")

    # 3. Sell 5 shares of the first stock
    page.fill("#sell-qty-0", "5")
    page.click("#sell-btn-0")
    page.screenshot(path="jules-scratch/verification/03_after_sell.png")

    # 4. Click the update button
    page.click("#update-button")
    # Note: We can't easily screenshot the alert, but we can verify the stats change after
    page.screenshot(path="jules-scratch/verification/04_after_update.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
