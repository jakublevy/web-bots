const puppeteer = require('puppeteer-core')
const fs = require('fs')
const readline = require('readline')
const {add_to_basket, goto_basket, page_cookies, die} = require('./ecom');

(async() => {
    await main()
})()

async function main() {
    const argv = require('minimist')(process.argv.slice(2));
    let browser, page
    let exit_code = 0
    if ('help' in argv) {
        show_help()
    }
    else if(argv._.length > 0) {
        const pupp_start = await start_browser(argv)
        browser = pupp_start.browser
        page = pupp_start.page
        for(const f of argv._) {
            if('v' in argv || 'verbose' in argv)
                console.log(`Processing file ${f}`)
            if(fs.existsSync(f) && fs.lstatSync(f).isFile()) {
                await file_mode(f, pupp_start)
            }
            else {
                console.error(`Error: ${f} does not point to an existing file.`)
                exit_code = 5
            }
        }
        await goto_basket(page)
    }
    else {
        const pupp_start = await start_browser(argv)
        browser = pupp_start.browser
        page = pupp_start.page
        await stdin_mode(pupp_start)
    }
    if(('c' in argv || 'cookie' in argv) && (browser !== undefined && page !== undefined)) {
        const {name, value} = await page_cookies(page)
        console.log(`${name}: ${value}`)
        await browser.close()
    }
    if(('headless' in argv || 'h' in argv) && !('c' in argv || 'cookie' in argv))
        process.exit(exit_code)
}

async function stdin_mode(pupp_start) {
    await process_csv(process.stdin, pupp_start.page)
    await goto_basket(pupp_start.page)
}

async function file_mode(path, pupp_start) {
    const input = fs.createReadStream(path)
    await process_csv(input, pupp_start.page)

}

function process_csv(input, page) {
    return new Promise(async (resolve, reject) => {
        const line_reader = readline.createInterface({input, terminal: false, crlfDelay: Infinity})

        for await(const line of line_reader) {
            await add_to_basket(line, page)
        }
        await resolve('EOF reached.')
    })
}

async function start_browser(argv) {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"',
    ];
    const options = {
        args,
        headless: false,
        ignoreHTTPSErrors: true,
        defaultViewport: null
    }
    if('headless' in argv || 'h' in argv)
        options.headless = true

    if('chromium' in argv)
        options.executablePath = argv.chromium

    try {
        const browser = await puppeteer.launch(options)
        const page = await startup_page(browser)
        return {browser, page}
    }
    catch (e) {
        if('chromium' in argv)
            die("Error: Incorrect path to Chromium.", 3)
        else
            die("Error: Chromium executable could not be found in $PATH.", 4)
    }
}

async function startup_page(browser) {
    return (await browser.pages())[0]
}

function show_help() {
    const help =
`Usage: PROGRAM [OPTION]... [FILE]...
Imports basket on ecom.cz from csv.

With no FILE parameter containing file, reads standard input.

  --chromium                 path to the Chromium executable (required only if Chromium not in $PATH)
  -c|--cookie                if used, returns the cookie value of the session containing the imported order, 
                             it also forces the browser to close if used
                                
  -h|--headless              runs chrome in headless mode
  --help                     shows this help
  -v|--verbose               outputs the name of file which is being processed
  
Error codes:
  1                          Input has incorrectly structured data.
  2                          Input contains non-existing products.
  3                          --chromium parameter contains incorrect path. 
  4                          Chromium executable could not be found in $PATH.
  5                          -f|--file does not point to an existing file.
`
    console.log(help)
}