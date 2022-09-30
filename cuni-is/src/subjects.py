from furl import furl
from utils import existsElementByLinkText
from utils import existsElementByValue
from pyquery import PyQuery
import datetime
from web import find_element_by_value
from selenium.webdriver.common.by import By


def enroll(browser, subject):
    find_element_by_value(browser, 'Zapsat').click()
    if 'tutorial' in subject:
        if existsElementByValue(browser, subject['tutorial']):
            find_element_by_value(browser, subject['tutorial']).click()
    if 'lecture' in subject:
        if existsElementByValue(browser, subject['lecture']):
            find_element_by_value(browser, subject['lecture']).click()

    if existsElementByValue(browser, 'Zapsat'):
        find_element_by_value(browser, 'Zapsat').click()
    else:
        find_element_by_value(browser, 'Změnit').click()


def isEnrollable(browser):
    return browser.find_element(By.XPATH, '//input[@value="Zapsat"]') and isFree(browser.page_source)


def isFree(html):
    pq = PyQuery(html)
    tag = pq('table.tab1')

    out_tuple = []
    str_coll = tag.text().split('\n')

    for i in range(len(str_coll)):
        if str_coll[i] == 'Aktuální počet studentů:' or str_coll[i] == 'Maximální počet studentů:':
            out_tuple.append(str_coll[i+1])

    if len(out_tuple) < 2:
        return False

    return int(out_tuple[0]) < int(out_tuple[1])


def makeUrl(subject, browser):
    gl = enrollmentId(subject)
    fac = faculty(subject, browser)
    return furl('https://is.cuni.cz/studium/rozvrhng/roz_predmet_gl.php').add({'gl': gl,
                                                                               'id': sessionId(browser),
                                                                               'fak': fac,
                                                                               'skr': year(subject),
                                                                               'sem': semester(subject)}).url


def enrollmentId(subject):
    return subject['tutorial'] if 'tutorial' in subject else subject['lecture']


def addEnrollmentUrl(subjects, sessionId):
    for subject in subjects:
        subject['url'] = makeUrl(subject, sessionId)


def sessionId(browser):
    return furl(browser.current_url).args['id']


def semester(subject):
    if 'semester' in subject:
        return subject['semester']
    else:
        m = datetime.date.today().month
        return 1 if 5 < m < 12 else 2


def year(subject):
    if 'year' in subject:
        return subject['year']
    else:
        y = datetime.date.today().year
        return y-1 if semester(subject) == 2 else y


def faculty(subject, browser):
    if 'faculty' in subject:
        return subject['faculty']
    else:
        pass
        # TODO: somehow try to find the faculty code if one was not supplied
