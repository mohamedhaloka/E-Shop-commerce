const DikaCryptJS = require("dikacryptjs")

const CryptJS = new DikaCryptJS.CryptJS({
    useHex: true,
})

const salt = CryptJS.genSaltSync()

exports.crypt = (text) => {
    const value = CryptJS.encrypt(text, salt, "Hex")
    return value
}
