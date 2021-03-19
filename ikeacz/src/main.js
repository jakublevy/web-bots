const {Ikea} = require('./ikea')
const {Mailer} = require('./mailer')
const cron = require('node-cron');


(async () => {
    await main()
})()

async function main() {
    const every_5_minutes = '*/5 * * * *'
    const every_20_seconds = '*/20 * * * * *'

    const job = cron.schedule(every_5_minutes, async () => {
        const i = await check()
        if(!i.released()) {
            loop(i)
            job.destroy()
        }
    })
}

async function loop(ikea) {
    const other_products = [
        'https://www.ikea.com/cz/cs/p/proppmaett-prkenko-buk-70233421/',
        'https://www.ikea.com/cz/cs/p/hildegun-zastera-00484045/',
        'https://www.ikea.com/cz/cs/p/hildegun-uterka-cervena-00484007/',
        'https://www.ikea.com/cz/cs/p/vagsjoen-osuska-nachova-50439404/',
        'https://www.ikea.com/cz/cs/p/bittergurka-kvetinac-bila-80285787/',
        'https://www.ikea.com/cz/cs/p/vinnfar-koupelnova-predlozka-tm-zelena-50439395/',
        'https://www.ikea.com/cz/cs/p/vagsjoen-rucnik-tmave-seda-00353619/'
    ]

    for(let i = 0; i < other_products.length - 1; ++i)
        await ikea.add_to_basket(other_products[i], false)


    await ikea.add_to_basket(other_products[other_products.length - 1], true)


    while(true) {

    }
}


async function check() {
    const i = await Ikea.build()
    let result = false
    if(await i.skruvsta_available()) {
        await new Mailer().send_email()
        result = true
    }
     if(!result)
         await i.release()

    return i
}
