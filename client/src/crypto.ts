import forge from 'node-forge'

// export const salt = '£2ÌF×¶ÓÚØjÍç§UkA:4¾âíÑ¤ØÀßè.dhî▼§ÄVCõÚ♣Ã¡ÝK0fâ±▬';
export const iv = 'kå·‼‼Î"ºè?]»Ãë-^¢Ts+û4÷bS6@Ðt½ÇïÀ▼&I¦W _½↨♀ÀB¸ äjh[H_ý^Ì¶→';

export const encrypt = (text: string, pass: string,salt:string) => {
    let key = forge.pkcs5.pbkdf2(pass, salt, 1000, 16);
    let cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();
    let encrypted = cipher.output;
    return encrypted.getBytes();
}
export const decrypt = (text: string, pass: string,salt:string) => {
    let key = forge.pkcs5.pbkdf2(pass, salt, 1000, 16);
    let decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(text));
    let result = decipher.finish()
    return decipher.output.getBytes();
}

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}\\|,.<>/?'\"";

export function generatePassword(config: PasswordConfig) {
    let availableChars = LOWER;
    if (config.includeSymbols) {
        availableChars += SYMBOLS;
    }
    if (config.includeUppercase) {
        availableChars += UPPER;
    }
    if (config.includeDigits) {
        availableChars += DIGITS;
    }

    return Array.apply(null, {'length': config.length})
        .map(function () {
            while (true) {
                const byteArr = new Uint8Array(1);
                window.crypto.getRandomValues(byteArr);
                const char = String.fromCharCode(byteArr[0]);
                if (availableChars.includes(char)) {
                    console.log('char'+char)
                    return char;
                }
            }
        }, this).join('');
}

interface PasswordConfig {
    length: number,
    includeSymbols: boolean,
    includeUppercase: boolean,
    includeDigits: boolean,
}

export const genRSA = () => {
    let rsa = forge.pki.rsa;
    let keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
    return {public: forge.pki.publicKeyToPem(keypair.publicKey), private: forge.pki.privateKeyToPem(keypair.privateKey)}
}
// export const genAES = (bytes: number, text: string) => {
//     let key = forge.random.getBytesSync(bytes)
//     let iv = forge.random.getBytesSync(bytes);
//     let cipher = forge.cipher.createCipher('AES-CBC', key)
//     cipher.start({iv: iv});
//     cipher.update(forge.util.createBuffer(text));
//     cipher.finish();
//     var encrypted = cipher.output;
//     return encrypted.toHex()
// }

// export const gen3DES = () => {

// }