from web import openBrowser
from sys import stdin
from furl import furl
from arguments import parseArguments
from utils import quit
import json
import time
import subjects


def main():
    args = parseArguments()
    browser = openBrowser(args)

    signIn(browser, args.login, args.password)
    print('Login successful.')
    print('Waiting for JSON input...')
    input = json.loads(stdin.read())
    subjs = input['subjects']
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
    browser.find_element_by_id('login').send_keys(login)
    browser.find_element_by_id('heslo').send_keys(password)
    browser.find_element_by_name('all').click()
    if 'login.php' in browser.current_url:
        browser.quit()
        quit(1, 'Incorrect login or password supplied.')


if __name__ == '__main__':
    main()
