// playfair.jsx
export function playfair(text, key, encrypt = true) {
  let table = [];
  let k = key.toUpperCase().replace(/J/g, "I") + "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  let uniqueK = [...new Set(k.replace(/\s/g, ""))];
  
  while (uniqueK.length) table.push(uniqueK.splice(0, 5));

  let input = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let preparedText = "";
  
  for (let i = 0; i < input.length; i += 2) {
    let a = input[i];
    let b = input[i + 1] || "X";
    if (a === b) {
      preparedText += a + "X";
      i--;
    } else {
      preparedText += a + b;
    }
  }

  const findPos = (char) => {
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 5; c++)
        if (table[r][c] === char) return [r, c];
    return [0, 0];
  };

  let result = "";
  for (let i = 0; i < preparedText.length; i += 2) {
    let [r1, c1] = findPos(preparedText[i]);
    let [r2, c2] = findPos(preparedText[i + 1]);

    if (r1 === r2) {
      result += table[r1][(c1 + (encrypt ? 1 : 4)) % 5];
      result += table[r2][(c2 + (encrypt ? 1 : 4)) % 5];
    } else if (c1 === c2) {
      result += table[(r1 + (encrypt ? 1 : 4)) % 5][c1];
      result += table[(r2 + (encrypt ? 1 : 4)) % 5][c2];
    } else {
      result += table[r1][c2];
      result += table[r2][c1];
    }
  }
  return result;
}