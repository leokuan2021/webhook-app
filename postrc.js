const fetch = require('node-fetch');

const url ='http://kube-master.localdomain:3000/hooks/61fb8352150524000a7712a3/EaKPZXb5MFfbbjabABWfGSk6xqBTjLExBzMMjxbzxDeHttSb';
const headers = {
  "Content-Type": "application/json",
  //"client_id": "1001125",
  //"client_secret": "876JHG76UKFJYGVHf867rFUTFGHCJ8JHV"
}
const data = {
  "text": "fuck you",
  "attachments": [
    {
      "title": "eat shit bitch",
      "color": "#764FA5"
    }
  ]
}

fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data)})
  .then((res) => {
     return res.json()
})
.then((json) => {
   // Do something with the returned data.
  console.log(json);

});

