"""
UniEra – Selenium test suite (SLA Task 3)

Before running:
  1. Start MySQL (XAMPP), the backend (python app.py) and the frontend (npm run dev)
  2. cd devops\selenium   ->   pip install -r requirements.txt
  3. Run:   pytest -v

The site address can be changed with the env variable UNIERA_URL (default http://localhost:5173).
Chrome runs headless (no window) automatically inside Jenkins, like test_amazon.py in Expt 7.
Screenshots of every test are saved into devops/selenium/screenshots/ for your documentation.
"""
import os
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = os.environ.get("UNIERA_URL", "http://localhost:5173").rstrip("/")
SHOTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
os.makedirs(SHOTS, exist_ok=True)

# one unique test user per run, so signup never clashes with an old account
STAMP = str(int(time.time()))
TEST_USER = {
    "full_name": "Selenium Tester",
    "phone_number": "9876543210",
    "email": f"selenium{STAMP}@test.com",
    "password": "Test@1234",
}


@pytest.fixture(scope="module")
def driver():
    opts = webdriver.ChromeOptions()
    # inside Jenkins (or with HEADLESS=1) run without a window, exactly like test_amazon.py
    if os.environ.get("HEADLESS") == "1" or os.environ.get("JENKINS_HOME"):
        opts.add_argument("--headless=new")
        opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1400,900")
    opts.add_argument("--no-sandbox")
    if os.environ.get("CHROME_BIN"):
        opts.binary_location = os.environ["CHROME_BIN"]
    d = webdriver.Chrome(options=opts)   # Selenium 4 downloads the right chromedriver itself
    d.implicitly_wait(5)
    yield d
    d.quit()


def wait(driver, cond, t=10):
    return WebDriverWait(driver, t).until(cond)


def shot(driver, name):
    driver.save_screenshot(os.path.join(SHOTS, f"{name}.png"))


def logout(driver):
    driver.get(BASE_URL + "/")
    driver.execute_script("localStorage.clear();")


# ---------------------------------------------------------------- tests

def test_01_home_page_loads(driver):
    driver.get(BASE_URL + "/")
    heading = wait(driver, EC.visibility_of_element_located((By.TAG_NAME, "h1")))
    shot(driver, "01_home_page")
    assert heading.text.strip() != ""
    assert "Enroll Now" in driver.page_source


def test_02_universities_page_lists_universities(driver):
    driver.get(BASE_URL + "/universities")
    # the page loads universities from the Flask API -> proves frontend ↔ backend ↔ MySQL work
    wait(driver, EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "University"))
    time.sleep(1)
    shot(driver, "02_universities")
    assert "Macquarie" in driver.page_source


def test_03_signup_password_mismatch_shows_error(driver):
    logout(driver)
    driver.get(BASE_URL + "/signup")
    driver.find_element(By.NAME, "full_name").send_keys(TEST_USER["full_name"])
    driver.find_element(By.NAME, "phone_number").send_keys(TEST_USER["phone_number"])
    driver.find_element(By.NAME, "email").send_keys(TEST_USER["email"])
    driver.find_element(By.NAME, "password").send_keys("Test@1234")
    driver.find_element(By.NAME, "confirm_password").send_keys("Different@1")
    driver.find_element(By.CSS_SELECTOR, "input[type=checkbox]").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    wait(driver, EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "Passwords do not match"))
    shot(driver, "03_signup_mismatch")


def test_04_signup_new_user(driver):
    logout(driver)
    driver.get(BASE_URL + "/signup")
    driver.find_element(By.NAME, "full_name").send_keys(TEST_USER["full_name"])
    driver.find_element(By.NAME, "phone_number").send_keys(TEST_USER["phone_number"])
    driver.find_element(By.NAME, "email").send_keys(TEST_USER["email"])
    driver.find_element(By.NAME, "password").send_keys(TEST_USER["password"])
    driver.find_element(By.NAME, "confirm_password").send_keys(TEST_USER["password"])
    driver.find_element(By.CSS_SELECTOR, "input[type=checkbox]").click()
    shot(driver, "04a_signup_filled")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    # after signup the app logs the student in and leaves the /signup page
    wait(driver, lambda d: "/signup" not in d.current_url)
    wait(driver, lambda d: d.execute_script("return localStorage.getItem('user_id')"))
    shot(driver, "04b_signup_success")


def test_05_duplicate_signup_rejected(driver):
    logout(driver)
    driver.get(BASE_URL + "/signup")
    driver.find_element(By.NAME, "full_name").send_keys(TEST_USER["full_name"])
    driver.find_element(By.NAME, "phone_number").send_keys(TEST_USER["phone_number"])
    driver.find_element(By.NAME, "email").send_keys(TEST_USER["email"])
    driver.find_element(By.NAME, "password").send_keys(TEST_USER["password"])
    driver.find_element(By.NAME, "confirm_password").send_keys(TEST_USER["password"])
    driver.find_element(By.CSS_SELECTOR, "input[type=checkbox]").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    wait(driver, EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "already exists"))
    shot(driver, "05_duplicate_signup")


def test_06_login_wrong_password(driver):
    logout(driver)
    driver.get(BASE_URL + "/login")
    driver.find_element(By.NAME, "email").send_keys(TEST_USER["email"])
    driver.find_element(By.NAME, "password").send_keys("WrongPass1")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    wait(driver, EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "Incorrect password"))
    shot(driver, "06_login_wrong_password")


def test_07_login_success(driver):
    logout(driver)
    driver.get(BASE_URL + "/login")
    driver.find_element(By.NAME, "email").send_keys(TEST_USER["email"])
    driver.find_element(By.NAME, "password").send_keys(TEST_USER["password"])
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    wait(driver, lambda d: "/login" not in d.current_url)
    assert driver.execute_script("return localStorage.getItem('email')") == TEST_USER["email"]
    shot(driver, "07_login_success")


def test_08_portal_is_protected(driver):
    # a student who has not enrolled/paid must not get into the portal
    logout(driver)
    driver.get(BASE_URL + "/portal")
    time.sleep(1.5)
    shot(driver, "08_portal_protected")
    assert "/portal" not in driver.current_url or "Login" in driver.page_source
