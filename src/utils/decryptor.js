import CryptoJS from 'crypto-js';

const decrypt = (encryptedData, keyHex, ivHex) => {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedData);
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export default decrypt;
