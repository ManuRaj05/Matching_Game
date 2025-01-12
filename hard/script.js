const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const timerElement = document.getElementById('timer');
const attemptsElement = document.getElementById('attempts');
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let isAnimating = false;
let attempts = 0;
let timerInterval;
let timeElapsed = 0; // Time tracker in seconds
let timerRunning = false; // Flag to check if timer is already running
const icons = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🎱','🍥','🏏','🥍','🎳', '🎯', '🎮', '🎰', '🎲', '🃏', '🀄'];
const thinkingEmoji = '🤔';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(icon, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.icon = icon;
    card.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
    card.addEventListener('click', handleCardClick);
    return card;
}

function generateCards() {
    const duplicatedIcons = [...icons, ...icons];
    shuffleArray(duplicatedIcons);

    duplicatedIcons.forEach((icon, index) => {
        const card = createCard(icon, index);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function handleCardClick(e) {
    if (isAnimating) return;
    const card = e.currentTarget;
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }

    const cardIcon = document.createElement('span');
    cardIcon.classList.add('card-icon');
    cardIcon.textContent = card.dataset.icon;
    card.innerHTML = '';
    card.appendChild(cardIcon);
    card.classList.add('flipped');
    flippedCards.push(card);

    if (!timerRunning) { // Start the timer when the first card is flipped
        startTimer();
    }

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function startTimer() {
    timerRunning = true;
    timerInterval = setInterval(() => {
        timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeElapsed / 60); // Get the number of minutes
    const seconds = timeElapsed % 60; // Get the remaining seconds
    timerElement.textContent = `Time: ${minutes}m ${seconds}s`; // Update timer display
}

function checkMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    attempts++;
    attemptsElement.textContent = `Attempts: ${attempts}`;

    if (card1.dataset.icon === card2.dataset.icon) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount += 2;

        if (matchedCount === cards.length) {
            message.textContent = 'You win!';
            stopTimer(); // Stop the timer when the game is won
        }
    } else {
        isAnimating = true;

        const card1Index = cards.indexOf(card1);
        const card2Index = cards.indexOf(card2);

        [cards[card1Index], cards[card2Index]] = [cards[card2Index], cards[card1Index]];

        const temp = document.createElement('div');
        gameBoard.insertBefore(temp, card1);
        gameBoard.insertBefore(card1, card2.nextElementSibling);
        gameBoard.insertBefore(card2, temp);
        temp.remove();

        setTimeout(() => {
            card1.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
            card2.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            isAnimating = false;
        }, 1000);
    }

    flippedCards = [];
}

function resetGame() {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedCount = 0;
    attempts = 0;
    timeElapsed = 0; // Reset the timer
    timerElement.textContent = `Time: 0m 0s`; // Update the timer display
    attemptsElement.textContent = `Attempts: ${attempts}`; // Update the attempts display
    message.textContent = '';
    isAnimating = false;
    timerRunning = false; // Reset the timer running flag
    generateCards();
}

generateCards();
resetButton.addEventListener('click', resetGame);
