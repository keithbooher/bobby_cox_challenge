const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.json())

// Express will serve up production assets
// like our main.js file that the bundle creates
app.use(express.static('client/build'))
// Express will serve up the index.html file
// if it doesn't recognize the route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})


const PORT = process.env.PORT || 5000
app.listen(PORT)