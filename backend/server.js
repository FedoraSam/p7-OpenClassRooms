const http = require('http');

const app = require('./app');

app.set('port', process.env.PORT || 4000)

const server = http.createServer(app)

server.listen(process.env.PORT || 4000);

/*
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const app = require('./app');


https.createServer(options, app).listen(4000);
*/