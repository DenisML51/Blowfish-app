import React, { useState } from 'react';
import './App.css';
import { Blowfish } from './Blowfish';

function App() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [editableEncrypted, setEditableEncrypted] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');

  const handleEncrypt = () => {
    try {
      const blowfish = new Blowfish(key);
      const encrypted = blowfish.encrypt(text);
      setEncryptedResult(encrypted);
      setEditableEncrypted(encrypted);
    } catch (error) {
      alert(`Ошибка шифрования: ${error.message}`);
    }
  };

  const handleDecrypt = () => {
    try {
      const blowfish = new Blowfish(key);
      const decrypted = blowfish.decrypt(editableEncrypted);
      setDecryptedResult(decrypted);
    } catch (error) {
      setDecryptedResult('Ошибка дешифрования');
    }
  };

  return (
    <div className="App">
      <h1>Blowfish</h1>
      <div className="container">
        {/* Блок шифрования */}
        <div className="section">
          <h2>Шифрование</h2>
          <label>Введите текст:</label>
          <textarea
            rows="3"
            placeholder="Текст для шифрования"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <label>Введите ключ:</label>
          <input
            type="text"
            placeholder="Ключ шифрования"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button onClick={handleEncrypt}>Зашифровать</button>
          <label>Результат шифрования:</label>
          <textarea
            readOnly
            className="result-area"
            value={encryptedResult}
          />
        </div>

        {/* Блок дешифрования */}
        <div className="section">
          <h2>Дешифрование</h2>
          <label>Введите зашифрованное сообщение:</label>
          <textarea
            rows="3"
            placeholder="Вставьте зашифрованное сообщение"
            value={editableEncrypted}
            onChange={(e) => setEditableEncrypted(e.target.value)}
          />
          <label>Введите ключ:</label>
          <input
            type="text"
            placeholder="Ключ дешифрования"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button onClick={handleDecrypt}>Расшифровать</button>
          <label>Результат дешифрования:</label>
          <textarea
            readOnly
            className="result-area"
            value={decryptedResult}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
