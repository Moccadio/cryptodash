// enigma_realistic.jsx

export function enigma(
  text,
  key = "AAA",          // posisi awal rotor (Grundstellung)
  ring = "AAA",         // ring setting
  plugboardPairs = []   // contoh: ["AB","CD","EF"]
) {
  if (key.length !== 3 || ring.length !== 3)
    return "ERROR: KEY & RING HARUS 3 HURUF";

  const rotors = [
    { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" }, // Rotor I
    { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" }, // Rotor II
    { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" }  // Rotor III
  ];

  const reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

  // posisi rotor & ring
  let pos = key.toUpperCase().split("").map(c => c.charCodeAt(0) - 65);
  let ringPos = ring.toUpperCase().split("").map(c => c.charCodeAt(0) - 65);

  // 🔌 Plugboard
  const plugboard = {};
  plugboardPairs.forEach(pair => {
    let [a, b] = pair.toUpperCase().split("");
    plugboard[a] = b;
    plugboard[b] = a;
  });

  const plugSwap = c => plugboard[c] || c;

  const stepRotors = () => {
    // double stepping logic
    if (String.fromCharCode(pos[1] + 65) === rotors[1].notch) {
      pos[0] = (pos[0] + 1) % 26;
      pos[1] = (pos[1] + 1) % 26;
    } else if (String.fromCharCode(pos[2] + 65) === rotors[2].notch) {
      pos[1] = (pos[1] + 1) % 26;
    }

    // rotor kanan selalu berputar
    pos[2] = (pos[2] + 1) % 26;
  };

  const forward = (c, rotorIndex) => {
    const rotor = rotors[rotorIndex].wiring;
    let shift = (c + pos[rotorIndex] - ringPos[rotorIndex] + 26) % 26;
    let wired = rotor.charCodeAt(shift) - 65;
    return (wired - pos[rotorIndex] + ringPos[rotorIndex] + 26) % 26;
  };

  const backward = (c, rotorIndex) => {
    const rotor = rotors[rotorIndex].wiring;
    let shift = (c + pos[rotorIndex] - ringPos[rotorIndex] + 26) % 26;

    let idx = rotor.indexOf(String.fromCharCode(shift + 65));
    return (idx - pos[rotorIndex] + ringPos[rotorIndex] + 26) % 26;
  };

  let input = text.toUpperCase().replace(/[^A-Z]/g, "");
  let result = "";

  for (let ch of input) {
    stepRotors();

    // plugboard masuk
    ch = plugSwap(ch);

    let c = ch.charCodeAt(0) - 65;

    // maju: rotor 3 → 2 → 1
    for (let i = 2; i >= 0; i--) {
      c = forward(c, i);
    }

    // reflektor
    c = reflector.charCodeAt(c) - 65;

    // balik: rotor 1 → 2 → 3
    for (let i = 0; i < 3; i++) {
      c = backward(c, i);
    }

    let out = String.fromCharCode(c + 65);

    // plugboard keluar
    out = plugSwap(out);

    result += out;
  }

  return result;
}