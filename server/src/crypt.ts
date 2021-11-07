import forge from 'node-forge'
import {salt, iv} from './secrets'

function hex2a(hexx: string) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

export const encrypt = (text: string, pass: string) => {
    let key = forge.pkcs5.pbkdf2(pass, salt, 1000, 16);
    let cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();
    let encrypted = cipher.output;
    return encrypted.getBytes();
}
export const decrypt = (text: string, pass: string) => {
    let key = forge.pkcs5.pbkdf2(pass, salt, 1000, 16);
    let decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(text));
    let result = decipher.finish();
    return decipher.output.getBytes();
}