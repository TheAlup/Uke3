const express = require("express");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//const pool = require("./db");


const app = express();  
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).send("Database connection failed");
    }
});

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
app.use(express.static('public'));

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




const pool = require("./db");

app.post("/api/family", async (req, res) => {
    const { name, parent_id } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO family_members (name, parent_id) VALUES ($1, $2) RETURNING *",
            [name, parent_id]
        );
        res.status(201).json(result.rows[0]); // Return the new family member
    } catch (error) {
        console.error("Error inserting family member", error);
        res.status(500).json({ error: "Failed to add family member" });
    }
});

// GET /api/family - Get all family members
app.get("/api/family", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM family_members");
        console.log("Fetched family members:", result.rows); // Log the fetched data
        res.json(result.rows); // Return the fetched data
    } catch (error) {
        console.error("Error fetching family members:", error);
        res.status(500).json({ error: "Error fetching family members" });
    }
});


// GET /api/family/:id - Get a family member by ID
app.get("/api/family/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM family_members WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Family member not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching family member:", error);
        res.status(500).json({ error: "Error fetching family member" });
    }
});

// PUT /api/family/:id - Update a family member
app.put("/api/family/:id", async (req, res) => {
    const { id } = req.params;
    const { name, parent_id } = req.body;

    try {
        const result = await pool.query(
            "UPDATE family_members SET name = $1, parent_id = $2 WHERE id = $3 RETURNING *",
            [name, parent_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Family member not found" });
        }
        res.json(result.rows[0]); // Returning the updated family member
    } catch (error) {
        console.error("Error updating family member:", error);
        res.status(500).json({ error: "Error updating family member" });
    }
});

// DELETE /api/family/:id - Delete a family member
app.delete("/api/family/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM family_members WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Family member not found" });
        }
        res.json({ message: "Family member deleted", deleted: result.rows[0] });
    } catch (error) {
        console.error("Error deleting family member:", error);
        res.status(500).json({ error: "Error deleting family member" });
    }
});
