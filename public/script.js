// Base API URL
const API_BASE = "/temp/deck";
let deckId = null; // Store deck ID

// Get references to HTML elements
const createDeckBtn = document.getElementById("createDeck");
const shuffleDeckBtn = document.getElementById("shuffleDeckBtn");
const getDeckBtn = document.getElementById("getDeckBtn");
const drawCardBtn = document.getElementById("drawCardBtn");

const shuffleDeckIdInput = document.getElementById("shuffleDeckId");
const getDeckIdInput = document.getElementById("getDeckId");
const drawCardDeckIdInput = document.getElementById("drawCardDeckId");

const deckIdDisplay = document.getElementById("deckIdDisplay");
const shuffleMessage = document.getElementById("shuffleMessage");
const deckCardsDisplay = document.getElementById("deckCardsDisplay");
const cardDisplay = document.getElementById("cardDisplay");

// Function to create a new deck
async function createDeck() {
    try {
        const response = await fetch(API_BASE, { method: "POST" });
        if (!response.ok) throw new Error("Failed to create deck");

        const data = await response.json();
        deckId = data.deck_id; // Store deck ID
        deckIdDisplay.textContent = `Deck ID: ${deckId}`;
    } catch (error) {
        deckIdDisplay.textContent = `Error: ${error.message}`;
    }
}

// Function to shuffle a deck
async function shuffleDeck() {
    const deckToShuffle = shuffleDeckIdInput.value.trim();
    if (!deckToShuffle) {
        shuffleMessage.textContent = "Please enter a Deck ID.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/shuffle/${deckToShuffle}`, { method: "PATCH" });
        if (!response.ok) throw new Error("Failed to shuffle deck");

        shuffleMessage.textContent = "Deck shuffled successfully!";
    } catch (error) {
        shuffleMessage.textContent = `Error: ${error.message}`;
    }
}

// Function to get all cards in a deck
async function getDeck() {
    const deckToGet = getDeckIdInput.value.trim();
    if (!deckToGet) {
        deckCardsDisplay.textContent = "Please enter a Deck ID.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${deckToGet}`);
        if (!response.ok) throw new Error("Failed to retrieve deck");

        const deck = await response.json();
        deckCardsDisplay.textContent = JSON.stringify(deck, null, 2);
    } catch (error) {
        deckCardsDisplay.textContent = `Error: ${error.message}`;
    }
}

// Function to draw a card
async function drawCard() {
    const deckToDrawFrom = drawCardDeckIdInput.value.trim();
    if (!deckToDrawFrom) {
        cardDisplay.textContent = "Please enter a Deck ID.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${deckToDrawFrom}/card`);
        if (!response.ok) throw new Error("Failed to draw a card");

        const card = await response.json();
        cardDisplay.innerHTML = `You drew: <strong>${card.rank} of ${card.suit}</strong>`;
    } catch (error) {
        cardDisplay.textContent = `Error: ${error.message}`;
    }
}

// Attach event listeners
createDeckBtn.addEventListener("click", createDeck);
shuffleDeckBtn.addEventListener("click", shuffleDeck);
getDeckBtn.addEventListener("click", getDeck);
drawCardBtn.addEventListener("click", drawCard);
