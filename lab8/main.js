// Selecionando elementos da página
const hoverBox = document.getElementById('hoverBox');
const paragrafos = document.querySelectorAll('p');
const heading = document.querySelector('h1');
const textInput = document.getElementById('textInput');
const colorSelect = document.getElementById('colorSelect');

// Funções para manipulação de hover
function changeHoverMessage() {
    hoverBox.textContent = "Você passou o mouse aqui!";
}

function resetHoverMessage() {
    hoverBox.textContent = "1. Passa por aqui!";
}

// Função para mudar a cor dos parágrafos ao clicar no botão
document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        paragrafos.forEach(paragrafo => {
            paragrafo.style.color = color;
        });
    });
});

// Função para gerar uma cor aleatória
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Mudando a cor de fundo do campo de texto para uma cor aleatória a cada entrada
textInput.addEventListener('input', function () {
    this.style.backgroundColor = getRandomColor();
});

// Mudando a cor de fundo do body ao selecionar uma cor
colorSelect.onchange = function() {
    document.body.style.backgroundColor = this.value;
};

// Inicializando o contador com o valor do localStorage (ou 0 se não existir)
let counter = parseInt(localStorage.getItem('counter')) || 0;
heading.textContent = counter;

// Função para incrementar o contador e atualizar o localStorage
function count() {
    counter++;
    heading.textContent = counter;
    localStorage.setItem('counter', counter); // Armazenando o contador no localStorage
}

// Manipulação do formulário para exibir mensagem personalizada
document.querySelector('form').onsubmit = (e) => {
    e.preventDefault(); // Impede o reload da página

    // Pegando os valores dos campos do formulário
    const nome = document.querySelector('#nome').value;
    const idade = document.querySelector('#idade').value;

    document.querySelector('#frase').textContent = `Olá, o ${nome} tem ${idade}!`;
};

let autoCounterValue = 0;

function autoCount() {
    autoCounterValue++;
    document.getElementById('autoCounter').innerText = autoCounterValue;
}

setInterval(autoCount, 1000);
