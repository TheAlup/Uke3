const express = require("express");
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();  
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Configure session before using routes
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
        store: new FileStore({ path: "./sessions" }),
        cookie: { secure: false }, 
    })
);

// Serve static files (HTML, CSS, JS...)
app.use(express.static("public"));

// Import routes AFTER initializing middleware
const uke8routes = require("./routes/uke8routes.js");

// Family tree API routes
app.use("/api/family", uke8routes);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Deck of Cards API! Use the /api/deck endpoint to create a deck.");
});

// POST /deck: Create a new deck and return a unique ID
app.post("/api/deck", (req, res) => {
    const deckId = generateDeckId();
    const deck = generateDeck();

    req.session.decks = req.session.decks || {};
    req.session.decks[deckId] = { deck_id: deckId, remaining: 52, cards: deck };

    res.json({ deck_id: deckId });
});

// PATCH /deck/shuffle/:deck_id: Shuffle a deck
app.patch("/api/deck/shuffle/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (req.session.decks && req.session.decks[deckId]) {
        req.session.decks[deckId].cards = shuffleDeck(req.session.decks[deckId].cards);
        res.json({ message: "Deck shuffled" });
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
});

// GET /api/deck/:deck_id: Get the full deck
app.get("/api/deck/:deck_id", (req, res) => {
    const deckId = req.params.deck_id;
    if (req.session.decks && req.session.decks[deckId]) {
        res.json(req.session.decks[deckId]);
    } else {
        res.status(404).json({ error: "Deck not found" });
    }
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
});

// Helper function to generate a unique deck ID
function generateDeckId() {
    return Math.random().toString(36).substring(2, 9);
}

// Helper function to generate a deck of 52 cards
function generateDeck() {
    const suits = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
    return suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
}

// Helper function to shuffle the deck
function shuffleDeck(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

// Helper function to draw a card
function drawCard(deck) {
    if (deck.cards.length === 0) return { error: "No cards left in deck" };
    const card = deck.cards.pop();
    deck.remaining -= 1;
    return card;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

