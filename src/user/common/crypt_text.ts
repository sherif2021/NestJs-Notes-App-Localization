import * as crypto from 'crypto-js';

export function encryptText(text: string): string {
  return crypto.AES.encrypt(text, process.env.CRYPT_KEY).toString();
}

export function decryptText(encryptText: string): string {
  return crypto.AES.decrypt(encryptText, process.env.CRYPT_KEY).toString(
    crypto.enc.Utf8,
  );
}
