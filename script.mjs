import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

// Add middleware for parsing JSON bodies in POST requests
server.use(express.json());  // This ensures you can handle JSON requests in POST
server.use(express.urlencoded({ extended: true }));  // To handle form submissions (optional)

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

// Other task --------->

// Route for "/tmp/sum/a/b" - GET request (change to GET to be accessible in the browser)
function getSum(req, res, next) {
    // Extract a and b from the URL parameters
    const a = parseInt(req.params.a, 10);
    const b = parseInt(req.params.b, 10);

    // Check if a and b are valid numbers
    if (isNaN(a) || isNaN(b)) {
        res.status(400).send('Both a and b should be valid numbers.');
        return;
    }

    // Calculate the sum
    const sum = a + b;

    // Send the result as the response
    res.status(HTTP_CODES.SUCCESS.OK).send(`The sum of ${a} and ${b} is ${sum}.`).end();
}

// Add the GET route to handle the sum request
server.get("/tmp/sum/:a/:b", getSum);
