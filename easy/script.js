const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
let cards = [];
let flippedCards = [];
let matchedCount = 0;
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

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 500);
  }
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
    }
  } else {
    // Swap cards visually if they don't match
    const card1Rect = card1.getBoundingClientRect();
    const card2Rect = card2.getBoundingClientRect();

    // Temporarily apply absolute positioning to allow smooth movement
    setTimeout(() => {
      card1.style.position = 'absolute';
      card2.style.position = 'absolute';

      card1.style.transition = 'all 0.5s ease';
      card2.style.transition = 'all 0.5s ease';

      card1.style.left = `${card2Rect.left - card1Rect.left}px`;
      card1.style.top = `${card2Rect.top - card1Rect.top}px`;
      
      card2.style.left = `${card1Rect.left - card2Rect.left}px`;
      card2.style.top = `${card1Rect.top - card2Rect.top}px`;

      // After animation ends, reset cards to their grid positions
      setTimeout(() => {
        // Reset the positions and grid layout
        card1.style.position = '';
        card2.style.position = '';
        card1.style.left = '';
        card1.style.top = '';
        card2.style.left = '';
        card2.style.top = '';

        // Reset card contents and flip them back
        card1.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
        card2.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
      }, 500);
    }, 0);
  }

  flippedCards = [];
}

function resetGame() {
  gameBoard.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedCount = 0;
  message.textContent = '';
  generateCards();
}

generateCards();
resetButton.addEventListener('click', resetGame);
