const express = require('express')
//const fetch = require('node-fetch')
const app = express()
const port = 3000
//const http = require('http')
//const server = http.createServer(app)

//const client = require('prom-client')
const promBundle = require("express-prom-bundle");
// Add the options to the prometheus middleware most option are for http_request_duration_seconds histogram metric
const metricsMiddleware = promBundle({
 includeMethod: true, 
 includePath: true, 
 includeStatusCode: true, 
 includeUp: true,
 customLabels: {project_name: 'hello_world', project_type: 'test_metrics_labels'},
 promClient: {
 collectDefaultMetrics: {
 }
 }
});
app.use(metricsMiddleware)

// default endpoint 
app.get("/",(req,res) => res.json({
  "GET /": "All Routes", 
  "GET /hello": "{hello:world}", 
  "GET /metrics": "Metrics data",
  "POST /bye": "POST Request: + post data"
 }));
 // hello world rest endpoint 
 app.get("/hello", (req,res) => res.json({hello:"world"}));
 app.post("/bye", (req,res) => res.send("POST Request : "+ req));
 app.listen(3000, function () { 
  console.log('Listening at http://localhost:8080'); 
  });




/*
let register = new client.Registry();

const webhookCount = new client.Counter({
    name: "webhook_count",
    help: "Number of webhooks received"
});

const inflightCount = new client.Gauge({
  name: "inflight_count",
  help: "Number of infllight webhooksss"
});

register.registerMetric(webhookCount);
register.registerMetric(inflightCount);

register.setDefaultLabels({
  app: 'webhook-app'
});

client.collectDefaultMetrics({ register });

const url = 'http://rocketchat.leokuan.info/hooks/62061934f2a89e000d580276/9GLshYovLXcw2XsjnLbyW7CKfNnsmKnWqGZzyaWBLD3bQGRh'
const headers = {
  "Content-Type": "application/json",
  }

  setInterval(() => server.getConnections(
    (err, connections) => {
     // console.log(`${connections} connections currently open`)
      inflightCount.set(connections)
    }
), 10);

// tell express to use JSON parsing
app.use(express.json())

app.post('/', (req, res) => {
  //console.log(`checkout SHA: ${req.body.checkout_sha}`)

  res.status(200).end()
  webhookCount.inc(1);

  const data = {
    "text": `checkout SHA: ${req.body.checkout_sha}`,
     }
  
     fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data)})
     .then((res) => {
        return res.json()
   })
   
  .then((json) => {
     // Do something with the returned data.
    console.log(json);
  
  });    
})
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
})

app.get('/', (req, res) => {
  //res.send('Hello World!')
  return res.send('Received a GET HTTP method')
})

app.put('/', (req, res) => {
 // return res.send('Received a PUT HTTP method')
})

app.delete('/', (req, res) => {
  // return res.send('Received a DELETE HTTP method')
})

server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
//app.listen(port, () => {
//  console.log(`Example app listening on port ${port}`)
//})



*/