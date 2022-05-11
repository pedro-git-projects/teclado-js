/* Criando o audioContext */
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

/* Selecionando as notas do HTML >*/
const getElementByNota = (nota) =>
  nota && document.querySelector(`[nota="${nota}"]`)

/* 
	Armazenando as notas em um objeto tal que a chave é 
	a entrada do teclado responsável por reproduzir aquela nota 
*/
const teclas = {
  A: { elemento: getElementByNota("C"), nota: "C", octaveOffset: 0 },
  W: { elemento: getElementByNota("C#"), nota: "C#", octaveOffset: 0 },
  S: { elemento: getElementByNota("D"), nota: "D", octaveOffset: 0 },
  E: { elemento: getElementByNota("D#"), nota: "D#", octaveOffset: 0 },
  D: { elemento: getElementByNota("E"), nota: "E", octaveOffset: 0 },
  F: { elemento: getElementByNota("F"), nota: "F", octaveOffset: 0 },
  T: { elemento: getElementByNota("F#"), nota: "F#", octaveOffset: 0 },
  G: { elemento: getElementByNota("G"), nota: "G", octaveOffset: 0 },
  Y: { elemento: getElementByNota("G#"), nota: "G#", octaveOffset: 0 },
  H: { elemento: getElementByNota("A"), nota: "A", octaveOffset: 1 },
  U: { elemento: getElementByNota("A#"), nota: "A#", octaveOffset: 1 },
  J: { elemento: getElementByNota("B"), nota: "B", octaveOffset: 1 },
  K: { elemento: getElementByNota("C2"), nota: "C", octaveOffset: 1 },
  O: { elemento: getElementByNota("C#2"), nota: "C#", octaveOffset: 1 },
  L: { elemento: getElementByNota("D2"), nota: "D", octaveOffset: 1 },
  P: { elemento: getElementByNota("D#2"), nota: "D#", octaveOffset: 1 },
  semicolon: { elemento: getElementByNota("E2"), nota: "E", octaveOffset: 1 }
}

/* Determinando a tonalidade em Hz */ 
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

/* Criando um mapa para armazenar as teclas pressionadas em um determinado momento */
const notasPressionadas = new Map()
let teclaClicada = ""

/* 
	Função tocarTecla que é ativada quando uma tecla ou botão do mouse for pressionada; 
	Cada tecla terá um oscilador, ganho, ataque e decaimento  e release associada a si 
*/
const tocarTecla = (key) => {
  if (!teclas[key]) {
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

  const freq = getHz(teclas[key].nota, (teclas[key].octaveOffset || 0) + 3)

  if (Number.isFinite(freq)) {
    osc.frequency.value = freq;
  }

  teclas[key].elemento.classList.add("pressionada")
  notasPressionadas.set(key, osc)
  notasPressionadas.get(key).start()
}

/* pararTecla é a função inversa de tocarTecla */
const pararTecla = (key) => {
  if (!teclas[key]) {
    return
  }
  
  teclas[key].elemento.classList.remove("pressionada")
  const osc = notasPressionadas.get(key)

  if (osc) {
    setTimeout(() => {
      osc.stop()
    }, 2000)

    notasPressionadas.delete(key)
  }
}

/* Criando event listeners para chamar as funções anteriormente definidas */
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

for (const [key, { elemento }] of Object.entries(teclas)) {
  elemento.addEventListener("mousedown", () => {
    tocarTecla(key)
    teclaClicada = key
  })
}

document.addEventListener("mouseup", () => {
  pararTecla(teclaClicada)
})
