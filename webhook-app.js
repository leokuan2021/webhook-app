/**
 * Description: A REST API app that redirects webhooks from Gitlab to Rocket.Chat as direct messages. It also keeps track of the number of webhooks received
 * as well as the number of in-flight requests and exposes them at the /metrics endpoint for Prometheus to scrape.
 *

 * SRE/DevOps Challenge
 * https://pastebin.com/b7uUFMdj
 *
 * Requirement 1:
 * Write a REST API application that, when sent a GitLab webhook, sends the git commit SHA to a Rocket Chat user as a direct message
 * (language of your choosing). Push this to a project on your GitLab instance created above.
 *
 * Requirement 2:
 * Add a Prometheus metrics endpoint to your REST API that exposes a count of received webhooks.
 *
 * Requirement 3:
 * Create another custom metric for your REST API that exposes a count of in-flight requests.
 *
 */

const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = 3000

const http = require('http')
const server = http.createServer(app)
const client = require('prom-client')

let register = new client.Registry()
const webhookCount = new client.Counter({
    name: "webhook_count",
    help: "Number of webhooks received"
})

const inflightCount = new client.Gauge({
  name: "inflight_count",
  help: "Number of infllight webhooksss"
})

register.registerMetric(webhookCount)
register.registerMetric(inflightCount)
register.setDefaultLabels({
  app: 'webhook-app'
})

// URL for POST request to Rocket Chat's incoming webhook, quick and dirty for testing/demo purposes only; always use proper secrete management for production
const url = 'http://rocketchat.leokuan.info/hooks/628f2bc88374570053f8945d/CG4d2wwWB2cd29W5ZXz7zfkWvWtJLE48YkkDwCBvoduoczgE'
const headers = {
  "Content-Type": "application/json",
}

//For Requirement 3: Repeatedly calling every 100ms NodeJS's built in function server.getConnections to get the number of concurrent connections and update inflightCount's value each time.
setInterval(() => server.getConnections(
    (err, connections) => {
     // console.log(`${connections} connections currently open`)
      inflightCount.set(connections)
    }
), 100)

server.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

// use express for JSON parsing
app.use(express.json())

// For requirement 1 : upon receiving a POST request from gitlab, extract the git commit SHA and send to a Rocket Chat user as a direct message.
// I decided to configure an incoming webhook in Rocket Chat to achieve this.

app.post('/', (req, res) => {

    //console.log(`checkout SHA: ${req.body.checkout_sha}`)
    webhookCount.inc(1)

    //Some APIs will continue to retry sending the payload if they don't receive an acceptable response code in a certain amount of time, typically within 3 seconds,
    //let's respond quickly with a 200 status code just to be safe.
    res.status(200).end()

    // extract the the SHA from the payload sent by the Gitlab webhook
    const data = {
      "text": `checkout SHA: ${req.body.checkout_sha}`,
    }

    // send our POST request to Rocket.Chat with the SHA
    fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data)})
        .then((res) => {
            return res.json()
        })

    .then((json) => {
       // Do something with the returned data.
     // console.log(json);

    })
})

app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method')
})

// For requirements 2 and 3
app.get('/metrics', async (req, res) => {
      res.setHeader('Content-Type', register.contentType)
      res.end(await register.metrics())
})

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method')
})

app.delete('/', (req, res) => {
   return res.send('Received a DELETE HTTP method')
})
