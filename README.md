# Family Tree API

This is the API for managing family members in a tree-like structure. The API allows for basic operations such as creating, retrieving, updating, and deleting family members.



### Part 1: Deck of Cards API 

In Deck of cards I implemented an API for managing a standard 52-card deck. This API supports the following:

- **POST /temp/deck**: Creates a new deck of cards on the server and gives a unique ID.
- **PATCH /temp/deck/shuffle/:deck_id**: Shuffles the deck of cards.
- **GET /temp/deck/:deck_id**: Returns the full deck, excluding any drawn cards.
- **GET /temp/deck/:deck_id/card**: Draws a random card from the deck.

### Part 2: Family Tree API

Now, the project focuses on managing a family tree. The family tree allows you to:

- **POST /api/family/users**: Create a new family member.
- **GET /api/family**: Get all family members.
- **GET /api/family/:id**: Get a specific family member by ID.
- **PUT /api/family/:id**: Update a family member's details.
- **DELETE /api/family/:id**: Delete a family member.

## Live API

The API is live and hosted on Render:

- https://uke3-pz5a.onrender.com/ --- [Live version]


## Example Endpoints

- **POST /api/family/users**  
  Example request body:
  ```json
  { "name": "John Doe", "age": 30, "parentId": null }






To run locally:

Clone the repo:
git clone https://github.com/TheAlup/Uke3.git
Install dependencies:
npm install
Start the server:
node server.js
Visit http://localhost:3000/api/family

The next task uses a PostgreSQL Render database (Host name: dpg-cv9ggl8fnakc739mcjbg-a). You need a .env file with DATABASE_URL= followed by the database connection string for it to work. (.env is private, so I can't share it). Make sure SSL is enabled if required.
