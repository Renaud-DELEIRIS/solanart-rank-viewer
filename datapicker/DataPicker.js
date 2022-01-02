const express = require('express')
const axios = require("axios");
const cors = require('cors')
const fs = require('fs');
const app = express()
const port = 3050

var cached = fs.readFileSync(".cache/data.json")
cached = JSON.parse(cached)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors())

app.get('/data/:loop', async (req, res) => {
  if (cached[req.params.loop]) {
    res.send(cached[req.params.loop])
    console.log("cached")
  } else {
    var data = await axios({
      method: "GET",
      url : 'https://api.loops-info.xyz/loop/' + req.params.loop,
    });
    cached[req.params.loop] = data.data
    fs.writeFileSync(".cache/data.json", JSON.stringify(cached))
    res.send(data.data)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
