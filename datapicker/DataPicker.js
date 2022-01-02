const express = require('express')
const axios = require("axios");
const cors = require('cors')
const app = express()
const port = 3050

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors())

app.get('/data/:loop', async (req, res) => {
  var data = await axios({
    method: "GET",
    url : 'https://api.loops-info.xyz/loop/' + req.params.loop,
  });
  console.log(req.params.loop)
  res.send(data.data)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
