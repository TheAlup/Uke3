import express from 'express';

const server = express();

// Example POST endpoint to create a new deck
server.post('/temp/deck', (req, res) => {
    const deckId = Math.floor(Math.random() * 1000);  // Generate a simple unique deck ID
    res.status(200).json({ deckId });
});

// Example PATCH endpoint to shuffle the deck
server.patch('/temp/deck/shuffle/:deckId', (req, res) => {
    const { deckId } = req.params;
    res.status(200).json({ message: `Deck ${deckId} shuffled!` });
});

// Example GET endpoint to get the whole deck
server.get('/temp/deck/:deckId', (req, res) => {
    const { deckId } = req.params;
    res.status(200).json({ deckId, cards: [] });  // Placeholder for actual cards
});

// Example GET endpoint to draw a card
server.get('/temp/deck/:deckId/card', (req, res) => {
    const card = { suit: 'Hearts', rank: '2' };  // Placeholder card
    res.status(200).json(card);
});

export default server;
