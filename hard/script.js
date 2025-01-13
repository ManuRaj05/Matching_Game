const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const timerElement = document.getElementById('timer');
const attemptsElement = document.getElementById('attempts');
const progressElement = document.getElementById('progress');
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let attempts = 0;
let timer = null;
let startTime = null;
const icons = [
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🎱', '🍥', '🏏'
];
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

  updateProgress();
}

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function handleCardClick(e) {
  if (!startTime) {
    startTimer();
  }

  const card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
    return;
  }

  card.innerHTML = `<span class="card-icon">${card.dataset.icon}</span>`;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    attemptsElement.textContent = `Attempts: ${attempts}`;
    setTimeout(checkMatch, 500);
  }
}

function checkMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];

  if (card1.dataset.icon === card2.dataset.icon) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCount += 1;
    updateProgress();

    if (matchedCount === icons.length) {
      stopTimer();
      message.textContent = 'You win!';
    }
  } else {
    card1.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
    card2.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}

function updateProgress() {
  progressElement.textContent = `Solved Pairs: ${matchedCount} / ${icons.length}`;
}

function resetGame() {
  gameBoard.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedCount = 0;
  attempts = 0;
  startTime = null;
  stopTimer();
  timerElement.textContent = 'Time: 0:00';
  attemptsElement.textContent = 'Attempts: 0';
  progressElement.textContent = `Solved Pairs: 0 / ${icons.length}`;
  message.textContent = '';
  generateCards();
}

generateCards();
resetButton.addEventListener('click', resetGame);
