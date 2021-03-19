# Ecom Basket Import
If you happen to order a lot of electronic parts from [ecom.cz](https://ecom.cz), you may like the "export basket to csv" button. Unfortunately, the basket is lost when the session expires, and there is no way to quickly import your basket back. That is the reason for creating this script. 

The script can just export a cookie with a new session containing a basket or open a new browser instance with imported order.

```
Usage: PROGRAM [OPTION]... [FILE]...
Imports basket on ecom.cz from csv.

With no FILE parameter containing file, reads standard input.

  --chromium         path to the Chromium executable (required 
                     only if Chromium not in $PATH)

  -c|--cookie        if used, returns the cookie value of 
                     the session containing the imported order, 
                     it also forces the browser to close if used
                                
  -h|--headless      runs chrome in headless mode
  --help             shows this help
  -v|--verbose       outputs the name of file which is being processed
  
Error codes:
  1                  Input has incorrectly structured data.
  2                  Input contains non-existing products.
  3                  --chromium parameter contains incorrect path. 
  4                  Chromium executable could not be found in $PATH.
  5                  -f|--file does not point to an existing file.
  ```