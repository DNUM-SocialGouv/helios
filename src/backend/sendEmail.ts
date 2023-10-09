const buildEmailBody = (receiver: string, subject: string, htmlBody: string) => {
    const body = {
        to: [
            {
                address: receiver,
            }
        ],
        msg: {
            from: {
                personalName: process.env['TIPIMAIL_SENDER_NAME'],
                address: process.env['TIPIMAIL_SENDER_ADDRESS']
            },
            subject: subject,
            html: htmlBody

        }
    }
    return JSON.stringify(body);
}

export const sendEmail = async (receiver: string, subject: string, htmlBody: string) => await fetch('https://api.tipimail.com/v1/messages/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Tipimail-ApiUser': process.env['TIPIMAIL_APIUSER'] || '',
        'X-Tipimail-ApiKey': process.env['TIPIMAIL_APIKEY'] || ''
    },
    body: buildEmailBody(receiver, subject, htmlBody)
});