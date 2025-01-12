const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let isAnimating = false; // Lock flag to prevent interactions during animations
const icons = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🎱'];
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
    if (isAnimating) return; // Prevent interaction during animation
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
        // Lock interactions while swapping
        isAnimating = true;

        const card1Index = cards.indexOf(card1);
        const card2Index = cards.indexOf(card2);

        // Swap card elements in the array
        [cards[card1Index], cards[card2Index]] = [cards[card2Index], cards[card1Index]];

        // Swap card positions visually
        const temp = document.createElement('div');
        gameBoard.insertBefore(temp, card1);
        gameBoard.insertBefore(card1, card2.nextElementSibling);
        gameBoard.insertBefore(card2, temp);
        temp.remove();

        // Reset cards and unlock interaction after animation
        setTimeout(() => {
            card1.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
            card2.innerHTML = `<span class="card-placeholder">${thinkingEmoji}</span>`;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            isAnimating = false; // Unlock interaction
        }, 1000);
    }

    flippedCards = [];
}

function resetGame() {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedCount = 0;
    message.textContent = '';
    isAnimating = false; // Reset animation lock
    generateCards();
}

generateCards();
resetButton.addEventListener('click', resetGame);
