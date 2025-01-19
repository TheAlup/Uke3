import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

// Route for "/"
function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}
server.get("/", getRoot);

// Route for "/tmp/poem"
function getPoem(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(`
        Roses are red,<br>
        Violets are too,<br>
        I tried to write code,<br>
        But it just wouldn't do.
    `).end();
}
server.get("/tmp/poem", getPoem);

// Array of quotes
const quotes = [
    "Nothing is true, everything is permitted",
    "Once you've got a task to do, it's better to do it than live with the fear of it",
    "Do or do not, there is no try",
    "Mercy and weakness are the same thing in war, and there’s no prizes for nice behavior",
    "The best way to predict the future is to invent it"
];

// Route for "/tmp/quote"
function getQuote(req, res) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}
server.get("/tmp/quote", getQuote);

// Start the server
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
