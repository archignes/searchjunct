# config.py

# Base URL of the web application being tested
BASE_URL = "http://localhost:3000"

# Path to the JSON file containing systems data
SYSTEMS_DATA_PATH = "src/data/systems.json"

# Selenium WebDriver configuration
SELENIUM_CONFIG = {
    "browser": "chrome",  # Browser to use for testing (e.g., "chrome", "firefox")
    "headless": True,     # Run the browser in headless mode
    "implicit_wait": 10,  # Implicit wait time (in seconds) for WebDriver
    "page_load_timeout": 30,  # Page load timeout (in seconds)
}

# Test data
TEST_SEARCH_QUERY = "TestSelenium"

# Logging configuration
LOGGING_CONFIG = {
    "level": "INFO",  # Logging level (e.g., "DEBUG", "INFO", "WARNING", "ERROR")
    "format": "%(asctime)s - %(levelname)s - %(message)s",  # Log message format
    "filename": "test_execution.log",  # Log file name
}