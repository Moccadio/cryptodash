export function hill(text, keyStr, encrypt = true) {
  const k = keyStr.split(",").map(Number);
  if (k.length !== 9) return "ERROR: KEY HARUS 9 ANGKA (a,b,c,d,e,f,g,h,i)";

  const mod26 = (n) => ((n % 26) + 26) % 26;

  let matrix = [
    [k[0], k[1], k[2]],
    [k[3], k[4], k[5]],
    [k[6], k[7], k[8]]
  ];

  if (!encrypt) {
    let det = mod26(
      matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
      matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
      matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );

    let invDet = -1;
    for (let i = 0; i < 26; i++) {
      if ((det * i) % 26 === 1) {
        invDet = i;
        break;
      }
    }

    if (invDet === -1) return "ERROR: MATRIKS TIDAK PUNYA INVERS (Det tidak relatif prima dengan 26)";

    const adj = [
      [
        mod26((matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) * invDet),
        mod26(-(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]) * invDet),
        mod26((matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invDet)
      ],
      [
        mod26(-(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) * invDet),
        mod26((matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invDet),
        mod26(-(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]) * invDet)
      ],
      [
        mod26((matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) * invDet),
        mod26(-(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]) * invDet),
        mod26((matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) * invDet)
      ]
    ];
    matrix = adj;
  }

  let input = text.toUpperCase().replace(/[^A-Z]/g, "");
  while (input.length % 3 !== 0) input += "X";

  let result = "";
  for (let i = 0; i < input.length; i += 3) {
    let p = [
      input.charCodeAt(i) - 65,
      input.charCodeAt(i + 1) - 65,
      input.charCodeAt(i + 2) - 65
    ];

    for (let row = 0; row < 3; row++) {
      let val = mod26(
        matrix[row][0] * p[0] +
        matrix[row][1] * p[1] +
        matrix[row][2] * p[2]
      );
      result += String.fromCharCode(val + 65);
    }
  }
  return result;
}