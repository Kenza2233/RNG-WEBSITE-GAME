import os
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    file_path = os.path.abspath('index.html')
    page.goto(f"file://{file_path}")

    # Simulate the view switching by directly changing the style
    page.evaluate("document.getElementById('leaderboard-view').style.display = 'block'")

    page.screenshot(path="jules-scratch/verification/leaderboard_verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
