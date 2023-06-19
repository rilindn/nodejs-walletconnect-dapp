const qrcode = require('qrcode-terminal');

// Generate the QR code as a data URL
module.exports = (payload) => {
    try {
        qrcode.generate(payload, { small: true }, function (code) {
            console.log(code)
        });
    } catch (err) {
        console.log(err)
    }
}
