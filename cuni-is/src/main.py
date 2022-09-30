from web import openBrowser
from sys import stdin
from furl import furl
from arguments import parseArguments
from utils import quit
from selenium.webdriver.common.by import By
import json
import time
import subjects


def main():
    args = parseArguments()
    browser = openBrowser(args)
    browser.set_window_size(1920, 1080)

    signIn(browser, args.login, args.password)
    print('Login successful.')
    print('Waiting for JSON input...')
    inp = json.loads(stdin.read())
    subjs = inp['subjects']
    subjects.addEnrollmentUrl(subjs, browser)
    print('Input successfully loaded.')
    print('Starting...')
    while len(subjs) > 0:
        for subject in subjs:
            browser.get(subject['url'])

            if subjects.isEnrollable(browser):
                subjects.enroll(browser, subject)

                if 'enrollmentSucceededMsg' in subject:
                    print(subject['enrollmentSucceededMsg'])

                subjs.remove(subject)

            elif 'enrollmentFailedMsg' in subject:
                print(subject['enrollmentFailedMsg'])

        time.sleep(args.wait)


def signIn(browser, login, password):
    browser.get('https://is.cuni.cz/studium/')
    browser.find_element(By.ID, 'login').send_keys(login)
    browser.find_element(By.ID, 'heslo').send_keys(password)
    browser.find_element(By.NAME, 'all').click()
    if 'login.php' in browser.current_url:
        browser.quit()
        quit(1, 'Incorrect login or password supplied.')
    browser.implicitly_wait(3)
    el = browser.find_element(By.XPATH, '//span[text() = "Vstup do SIS3  "]/parent::a')
    el.click()


if __name__ == '__main__':
    main()
