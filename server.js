const express = require("express");
const app = express();
const PORT = 8000;

// Middleware to parse JSON body
app.use(express.json());

// Middleware to serve static files (HTML, CSS, JS, etc.) from the 'public' folder
app.use(express.static('public'));  // Make sure your index.html is in the 'public' folder

// Dummy deck data for example purposes
let decks = {};  // This will store all decks in memory

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Deck of Cards API! Use the /temp/deck endpoint to create a deck.");
});

// POST /temp/deck: Create a new deck and return a unique ID
app.post('/temp/deck', (req, res) => {
    const deckId = generateDeckId();  // Create a unique deck ID
    const deck = generateDeck();  // Generate a standard deck of cards
    decks[deckId] = { deck_id: deckId, remaining: 52, cards: deck };  // Store it in memory

    res.json({ deck_id: deckId });  // Return the deck ID to the client
});

// PATCH /temp/deck/shuffle/:deck_id: Shuffle a deck
app.patch("/temp/deck/shuffle/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (decks[deckId]) {
        const shuffledDeck = shuffleDeck(decks[deckId].cards);
        decks[deckId].cards = shuffledDeck;
        res.json({ message: "Deck shuffled" });
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
});

// GET /temp/deck/:deck_id: Get the full deck
app.get("/temp/deck/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (decks[deckId]) {
        res.json(decks[deckId]);
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
});

// GET /temp/deck/:deck_id/card: Draw a random card
app.get("/temp/deck/:deck_id/card", (req, res) => {
    const deckId = req.params.deck_id;
    if (decks[deckId]) {
        const card = drawCard(decks[deckId]);
        res.json(card);
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
});

// Helper function to generate a unique deck ID
function generateDeckId() {
    return Math.random().toString(36).substring(2, 9);  // Random 7-character string
}

// Helper function to generate a deck of 52 cards
function generateDeck() {
    const suits = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck;
}

// Helper function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Helper function to draw a card
function drawCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.cards.length);
    const drawnCard = deck.cards.splice(randomIndex, 1)[0];
    deck.remaining -= 1;
    return drawnCard;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
