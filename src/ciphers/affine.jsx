// affine.jsx
function modInverse(a, m) {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return 1; // Fallback jika tidak ditemukan
}

export function affine(text, key, encrypt = true) {
  // Ubah bagian ini agar menerima objek dari state React
  const { a, b } = key; 
  let result = "";

  for (let char of text) {
    if (/[A-Z]/.test(char)) {
      let x = char.charCodeAt(0) - 65;
      let y;

      if (encrypt) {
        y = (a * x + b) % 26;
      } else {
        const inv = modInverse(a, 26);
        y = (inv * (x - b + 26)) % 26;
      }

      result += String.fromCharCode(((y % 26) + 26) % 26 + 65);
    } else {
      result += char;
    }
  }
  return result;
}