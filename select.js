const difficultyButtons = document.querySelectorAll('#difficulty-selector button');

difficultyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedDifficulty = this.dataset.difficulty;
        // Store selected difficulty in localStorage
       localStorage.setItem('selectedDifficulty', selectedDifficulty);
        window.location.href = 'game.html'; // Redirect to the game page
    });
});
