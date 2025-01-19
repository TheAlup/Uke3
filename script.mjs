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

// Start the server
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
