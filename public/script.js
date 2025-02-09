// Help function to display the current deck
function displayDeck() {
    const deckId = document.getElementById('inpDeckId').value;
    if (!deckId) {
        alert('Please enter a valid ID or create a deck first!');
        return;
    }

    fetch(`/api/deck/${deckId}`)
        .then(response => response.json())
        .then(data => {
            const cards = data.cards.map(card => `${card.rank} of ${card.suit}`).join('\n');
            document.getElementById('deckIdHeader').innerText = 'Deck (ID: ' + deckId + ')';
            document.getElementById('deckCardsDisplay').innerText = cards;
        })
        .catch(error => alert('Error fetching deck: ' + error));
};

// Create Deck
document.getElementById('createDeckBtn').addEventListener('click', function() {
    fetch('/api/deck', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('deckIdDisplay').innerText = `A new deck with ID ${data.deck_id} has been created`;
        document.getElementById('inpDeckId').value = `${data.deck_id}`;
        displayDeck();
    })
    .catch(error => alert('Error creating deck: ' + error));
});

// Get the current deck based on the deck ID provided in the inputfield
document.getElementById('getDeckBtn').addEventListener('click', function() {
    displayDeck();
    document.getElementById('deckIdDisplay').innerHTML = '<br>';
});

// Shuffle Deck
document.getElementById('shuffleDeckBtn').addEventListener('click', function() {
    const deckId = document.getElementById('inpDeckId').value;
    if (!deckId) {
        alert('Please enter a valid ID or create a deck first!');
        return;
    }

    fetch(`/api/deck/shuffle/${deckId}`, {
        method: 'PATCH',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('shuffleMessage').innerText = 'Deck shuffled!';
        displayDeck();
        document.getElementById('deckIdDisplay').innerHTML = '<br>';
    })
    .catch(error => alert('Error shuffling deck: ' + error));
});

// Draw Card
document.getElementById('drawCard').addEventListener('click', function() {
    const deckId = document.getElementById('inpDeckId').value;
    if (!deckId) {
        alert('Please enter a valid ID or create a deck first!');
        return;
    }

    fetch(`/api/deck/${deckId}/card`)
        .then(response => response.json())
        .then(card => {
            document.getElementById('cardDisplay').innerText = `${card.rank} of ${card.suit}`;
            displayDeck();
            document.getElementById('deckIdDisplay').innerHTML = '<br>';
        })
        .catch(error => alert('Error drawing card: ' + error));
});
