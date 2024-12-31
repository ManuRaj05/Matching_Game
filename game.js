  // Get selected difficulty from local storage or set default
  let currentDifficulty = localStorage.getItem('selectedDifficulty') || 'easy';
  let timeLeft = 0;
  let timerInterval;


    function generateCards() {
        const currentSettings = difficultySettings[currentDifficulty];
        const numPairs = currentSettings.pairs;
        const numColumns = currentSettings.matrix;
        const selectedIcons = icons.slice(0, numPairs);
        const duplicatedIcons = [...selectedIcons, ...selectedIcons];
        shuffleArray(duplicatedIcons);

        gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 100px)`;
        duplicatedIcons.forEach((icon, index) => {
            const card = createCard(icon, index);
            gameBoard.appendChild(card);
            cards.push(card);
        });


        timeLeft = currentSettings.timer;
        startTimer();
    }

    function handleCardClick(e) {
        const card = e.currentTarget;
        if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
            return;
        }

        card.innerHTML = `<span class="card-icon">${card.dataset.icon}</span>`;
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
            if(matchedCount === cards.length) {
                message.textContent = 'You win!';
                clearInterval(timerInterval);
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
        message.textContent = '';
        clearInterval(timerInterval);
        generateCards();
    }

    function startTimer() {
        if (timeLeft <= 0) return;
        timerInterval = setInterval(function () {
            if (timeLeft > 0) {
                timeLeft--;
                message.textContent = `Time left: ${timeLeft} seconds`;
            } else {
                clearInterval(timerInterval);
                message.textContent = 'Time is up. Game Over!'
                 cards.forEach(card => {
                card.innerHTML = `<span class="card-icon">${card.dataset.icon}</span>`;
                card.classList.add('flipped');
                 })
            }
        }, 1000);
    }
    generateCards();
    resetButton.addEventListener('click', resetGame);
