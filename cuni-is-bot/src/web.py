from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from utils import quit


def find_element_by_value(browser, value):
    return browser.find_element_by_xpath('//input[@value=\'' + value + '\']')


def openBrowser(args):
    if args.webdriver is not None:
        if 'chromedriver' in args.webdriver:
            try:
                browser = webdriver.Chrome(args.webdriver)
                return browser
            except WebDriverException:
                quit(3, '-p value does not point to valid chromedriver, try downloading chromedriver again.')

        elif 'geckodriver' in args.webdriver:
            try:
                browser = webdriver.Firefox(args.webdriver)
                return browser
            except WebDriverException:
                quit(3, '-p value does not point to valid geckodriver, try downloading geckodriver again.')

        elif 'operadriver' in args.webdriver:
            try:
                browser = webdriver.Opera(args.webdriver)
                return browser
            except WebDriverException:
                quit(3, '-p value does not point to valid operadriver, try downloading operadriver again.')
        else:
            quit(3, 'Invalid -p value. It should contain chromedriver, geckodriver or operadriver.')

    else:
        try:
            browser = webdriver.Chrome()
            return browser
        except WebDriverException:
            pass

        try:
            browser = webdriver.Firefox()
        except WebDriverException:
            pass

        try:
            browser = webdriver.Opera()
        except WebDriverException:
            quit(4, """Error: No webdriver found.
1. Download chromedriver, geckodriver or operadriver according to your browser preferences.
2. Place it into a folder containing this script.
3. Start main.py again.""")
