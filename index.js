const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const getElementByNota = (nota) =>
  nota && document.querySelector(`[nota="${nota}"]`)

const keys = {
  A: { element: getElementByNota("C"), nota: "C", octaveOffset: 0 },
  W: { element: getElementByNota("C#"), nota: "C#", octaveOffset: 0 },
  S: { element: getElementByNota("D"), nota: "D", octaveOffset: 0 },
  E: { element: getElementByNota("D#"), nota: "D#", octaveOffset: 0 },
  D: { element: getElementByNota("E"), nota: "E", octaveOffset: 0 },
  F: { element: getElementByNota("F"), nota: "F", octaveOffset: 0 },
  T: { element: getElementByNota("F#"), nota: "F#", octaveOffset: 0 },
  G: { element: getElementByNota("G"), nota: "G", octaveOffset: 0 },
  Y: { element: getElementByNota("G#"), nota: "G#", octaveOffset: 0 },
  H: { element: getElementByNota("A"), nota: "A", octaveOffset: 1 },
  U: { element: getElementByNota("A#"), nota: "A#", octaveOffset: 1 },
  J: { element: getElementByNota("B"), nota: "B", octaveOffset: 1 },
  K: { element: getElementByNota("C2"), nota: "C", octaveOffset: 1 },
  O: { element: getElementByNota("C#2"), nota: "C#", octaveOffset: 1 },
  L: { element: getElementByNota("D2"), nota: "D", octaveOffset: 1 },
  P: { element: getElementByNota("D#2"), nota: "D#", octaveOffset: 1 },
  semicolon: { element: getElementByNota("E2"), nota: "E", octaveOffset: 1 }
}

const getHz = (nota = "A", oitava = 4) => {
  const A4 = 440
  let N = 0
  switch (nota) {
    default:
    case "A":
      N = 0
      break
    case "A#":
    case "Bb":
      N = 1
      break
    case "B":
      N = 2
      break
    case "C":
      N = 3
      break
    case "C#":
    case "Db":
      N = 4
      break
    case "D":
      N = 5
      break
    case "D#":
    case "Eb":
      N = 6
      break
    case "E":
      N = 7
      break
    case "F":
      N = 8
      break
    case "F#":
    case "Gb":
      N = 9
      break
    case "G":
      N = 10
      break
    case "G#":
    case "Ab":
      N = 11
      break
  }
  N += 12 * (oitava - 4)
  return A4 * Math.pow(2, N / 12)
}

const notasPressionadas = new Map()
let teclaClicada = ""

const tocarTecla = (key) => {
  if (!keys[key]) {
    return;
  }

  const osc = audioContext.createOscillator();
  const ganhoNota = audioContext.createGain();
  ganhoNota.connect(audioContext.destination);

  const ganhoZero = 0.00001;
  const ganhoMaximo = 0.5;
  const ganhoProlongado = 0.001;

  ganhoNota.gain.value = ganhoZero;

  const setAtaque = () =>
    ganhoNota.gain.exponentialRampToValueAtTime(
      ganhoMaximo,
      audioContext.currentTime + 0.01
    )

  const setDecaimento = () =>
    ganhoNota.gain.exponentialRampToValueAtTime(
      ganhoProlongado,
      audioContext.currentTime + 1
    )

  const setRelease = () =>
    ganhoNota.gain.exponentialRampToValueAtTime(
      ganhoZero,
      audioContext.currentTime + 2
    )

  setAtaque()
  setDecaimento()
  setRelease()

  osc.connect(ganhoNota)
  osc.type = "triangle"

  const freq = getHz(keys[key].nota, (keys[key].octaveOffset || 0) + 3)

  if (Number.isFinite(freq)) {
    osc.frequency.value = freq;
  }

  keys[key].element.classList.add("pressionada")
  notasPressionadas.set(key, osc)
  notasPressionadas.get(key).start()
};

const pararTecla = (key) => {
  if (!keys[key]) {
    return
  }
  
  keys[key].element.classList.remove("pressionada")
  const osc = notasPressionadas.get(key)

  if (osc) {
    setTimeout(() => {
      osc.stop()
    }, 2000)

    notasPressionadas.delete(key)
  }
}

document.addEventListener("keydown", (e) => {
  const eventKey = e.key.toUpperCase()
  const key = eventKey === ";" ? "semicolon" : eventKey
  
  if (!key || notasPressionadas.get(key)) {
    return
  }
  tocarTecla(key)
})

document.addEventListener("keyup", (e) => {
  const eventKey = e.key.toUpperCase()
  const key = eventKey === ";" ? "semicolon" : eventKey
  
  if (!key) {
    return
  }
  pararTecla(key)
})

for (const [key, { element }] of Object.entries(keys)) {
  element.addEventListener("mousedown", () => {
    tocarTecla(key)
    teclaClicada = key
  })
}

document.addEventListener("mouseup", () => {
  pararTecla(teclaClicada)
})