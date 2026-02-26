import { useState } from "react";
import { vigenere } from "../ciphers/vigenere";
import { affine } from "../ciphers/affine";
import { playfair } from "../ciphers/playfair";
import { hill } from "../ciphers/hill";
import { enigma } from "../ciphers/enigma";

export default function CipherForm() {
  const [text, setText] = useState("");
  const [key, setKey] = useState(""); 
  const [affineA, setAffineA] = useState(""); 
  const [affineB, setAffineB] = useState(""); 
  const [cipher, setCipher] = useState("vigenere");
  const [result, setResult] = useState("");

  const [ring, setRing] = useState("AAA");
  const [plugboard, setPlugboard] = useState("");

  const process = (encrypt) => {
    const input = text.toUpperCase();

    if (cipher === "vigenere") {
      setResult(vigenere(input, key.toUpperCase(), encrypt));
    } else if (cipher === "affine") {
      const aVal = parseInt(affineA);
      const bVal = parseInt(affineB);
      if ([1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25].indexOf(aVal) === -1) {
        setResult("Error: Kunci A harus angka ganjil (selain 13)!");
        return;
      }
      setResult(affine(input, { a: aVal, b: bVal }, encrypt));
    } else if (cipher === "playfair") {
      setResult(playfair(input, key.toUpperCase(), encrypt));
    } else if (cipher === "hill") {
      setResult(hill(input, key, encrypt));
    } else if (cipher === "enigma") {

      const pairs = plugboard.trim() ? plugboard.toUpperCase().split(" ") : [];
      
      setResult(enigma(input, key.toUpperCase(), ring.toUpperCase(), pairs));
    }
  };

  return (
    <div className="card">
      <img
        src="public/CRYPTO DASH.png" 
        alt="Shield Icon" 
        className="form-logo" 
      />

      <label>Pesan</label>
      <textarea
        placeholder="Masukkan teks..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ resize: "none" }}
      />

      <label>Jenis Cipher</label>
      <select value={cipher} onChange={(e) => setCipher(e.target.value)}>
        <option value="vigenere">Vigenere Cipher</option>
        <option value="affine">Affine Cipher</option>
        <option value="playfair">Playfair Cipher</option>
        <option value="hill">Hill Cipher (Matrix 3x3)</option>
        <option value="enigma">Enigma Machine (Realistic)</option>
      </select>

      <label>Konfigurasi Kunci</label>
      {(cipher === "vigenere" || cipher === "playfair") && (
        <input
          placeholder={cipher === "vigenere" ? "Contoh: MERDEKA" : "Contoh: MONARCHY"}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      )}

      {cipher === "affine" && (
        <div className="btn-group"> 
          <input
            type="number"
            placeholder="Kunci a"
            value={affineA}
            onChange={(e) => setAffineA(e.target.value)}
          />
          <input
            type="number"
            placeholder="Kunci b"
            value={affineB}
            onChange={(e) => setAffineB(e.target.value)}
          />
        </div>
      )}

      {cipher === "hill" && (
        <>
          <input
            placeholder="Format: 9 angka (Contoh: 6,24,1,13,16,10,20,17,15)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <span className="key-helper">Masukkan 9 angka untuk matriks 3x3.</span>
        </>
      )}

      {cipher === "enigma" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="btn-group" style={{ margin: 0 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Rotor Pos</label>
              <input
                placeholder="ABC"
                value={key}
                maxLength={3}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Ring Set</label>
              <input
                placeholder="AAA"
                value={ring}
                maxLength={3}
                onChange={(e) => setRing(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Plugboard Pairs</label>
          <input
            placeholder="Contoh: AB CD EF"
            value={plugboard}
            onChange={(e) => setPlugboard(e.target.value.toUpperCase())}
          />
          <span className="key-helper" style={{ marginTop: "-8px" }}>Pisahkan pasangan huruf dengan spasi.</span>
        </div>
      )}

      <div className="btn-group" style={{ marginTop: "15px" }}>
        <button className="encrypt" onClick={() => process(true)}>Encrypt</button>
        <button className="decrypt" onClick={() => process(false)}>Decrypt</button>
      </div>

      <label>Hasil</label>
      <textarea
        className="result"
        value={result}
        readOnly
        placeholder="Hasil akan muncul di sini..."
        style={{ resize: "none" }}
      />
    </div>
  );
}