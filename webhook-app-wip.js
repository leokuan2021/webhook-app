//require express and body-parser
const express = require('express')
//const bodyParser = require('body-parser')

//initialize express and define a port

const app = express()
const port = 3000
/*
var http = require('http');
var options = {
  host: '192.168.1.240/hooks/61fa24816a025b000a3e4c83/BEvi47dRA5PzA7qaBy6W4qbS5vHqz2usfjffbjh8PCinmJg4',
  path: '/',
  port: '3000',
  method: 'POST'
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.write("data");
req.end();
*/
const fetch = require('node-fetch');

const url ='http://kube-master.localdomain:3000/hooks/61fb8352150524000a7712a3/EaKPZXb5MFfbbjabABWfGSk6xqBTjLExBzMMjxbzxDeHttSb';
const headers = {
  //"Content-Type": "application/json",
  //"client_id": "1001125",
  //"client_secret": "876JHG76UKFJYGVHf867rFUTFGHCJ8JHV"
}
const data = {
  "text": "Example message",
  "attachments": [
    {
      "title": "Rocket.Chat",
      "title_link": "https://rocket.chat",
      "text": "Rocket.Chat, the best open source chat",
      "color": "#764FA5"
    }
  ]
}

fetch(url, { method: 'POST', headers: headers, body: data})
  .then((res) => {
     return res.text()
})
.then((json) => {
   // Do something with the returned data.
  console.log(json);

});

// tell express to use body-parser's JSON parsing
app.use(express.json())
//app.use(express.urlencoded()); //Parse URL-encoded bodies


app.post('/', (req, res) => {
  console.log(`checkout SHA: ${req.body.checkout_sha}`)

  res.status(200).end()




  //return res.send('Received a POST HTTP method')

  //response.send(request.body.checkout_sha)

  //return res.send('Received a PUT HTTP method')
})


app.get('/', (req, res) => {
  //res.send('Hello World!')
  return res.send('Received a GET HTTP method')
})

app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method')
})

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method')
})

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
//app.listen(port, () => {
//  console.log(`Example app listening on port ${port}`)
//})
