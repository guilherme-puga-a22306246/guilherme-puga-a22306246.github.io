
const hoverBox = document.getElementById('hoverBox');
function changeHoverMessage() {
    hoverBox.textContent = "Você passou o mouse aqui!";
}
function resetHoverMessage() {
    hoverBox.textContent = "1. Passa por aqui!";
}

function changeColor(color) {
    document.body.style.backgroundColor = color;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.getElementById('textInput').addEventListener('input', function () {
    this.style.backgroundColor = getRandomColor();
});


function submitColor() {
    const color = document.getElementById('colorInput').value.toLowerCase();
    document.body.style.backgroundColor = color;
}

let counter = 0;
const heading = document.querySelector('h1');
function count() {
      counter++;
      heading.textContent = counter;
} 
