const express = require('express')
const fetch = require('node-fetch')
//var assert = require('assert')
//initialize express and define a port
const app = express()
const port = 3000
const http = require('http')
const server = http.createServer(app)
// var net = require('net')
/*
Add a Prometheus metrics endpoint to your REST API that exposes a count of received webhooks.

Configure Prometheus to scrape that endpoint using ServiceMonitor, and create a provisioned Grafana dashboard for the metric.

Create another custom metric for your REST API that exposes a count of in-flight requests.

*/
// var server = net.createServer(app)


const client = require('prom-client')
// const inflightRequests = require('inflight-requests');
// const inflight = inflightRequests();

// app.use(inflight);
//assert(inflight.requestsCount() === 0);

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



// inflightCount.set(server.getConnections())

// inflightCount.inc(1);
// client.collectDefaultMetrics({ register });

/**
 * Newly added requires
 */
// var Register = require('prom-client').register;
// var Counter = require('prom-client').Counter;
// var Histogram = require('prom-client').Histogram;
// var Summary = require('prom-client').Summary;
// var ResponseTime = require('response-time');
// var Logger = require('./logger')('metrics');
// let prefix = 'app_';
 

//URL for POST request to Rocket Chat's incoming webhook
//const url ='http://kube-master.localdomain:3000/hooks/61fb8352150524000a7712a3/EaKPZXb5MFfbbjabABWfGSk6xqBTjLExBzMMjxbzxDeHttSb'
//const url ='http://192.168.1.240:3000/hooks/61fb8352150524000a7712a3/EaKPZXb5MFfbbjabABWfGSk6xqBTjLExBzMMjxbzxDeHttSb'
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

//  server.getConnections(function(err, count) {
//    console.log(count)
 //   inflightCount.set(count)
//  })
 
  

  
// tell express to use JSON parsing
app.use(express.json())

// upon receiving a POST request from gitlab, extract the git commit SHA and send to a Rocket Chat user as a direct message. 
// I decided to configure an incoming webhook in Rocket Chat to acheive this.
// A POST request is sent to Rocket Chat's incoming webhook which is configured to send the message to user @devops.

app.post('/', (req, res) => {
  //console.log(`checkout SHA: ${req.body.checkout_sha}`)
  webhookCount.inc(1);
  console.log(`webhook count: ${webhookCount}\n`)

 // res.setHeader('Content-Type', register.contentType);
 // res.end(await register.metrics());
   res.status(200).end()
/*
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
  
  });    */
})
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
})

app.get('/', (req, res) => {
  //res.send('Hello World!')
  return res.send('Received a GET HTTP method')
})
/*
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method')
})
*/

app.put('/', (req, res) => {
 // return res.send('Received a PUT HTTP method')
})

app.delete('/', (req, res) => {
  webhookCount.inc(1);
   return res.send('Received a DELETE HTTP method')
})

server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


//app.listen(port, () => {
//  console.log(`Example app listening on port ${port}`)
//})
