import { Buffer } from 'buffer';

export class Blowfish {
  constructor(key) {
      this.P = new Array(18);
      this.S = new Array(4);
      this.initBlowfish(key);
  }

  initBlowfish(key) {
    const P = [
        0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344, 0xA4093822,
        0x299F31D0, 0x082EFA98, 0xEC4E6C89, 0x452821E6, 0x38D01377,
        0xBE5466CF, 0x34E90C6C, 0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5,
        0xB5470917, 0x9216D5D9, 0x8979FB1B
    ];

    const S = [
        0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7,
        0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99,
        0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16
    ];

    for (let i = 0; i < 18; i++) {
        this.P[i] = P[i];
    }

    for (let i = 0; i < 4; i++) {
        this.S[i] = new Array(256);
        for (let j = 0; j < 256; j++) {
            this.S[i][j] = S[(i * 256 + j) % S.length];
        }
    }

    const keyBytes = Buffer.from(key, 'utf-8');
    let keyIndex = 0;

    for (let i = 0; i < 18; i++) {
        let data = 0;
        for (let j = 0; j < 4; j++) {
            data = (data << 8) | keyBytes[keyIndex];
            keyIndex = (keyIndex + 1) % keyBytes.length;
        }
        this.P[i] ^= data;
    }
}

F(x) {
  const a = (x >>> 24) & 0xFF;
  const b = (x >>> 16) & 0xFF;
  const c = (x >>> 8) & 0xFF;
  const d = x & 0xFF;

  return (((this.S[0][a] + this.S[1][b]) ^ this.S[2][c]) + this.S[3][d]) >>> 0;
}

encryptBlock(left, right) {
  for (let i = 0; i < 16; i++) {
      left ^= this.P[i];
      right ^= this.F(left);
      [left, right] = [right, left];
  }
  [left, right] = [right, left];
  right ^= this.P[16];
  left ^= this.P[17];

  return [left, right];
}

decryptBlock(left, right) {
  for (let i = 17; i > 1; i--) {
      left ^= this.P[i];
      right ^= this.F(left);
      [left, right] = [right, left];
  }
  [left, right] = [right, left];
  right ^= this.P[1];
  left ^= this.P[0];

  return [left, right];
}

encrypt(text) {
    const buffer = Buffer.from(text, 'utf-8');
    const padding = 8 - (buffer.length % 8);
    const paddedBuffer = Buffer.concat([buffer, Buffer.alloc(padding, padding)]);

    let encrypted = [];

    for (let i = 0; i < paddedBuffer.length; i += 8) {
        let left = paddedBuffer.readUInt32BE(i);
        let right = paddedBuffer.readUInt32BE(i + 4);
        [left, right] = this.encryptBlock(left, right);
        encrypted.push(left, right);
    }

    const byteArray = encrypted.flatMap(n => [
        (n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF
    ]);
    return Buffer.from(byteArray).toString('base64');
}

decrypt(encryptedText) {
    // Проверка на Base64 (опционально)
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encryptedText)) {
        throw new Error("Ошибка дешифрования: строка содержит некорректные символы.");
    }

    const buffer = Buffer.from(encryptedText, 'base64');

    // Убедимся, что длина данных кратна 8 байтам
    if (buffer.length % 8 !== 0) {
        return "Ошибка дешифрования: длина данных не кратна 8 байтам.";
    }

    let decrypted = [];
    for (let i = 0; i < buffer.length; i += 8) {
        let left = buffer.readUInt32BE(i);
        let right = buffer.readUInt32BE(i + 4);
        [left, right] = this.decryptBlock(left, right);
        decrypted.push(left, right);
    }

    const byteArray = decrypted.flatMap(n => [
        (n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF
    ]);

    const decryptedBuffer = Buffer.from(byteArray);

    // Попытка удалить паддинг (если паддинг невалидный, просто вернём результат как есть)
    try {
        const padding = decryptedBuffer[decryptedBuffer.length - 1];
        if (padding > 8 || padding < 1) {
            return decryptedBuffer.toString('utf-8'); // Вернуть как есть
        }
        return decryptedBuffer.slice(0, -padding).toString('utf-8');
    } catch (e) {
        return decryptedBuffer.toString('utf-8'); // Вернуть как есть при ошибке
    }
}



}
