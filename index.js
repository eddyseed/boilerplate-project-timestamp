// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/api/:date', (req, res) => {
  const dateParam = req.params.date;
  let date;
  if (!isNaN(dateParam)) {
    // If date is a number (Unix timestamp), parse it
    date = new Date(parseInt(dateParam));
  } else {
    // Else try to parse it as a date string
    date = new Date(dateParam);
  }

  // Handle invalid date
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Return Unix timestamp and UTC date
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
})
// /api route for current date and time when no date parameter is provided
app.get('/api/', (req, res) => {
  const now = new Date();
  res.json({ unix: now.getTime(), utc: now.toUTCString() });
});


// // your first API endpoint... 
// app.get("/api/hello", function (req, res) {
//   res.json({ greeting: 'hello API' });
// });



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
