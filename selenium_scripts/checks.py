""" This script performs automated Selenium checks for a web application, covering page loading, search functionality, and verifying the count of systems listed. These tests ensure the application's key features work as expected.
To run these tests, have pytest and Selenium installed. Execute the tests with:
p -m pytest selenium_scripts/checks.py --html=report.html -n 4

Ensure the web application is running on the configured BASE_URL before testing.
"""

import json
from pydantic import BaseModel, ValidationError

import pytest
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

from config import SYSTEMS_DATA_PATH, BASE_URL

class SystemData(BaseModel):
    id: str
    name: str
    search_link: str

@pytest.fixture(scope="function")
def driver(request):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(options=options)
    request.cls.driver = driver
    request.cls.wait = WebDriverWait(driver, 10)
    yield
    driver.quit()

@pytest.fixture(scope="class")
def systems_data():
    with open(SYSTEMS_DATA_PATH) as f:
        systems_raw = json.load(f)
    systems_data = [SystemData(**system) for system in systems_raw]
    return systems_data

@pytest.mark.usefixtures("driver", "systems_data")
class TestLoading:
    def test_page_loads(self):
        self.driver.get(BASE_URL)
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        assert "Searchjunct" in self.driver.title, "Page title verification: Failure"

@pytest.mark.usefixtures("driver")
class TestSearching:
    def wait_for_element(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def verify_new_tab(self):
        try:
            assert len(self.driver.window_handles) == 2
        except AssertionError:
            pytest.fail("New tab opening verification after search submit: Failure")
        
        self.driver.switch_to.window(self.driver.window_handles[1])
        try:
            assert self.driver.current_url.startswith(f"{BASE_URL}/testing"), \
                "URL verification: Failure"
        except AssertionError:
            print(self.driver.find_element_by_tag_name('body').text)
            raise
        assert "Click here to open the link" in self.driver.page_source, \
            "Text presence verification: Failure"
        self.driver.close()
        self.driver.switch_to.window(self.driver.window_handles[0])

    def test_search_functionality_submit(self):
        self.driver.get(BASE_URL)
        
        search_box = self.wait_for_element((By.TAG_NAME, "textarea"))
        search_box.send_keys("TestSelenium")
        search_box.submit()

        self.wait.until(lambda driver: len(driver.window_handles) == 2)
        self.verify_new_tab()

    def test_search_functionality_enter(self):
        self.driver.get(BASE_URL)
        search_box = self.wait_for_element((By.TAG_NAME, "textarea"))
        search_box.send_keys("TestSelenium")
        search_box.send_keys(Keys.ENTER)
        self.wait.until(lambda driver: len(driver.window_handles) == 2)  
        self.verify_new_tab()

@pytest.mark.usefixtures("driver", "systems_data")
class TestSearchResultLinks:
    def test_verify_search_result_links(self, systems_data):
        self.driver.get(BASE_URL)
        self.wait = WebDriverWait(self.driver, 10)
        search_box = self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "textarea")))
        selected_system = random.choice(systems_data)

        search_box.send_keys("blah") 
        system_search_link = self.wait.until(EC.presence_of_element_located((By.ID, f"system-search-link-{selected_system.id}")))
        system_search_link.click()
        self.wait.until(lambda driver: len(driver.window_handles) == 2)
        self.driver.switch_to.window(self.driver.window_handles[1])

        expected_prepped_system_search_link = selected_system.search_link.replace('%s', 'blah')
        expected_link_text = "Click here to open the link"
        
        body_text = self.driver.find_element(By.TAG_NAME, 'body').text
        try:
            assert expected_prepped_system_search_link in body_text, \
                f"Expected prepped system search link not found in body text for {selected_system.name}."
            print(f"[SUCCESS] Expected prepped system search link verified for {selected_system.name}")
        except AssertionError:
            print(body_text)
            pytest.fail(f"Expected prepped system search link not found in body text for {selected_system.name}. Expected: {expected_prepped_system_search_link}")
        assert expected_link_text in self.driver.page_source
        try:
            print(f"[SUCCESS] Link text presence verified for {selected_system.name}") 
        except AssertionError:
            pytest.fail(f"Expected link text not found in page source for {selected_system.name}. Expected: {expected_link_text}")

        self.driver.close()
        self.driver.switch_to.window(self.driver.window_handles[0])

@pytest.mark.usefixtures("driver", "systems_data")
class TestShortcutFunctionality:
    def test_shortcut_google(self):
        self.driver.get(BASE_URL)
        search_box = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "textarea")))
        search_box.send_keys("/google")
        systems_list = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "systems-list"))
        )
        systems = systems_list.find_elements(By.CLASS_NAME, "system-item")
        assert len(systems) == 2, "Shortcut functionality verification: Failure"
        system_names = [system.text for system in systems]
        assert "Google" in system_names, "Google system not found in filtered list"
        assert "Google Gemini" in system_names, "Google Scholar system not found in filtered list"

@pytest.mark.usefixtures("driver", "systems_data")
class TestNumberedShortcutFunctionality:
    def test_shortcut_numbered_url(self):
        self.driver.get(BASE_URL)
        search_box = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "textarea")))
        search_box.send_keys("blah /3")
        assert self.driver.current_url == f"{BASE_URL}/?shortcut=3"

    def test_shortcut_numbered_new_tabs(self):  
        self.driver.get(f"{BASE_URL}/?shortcut=3")
        search_box = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "textarea"))) 
        search_box.send_keys(Keys.RETURN)
        WebDriverWait(self.driver, 10).until(lambda driver: len(driver.window_handles) == 4)
        for window_handle in self.driver.window_handles[1:]:
            self.driver.switch_to.window(window_handle)
            expected_url_prefix = f"{BASE_URL}/testing" 
            actual_url = self.driver.current_url
            assert actual_url.startswith(expected_url_prefix), \
                f"URL verification: Failure. Expected URL to start with {expected_url_prefix}, but got {actual_url}"
            expected_text = "Click here to open the link"
            assert expected_text in self.driver.page_source, \
                f"Text presence verification: Failure. Expected to find text '{expected_text}'"
            self.driver.close()
        self.driver.switch_to.window(self.driver.window_handles[0])

@pytest.mark.usefixtures("driver", "systems_data")
class TestSystemsList:

    def test_systems_list_count(self, systems_data):
        self.driver.get(BASE_URL)
        systems_list = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "systems-list"))
        )
        systems = systems_list.find_elements(By.CLASS_NAME, "system-item")
        assert len(systems) == len(systems_data), "Number of systems verification: Failure"
