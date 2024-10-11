import CryptoJS from 'crypto-js';

const encrypt = (text, key, iv = null) => {
    if (!iv) {
        iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
    } else {
        iv = CryptoJS.enc.Hex.parse(iv);
    }

    const keyParsed = CryptoJS.enc.Hex.parse(key);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), keyParsed, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return { iv: iv.toString(CryptoJS.enc.Hex), encryptedData: encryptedData.toString() };
};


const decrypt = (encryptedData, keyHex, ivHex) => {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });

    return decrypted.toString(CryptoJS.enc.Utf8); // This will correctly return the string including newline characters
};


export { encrypt, decrypt };
