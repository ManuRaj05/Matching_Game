const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const timerElement = document.getElementById('timer'); // Timer element
const attemptsElement = document.getElementById('attempts'); // Attempts element

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let attempts = 0;
let timerInterval;
let timeElapsed = 0; // Tracks time in seconds
let timerRunning = false; // Flag to check if timer has started
const icons = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🎱'];
const thinkingEmoji = '🤔'; // Unicode for thinking face emoji

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
    card.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`; // Insert thinking emoji placeholder
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
    const card = e.currentTarget; // Use currentTarget
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }

    card.innerHTML = `<span class="card-icon">${card.dataset.icon}</span>`; // Show card icon
    card.classList.add('flipped');
    flippedCards.push(card);

    if (!timerRunning) {
        startTimer(); // Start the timer on the first card flip
    }

    if (flippedCards.length === 2) {
        attempts++; // Increment attempts
        attemptsElement.textContent = `Attempts: ${attempts}`; // Update attempts display
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
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerElement.textContent = `Time: ${minutes}m ${seconds}s`;
}

function checkMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.dataset.icon === card2.dataset.icon) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount += 2;

        if (matchedCount === cards.length) {
            message.textContent = 'You win!';
            stopTimer(); // Stop the timer when the game is won
        }
    } else {
        card1.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
        card2.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

function resetGame() {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedCount = 0;
    attempts = 0;
    timeElapsed = 0;
    message.textContent = '';
    timerRunning = false; // Reset timer running flag
    stopTimer(); // Stop any running timer
    timerElement.textContent = `Time: 0m 0s`; // Reset timer display
    attemptsElement.textContent = `Attempts: 0`; // Reset attempts display
    generateCards();
}

generateCards();
resetButton.addEventListener('click', resetGame);
