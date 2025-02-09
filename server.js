const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON body
app.use(express.json());

// Middleware to serve static files (HTML, CSS, JS, etc.) from the 'public' folder
app.use(express.static("public")); // Make sure your index.html is in the 'public' folder

// Configure session middleware
app.use(
    session({
        secret: "your-secret-key", // Change this to a secure random key
        resave: false,
        saveUninitialized: true,
        store: new FileStore({ path: "./sessions" }), // Store sessions in the 'sessions' folder
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);


// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Deck of Cards API! Use the /api/deck endpoint to create a deck.");
});

// POST /deck: Create a new deck and return a unique ID
app.post("/api/deck", (req, res) => {
    const deckId = generateDeckId(); // Create a unique deck ID
    const deck = generateDeck(); // Generate a standard deck of cards

    // Store the deck in the session
    req.session.decks = req.session.decks || {};
    req.session.decks[deckId] = { deck_id: deckId, remaining: 52, cards: deck };

    res.json({ deck_id: deckId }); // Return the deck ID to the client
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
});

// PATCH /deck/shuffle/:deck_id: Shuffle a deck
app.patch("/api/deck/shuffle/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (req.session.decks && req.session.decks[deckId]) {
        const shuffledDeck = shuffleDeck(req.session.decks[deckId].cards);
        req.session.decks[deckId].cards = shuffledDeck;
        res.json({ message: "Deck shuffled" });
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
});

// GET /api/deck/:deck_id: Get the full deck
app.get("/api/deck/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (req.session.decks && req.session.decks[deckId]) {
        res.json(req.session.decks[deckId]);
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
});

// GET /api/deck/:deck_id/card: Draw a random card
app.get("/api/deck/:deck_id/card", (req, res) => {
    const deckId = req.params.deck_id;
    if (req.session.decks && req.session.decks[deckId]) {
        const card = drawCard(req.session.decks[deckId]);
        res.json(card);
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
});

// Helper function to generate a unique deck ID
function generateDeckId() {
    return Math.random().toString(36).substring(2, 9); // Random 7-character string
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