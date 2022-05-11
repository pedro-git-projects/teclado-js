# Trabalho Final Lógica De Programação

## Situação Problema

Um instrumento musical é caro, desejo ser capaz de fazer um estudo musical básico sem investimento. Para tanto, aproveitarei a natureza imaterial do software para simular um teclado no meu  computador.

Para tanto o programa necessita de simular um teclado, associando aos métodos de entrada correspondentes do computador a reprodução de uma nota musical específica. 

## Tecnologias utilizdas

1. HTML:

HTML é utilizado já que o teclado ficará disponível em uma página Web.

Ali criamos uma lista não ordenada de notas, as quais formarão nosso teclado.

2. CSS:

O CSS é utilizado para estilizar a lista não ordenada para que ela pareça um teclado.

3. JavScript:

Por fim, o JavaScript é utilizado para dar funcionalidade ao teclado. Isso é feito através da API de Áudio da Web, disponível a todos os browsers. 

## Criterios de Avaliação

A avaliação exige a presença de:

1. Uma estrutura condicional

2. Um laço

3. Originalidade

Satisfazendo 1 temos:

```js
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
```

Satisfazendo 2:

```js
for (const [key, { element }] of Object.entries(teclas)) {
  element.addEventListener("mousedown", () => {
    tocarTecla(key)
    teclaClicada = key
  })
```

Sobre 3:

É possível encontrar diversos teclados escritos com HTML, CSS e JS na internet. Embora a funcionalidade seja indêntica, procurei implementar da forma mais pessoal o possível. Apesar disso, parte do código, como por exemplo o css que estiliza do teclado, concidirá com aquilo que já foi feito por outros programadores. 

## Instruções de uso do código

1. Clone o repositório através do comando

```sh
git clone https://github.com/pedro-git-projects/teclado-js.git
```

2. Acesse a pasta teclado-js 

3. Abra a página index.js no browser de sua preferência

## Referência

https://developer.mozilla.org/en-US/docs/Web/API/Web\_Audio\_API
