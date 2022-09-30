from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
import web


def existsElementByLinkText(browser, linkText):
    try:
        browser.find_element(By.LINK_TEXT, linkText)
    except NoSuchElementException:
        return False
    return True


def existsElementById(browser, id):
    try:
        browser.find_element(By.ID, id)
    except NoSuchElementException:
        return False
    return True


def existsElementByValue(browser, value):
    try:
        web.find_element_by_value(browser, value)
    except NoSuchElementException:
        return False
    return True


def isIntegral(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


def quit(code, msg):
    print(msg)
    exit(code)

