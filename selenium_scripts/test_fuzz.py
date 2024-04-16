""" This script performs automated Selenium fuzz testing on the application. It randomly clicks on buttons on the page.
To run these tests, have pytest and Selenium installed. Execute the tests with:
p -m pytest selenium_scripts/test_fuzz.py --html=report.html -n 4
"""

import random
import time

import pytest
from config import BASE_URL
from selenium import webdriver
from selenium.common.exceptions import (
    ElementNotInteractableException,
    StaleElementReferenceException,
    ElementClickInterceptedException
)
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    driver.get(BASE_URL)
    yield driver
    driver.quit()

def log_button_info(browser, button):
    button_id = button.get_attribute('id')
    print(f"Button ID: {button_id}")
    print(f"URL: {browser.current_url}")
    print(f"Class name: {button.get_attribute('class')}")
    print(f"is_displayed(): {button.is_displayed()}, is_enabled(): {button.is_enabled()}, is_selected(): {button.is_selected()}")

def find_parent_with_id(element):
    while element.tag_name.lower() != "body":
        element = element.find_element(By.XPATH, "..")
        element_id = element.get_attribute('id')
        if element_id and "radix" not in element_id:
            return element_id
    return None

def handle_known_exceptions(browser, button):
    log_button_info(browser, button)
    parent_id = find_parent_with_id(button)
    print(f"Parent: {parent_id if parent_id else 'No ID or contains radix'}")

    try:
        button.click()
    except (ElementNotInteractableException, StaleElementReferenceException, ElementClickInterceptedException) as e:
        print(f"Exception occurred: {type(e).__name__}")

def get_unique_buttons(browser):
    buttons = browser.find_elements(By.TAG_NAME, "button")
    print(f"Found {len(buttons)} buttons...")

    buttons_by_id = {}
    for button in buttons:
        button_id = button.get_attribute('id')
        if button_id:
            buttons_by_id.setdefault(button_id, []).append(button)

    unique_buttons = [random.choice(buttons) for buttons in buttons_by_id.values()]
    print(f"Found {len(unique_buttons)} unique buttons...")
    print(f"Button IDs: {list(buttons_by_id.keys())}")

    return unique_buttons

def click_button(browser, unique_buttons, max_clicks=10):
    click_count = 0

    while unique_buttons and click_count < max_clicks:
        button = random.choice(unique_buttons)
        button_id = button.get_attribute("id")

        if button_id:
            # Relocate the button by its ID to avoid stale element issues
            button = browser.find_element(By.ID, button_id)

        print(f"Clicking on button: {button_id if button_id else 'No ID'}")

        try:
            button.click()
            if "testing" in browser.current_url:
                print("Testing page")
                browser.close()
                return
        except (ElementNotInteractableException, StaleElementReferenceException, ElementClickInterceptedException):
            handle_known_exceptions(browser, button)

        click_count += 1
        time.sleep(random.uniform(0, 0.02))

        unique_buttons = get_unique_buttons(browser)

def test_fuzz_click_buttons(browser):
    try:
        # Wait for page to load and collect all buttons
        WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "button"))
        )

        for _ in range(10):
            print(f"Starting loop {_}")
            click_button(browser, get_unique_buttons(browser))

    except Exception as e:
        print("Error during fuzz testing:", e)
        assert False, "Fuzz testing failed due to an error"
