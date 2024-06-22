function launchBattle() {
    let player1Stamina = parseInt(document.getElementById('player1-stamina').value);
    let player1Defense = parseInt(document.getElementById('player1-defense').value);
    let player1Attack = parseInt(document.getElementById('player1-attack').value);
    
    let player2Stamina = parseInt(document.getElementById('player2-stamina').value);
    let player2Defense = parseInt(document.getElementById('player2-defense').value);
    let player2Attack = parseInt(document.getElementById('player2-attack').value);
    
    let beyblade1Score = calculateScore(player1Stamina, player1Defense, player1Attack);
    let beyblade2Score = calculateScore(player2Stamina, player2Defense, player2Attack);
    
    let resultElement = document.getElementById('result');
    if (beyblade1Score > beyblade2Score) {
        resultElement.textContent = `Player 1 wins with score ${beyblade1Score}`;
    } else if (beyblade2Score > beyblade1Score) {
        resultElement.textContent = `Player 2 wins with score ${beyblade2Score}`;
    } else {
        resultElement.textContent = `It's a draw! Both players have score ${beyblade1Score}`;
    }
    
    animateBeyblade('beyblade1');
    animateBeyblade('beyblade2');
}

function calculateScore(stamina, defense, attack) {
    // Simple score calculation for demonstration purposes
    return stamina * 0.4 + defense * 0.3 + attack * 0.3;
}

function animateBeyblade(beybladeId) {
    let beyblade = document.getElementById(beybladeId);
    beyblade.style.animation = 'spin 2s linear infinite';
}
