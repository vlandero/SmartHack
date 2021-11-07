import crypto from 'crypto'
interface PasswordConfig {
    length: number,
    includeSymbols: boolean,
}
const ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SYMBOLS = "!@#$%^&*()-_=+[]{}\\|,.<>/?'\""
export function generatePassword(config: PasswordConfig) {
    let characters = ALPHANUMERIC;
    if (config.includeSymbols) {
        characters += SYMBOLS;
    }

    const randomBytes = crypto.randomBytes(config.length);
    let result = new Array(config.length);

    let cursor = 0;
    for (let i = 0; i < config.length; i++) {
        cursor += randomBytes[i];
        result[i] = characters[cursor % characters.length];
    }
    return result.join('')
}

