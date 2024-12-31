 const gameBoard = document.getElementById('game-board');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');
    let cards = [];
    let flippedCards = [];
    let matchedCount = 0;
    const icons = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🎱', '👽','👻','🤖', '🧠','🫀', '🧿', '🔮', '🪄', '🎁', '🎈', '🎉'];
    const thinkingEmoji = '🤔';

    const difficultySettings = {
        easy: {
            pairs: 4,
            timer: 0,
            matrix: 4
        },
        medium: {
            pairs: 8,
            timer: 60,
            matrix: 5
        },
        hard: {
            pairs: 18,
            timer: 45,
            matrix: 6
        },
        impossible: {
            pairs: 32,
            timer: 30,
            matrix: 8
        }
    };

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
