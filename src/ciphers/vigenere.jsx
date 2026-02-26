export function vigenere(text, key, encrypt = true) {
  let result = "";
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    let c = text[i];

    if (/[A-Z]/.test(c)) {
      let shift = key.charCodeAt(j % key.length) - 65;
      if (!encrypt) shift = 26 - shift;

      result += String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
      j++;
    } else result += c;
  }
  return result;
}