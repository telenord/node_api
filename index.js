const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');


const httpServer = http.createServer((req, res) => unifiedServer(req, res));

const httpsServerOption = {
  'key':fs.readFileSync('./https/key.pem'),
  'cert':fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsServerOption, (req, res) => unifiedServer(req, res));

const httpPort = config.httpPort;
const httpsPort = config.httpsPort;
// http server
httpServer.listen(httpPort, () => {
  console.log('server listen on ' + httpPort);
});

httpsServer.listen(httpsPort, () => {
  console.log('httpsServer listen on ' + httpsPort);
});

const unifiedServer = (req, res)=>{

  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  const queryStringObject = parsedUrl.query;

  const method = req.method.toLowerCase();

  const headers = req.headers;

  // get payload
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    //choose the handler this request should go to
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    const data = { trimmedPath, queryStringObject, method, headers, 'payload': buffer };
    chosenHandler(data, (statusCode, payload)=>{
      statusCode = typeof(statusCode) === 'number'? statusCode: 200;
      payload = typeof(payload) === 'object'? payload: {};
      // convert payload to string
      const payloadString = JSON.stringify(payload);

      // return response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('asdasd', statusCode,payloadString );

    })
  });
}

const handlers = {};

handlers.sample = (data, cb) => {
  cb(406, {'name': 'sample handler'});
};

handlers.ping = (data, cb) => {
  cb(200);
};

handlers.notFound = (data, cb) => {
  cb(404);
};

const router = {
  'sample': handlers.sample,
  'ping': handlers.ping,
};