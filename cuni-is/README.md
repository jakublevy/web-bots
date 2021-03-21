# cuni-is bot
(Charles University Information System Bot)

I really hate having to enroll classes manually at midnight hoping that I'll be fast enough to get a place at my preselected tutorials. That's why I decided to create this small python script that automatically enrolls your classes.

## Dependencies
Before using the script you need to install a few libraries:
```shell
$ pip install selenium
$ pip install pyquery
$ pip install furl
```

## Usage
```shell
$ python main.py -h
usage: main.py [-h] -l LOGIN [-p PASSWORD] [-d WEBDRIVER] [-w WAIT]

optional arguments:
  -h, --help            show this help message and exit

  -l LOGIN, --login LOGIN
                        login nick or uk number to sis

  -p PASSWORD, --password PASSWORD
                        password to login to sis

  -d WEBDRIVER, --webdriver-path WEBDRIVER
                        path to webdriver (chromedriver, geckodriver or
                        operadriver)

  -w WAIT, --wait WAIT  number of seconds to wait between repeated enrollment
                        attempts (default is 10)
```
* Only `-l` argument is required.
* [Webdriver](https://www.seleniumhq.org/download/) has to be in the same directory as [main.py](src/main.py), PATH or specified manually using `-d`.
* Your password will be prompted at runtime, if not supplied.
* Classes to enroll are read from stdin in JSON format (see [INPUT.md](INPUT.md)).

## Example
Suppose we want to attend Automata and Grammars and Non-procedural Programming classes. Let's create a corresponding input file *input.json*.
```javascript
{
   "subjects": [
      {
         "lecture": "18bNTIN071p2",
         "tutorial": "18bNTIN071x03",
         "faculty": 11320,
         "enrollmentSucceededMsg" : "Automata and Grammars - enrolled!",
         "enrollmentFailedMsg": "Automata and Grammars - failed"
      },
      {
         "lecture": "18bNPRG005p1",
         "tutorial": "18bNPRG005x02",
         "faculty": 11320,
         "enrollmentSucceededMsg": "Non-procedural programming - enrolled!",
         "enrollmentFailedMsg": "Non-procedural programming - failed"
      }
   ]
}
```
(More about the format of this file in [INPUT.md](INPUT.md)). 

Assuming that we have downloaded [chromedriver](http://chromedriver.chromium.org/) as a webdriver. We can start the script by executing
```shell
$ python main.py -l novakpe < input.json
```
If the [chromedriver](http://chromedriver.chromium.org/) was not found, try specifying the path.
```shell
$ python main.py -l novakpe -d ~/Downloads/chromedriver < input.json
```
