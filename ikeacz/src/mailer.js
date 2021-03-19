const nodemailer = require('nodemailer')

class Mailer
{
    _transporter_opts = {
        host: 'smtp.seznam.cz',
        secure: true,
        port: 465,
        auth: {
            user: '<FROM EMAIL>',
            pass: '<FROM EMAIL PASSWORD>'
        }
    }

    _mail_opts = {
        from: '<FROM EMAIL>',
        to: '<TO EMAIL>',
        subject: 'Notifikace',
        text: 'SKRUVSTA je k dispozici.'
    }

    async send_email() {
        const transporter = nodemailer.createTransport(this._transporter_opts)
        const info = await transporter.sendMail(this._mail_opts)
        if(info.accepted.length > 0)
            console.log('Email odeslán na <TO EMAIL>.')
    }
}
module.exports = {Mailer}