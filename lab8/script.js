// Função para alternar a exibição da lista de benefícios
function toggleBenefits() {
    const benefitsList = document.getElementById("benefits-list");
    if (benefitsList.classList.contains("hidden")) {
        benefitsList.classList.remove("hidden");
        benefitsList.style.color = "green";
    } else {
        benefitsList.classList.add("hidden");
    }
}

// Função para exibir o feedback do usuário
function showFeedback(event) {
    event.preventDefault();
    const feedbackInput = document.getElementById("feedback");
    const feedbackText = feedbackInput.value;

    const feedbackDisplay = document.createElement("p");
    feedbackDisplay.innerHTML = `<strong>Comentário:</strong> ${feedbackText}`;
    feedbackDisplay.style.backgroundColor = "#d1e7dd";
    document.getElementById("feedback-form").appendChild(feedbackDisplay);

    feedbackInput.value = ""; // Limpar campo
}

// Eventos de Mouse
const benefitsButton = document.getElementById("btn-benefits");
benefitsButton.addEventListener("click", toggleBenefits);

benefitsButton.addEventListener("dblclick", function () {
    benefitsButton.style.backgroundColor = "#a3b18a";
});

benefitsButton.addEventListener("mouseover", function () {
    benefitsButton.textContent = "Clique para ver!";
});

benefitsButton.addEventListener("mouseout", function () {
    benefitsButton.textContent = "Ver Benefícios";
});

document.addEventListener("mousemove", function (event) {
    document.body.style.backgroundColor = `rgb(${event.clientX % 255}, ${event.clientY % 255}, 150)`;
});

document.addEventListener("keydown", function (event) {
    const introText = document.getElementById("intro");
    introText.textContent = `Você pressionou a tecla: ${event.key}`;
});

document.addEventListener("keyup", function () {
    const introText = document.getElementById("intro");
    introText.textContent = "Descubra os incríveis benefícios do café para a sua saúde!";
});

const feedbackForm = document.getElementById("feedback-form");
feedbackForm.addEventListener("submit", showFeedback);

const feedbackInput = document.getElementById("feedback");
feedbackInput.addEventListener("change", function () {
    feedbackInput.style.borderColor = "blue";
});
