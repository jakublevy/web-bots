from getpass import getpass
from argparse import ArgumentParser
from utils import isIntegral
from utils import quit


def parseArguments():
    parser = ArgumentParser()
    parser.add_argument('-l', '--login', dest='login', help='login nick or uk number to sis', required=True)
    parser.add_argument('-p', '--password', dest='password', help='password to login to sis')
    parser.add_argument('-d', '--webdriver-path', dest='webdriver', help='path to webdriver (chromedriver, geckodriver or operadriver)')
    parser.add_argument('-w', '--wait', dest='wait', default=10, help='number of seconds to wait between repeated enrollment attempts (default is 10)')
    args = parser.parse_args()

    credentials(args)
    waitingTime(args)
    return args


def credentials(args):
    if args.password is None:
        args.password = getpass("Password: ")


def waitingTime(args):
    if isIntegral(args.wait):
        args.wait = int(args.wait)
    else:
        quit(2, 'Incorrent waiting time supplied.')
