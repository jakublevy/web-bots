const puppeteer = require('puppeteer')

class Ikea
{
    static async build() {
        const i = new Ikea()

        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"',
            //'--window-position=4000,0'
        ];
        const options = { args, headless: false, ignoreHTTPSErrors: true, defaultViewport: null, slowMo: 100 }

        i._browser = await puppeteer.launch(options)

        i._context = await i._browser.createIncognitoBrowserContext()
        i._page = await i._context.newPage()
        return i
    }

    async skruvsta_available() {
        await this._page.goto('https://www.ikea.com/cz/cs/p/skruvsta-otocna-zidle-vissle-seda-30280004')
        await this._add_to_basket(true)
        await this._select_store('Praha Černý Most')
        return await this._domu()

    }

    async add_to_basket(url, continue_to_view_basket) {
        await this._page.goto(url)
        await this._add_to_basket(continue_to_view_basket)
    }

    async _add_to_basket(continue_to_view_basket) {
        await this._page.waitForSelector('.range-revamp-leading-icon .range-revamp-btn__label')
        await this._page.click('.range-revamp-leading-icon .range-revamp-btn__label')

        if(continue_to_view_basket) {
            await this._clickByXpath(`//a[text() = "Pokračovat k nákupnímu košíku"]`)
        }
        else {
            await this._page.waitForXPath(`//a[text() = "Pokračovat k nákupnímu košíku"]`)
        }
    }

    async _select_store(store) {
        let selectedIndex
        if(store === 'Praha Černý Most')
            selectedIndex = 3
        else if(store === 'Praha-Zličín')
            selectedIndex = 4


        await this._page.waitForSelector(`#storeselector`)
        await this._page.click('#storeselector')
         await this._page.$eval(`#storeselector`, (el, store, selectedIndex) => {
             el.value = store
             el.selectedIndex = selectedIndex
         }, store, selectedIndex)
    }

    async _domu() {
        //Doprava
        await this._clickByXpath(`//span[contains(.,'Doprava')]`)

        //PSC
        await this._page.type('#clickdeliver_postcode', '54911', {delay: 100})

        //Nakup on-line
        await this._clickByXpath(`//span[contains(.,'Nákup on-line')]`)

        //failed?
        const xpaths = [
            `//*[text() = "Omlouváme se, ale vzhledem k nízké skladové zásobě ve vámi vybraném obchodním domě výrobek (výrobky) nelze zakoupit on-line."]`,
            `//p[@class = "error-helper"]`
        ]
        for (const xpath of xpaths) {
            try {
                await this._page.waitForXPath(xpath, {timeout: 10000})
                const ehs = await this._page.$x(xpath)
                if(ehs.length > 0)
                    return false
            }
            catch(e){
            }
        }
        return true
    }

    async _clickByXpath(xpath) {
        await this._page.waitForXPath(xpath)
        const eh = (await this._page.$x(xpath))[0]
        await eh.evaluate(el => el.click())
    }

    async release() {
        this._released = true
        await this._page.close()
        await this._context.close()
        await this._browser.close()
    }

    released() {
        return this._released
    }

}

module.exports = {Ikea}