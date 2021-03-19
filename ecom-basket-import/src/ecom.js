async function add_to_basket(line, page) {
    const prod = parse_csv(line)

    try {

        await page.goto(product_url(prod))

        await page.waitForSelector('#quantity')
        await page.evaluate(() => document.getElementById('quantity').value = '')
        await page.type('#quantity', prod.amount)

        await page.waitForSelector('#btnquantity' + prod.id)
        await page.click('#btnquantity' + prod.id)

        await page.waitForSelector('#btnAlertOK', {visible: true})
        await page.click('#btnAlertOK')
    }
    catch(e) {
        die('Error: Non-existing products in input.', 2)
    }
}

async function goto_basket(page) {
    await page.waitForXPath('//form[@action="/Order/KontrolaObj"]')
    const form = (await page.$x('//form[@action="/Order/KontrolaObj"]'))[0]
    await form.evaluate((f) => f.submit())
}

async function page_cookies(page) {
    const cookies = await page.cookies()
    const session_cookie = cookies.find(x => x.name === 'UserGd')
    return {name: session_cookie.name, value: session_cookie.value}
}

function product_url(prod) {
    return 'https://www.ecom.cz/Eshop/Detail/' + prod.id
}

function parse_csv(csv) {
    const split = csv.split(';')
    if (split.length >= 2)
        return {
            id: split[0],
            amount: split[1]
        }
    else
        die('Error: Incorrect input.', 1)
}

function die(msg, errCode) {
    console.error(msg)
    console.log('Run with --help to show help.')
    process.exit(errCode)
}

module.exports = {add_to_basket, goto_basket, page_cookies, die}