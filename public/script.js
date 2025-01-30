// Create Deck
document.getElementById('createDeckBtn').addEventListener('click', function() {
    fetch('/temp/deck', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('deckIdDisplay').innerText = `Deck ID: ${data.deck_id}`;
    })
    .catch(error => alert('Error creating deck: ' + error));
});

// Get Deck
document.getElementById('getDeckBtn').addEventListener('click', function() {
    const deckId = document.getElementById('deckIdDisplay').innerText.split(' ')[2];  // Extract deck ID
    if (!deckId) {
        alert('Please create a deck first!');
        return;
    }

    fetch(`/temp/deck/${deckId}`)
        .then(response => response.json())
        .then(data => {
            const cards = data.cards.map(card => `${card.rank} of ${card.suit}`).join('\n');
            document.getElementById('deckCardsDisplay').innerText = cards;
        })
        .catch(error => alert('Error fetching deck: ' + error));
});

// Shuffle Deck
document.getElementById('shuffleDeckBtn').addEventListener('click', function() {
    const deckId = document.getElementById('shuffleDeckId').value;
    if (!deckId) {
        alert('Please enter a deck ID!');
        return;
    }

    fetch(`/temp/deck/shuffle/${deckId}`, {
        method: 'PATCH',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('shuffleMessage').innerText = 'Deck shuffled!';
    })
    .catch(error => alert('Error shuffling deck: ' + error));
});

// Draw Card
document.getElementById('drawCard').addEventListener('click', function() {
    const deckId = document.getElementById('deckIdDisplay').innerText.split(' ')[2];  // Extract deck ID
    if (!deckId) {
        alert('Please create a deck first!');
        return;
    }

    fetch(`/temp/deck/${deckId}/card`)
        .then(response => response.json())
        .then(card => {
            document.getElementById('cardDisplay').innerText = `${card.rank} of ${card.suit}`;
        })
        .catch(error => alert('Error drawing card: ' + error));
});
