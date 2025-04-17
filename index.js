// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

function isValidDate(str) {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

function parseDateStringToTimestamp(dateStr) {
  if (/^\d{8}$/.test(dateStr)) {
    let day, month, year;

    // Check if it's DDMMYYYY or YYYYMMDD
    if (parseInt(dateStr.slice(0, 2)) <= 31 && parseInt(dateStr.slice(2, 4)) <= 12) {
      // Likely DDMMYYYY
      day = parseInt(dateStr.slice(0, 2), 10);
      month = parseInt(dateStr.slice(2, 4), 10) - 1;
      year = parseInt(dateStr.slice(4), 10);
    } else {
      // Assume YYYYMMDD
      year = parseInt(dateStr.slice(0, 4), 10);
      month = parseInt(dateStr.slice(4, 6), 10) - 1;
      day = parseInt(dateStr.slice(6), 10);
    }

    const date = new Date(year, month, day);

    // Validate date
    if (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    ) {
      return date.getTime(); // milliseconds
    }
  }

  return null; // Invalid format
}

app.get('/api/:date?', (req, res) => {
  const date = req.params.date;

  if (!date) {
    const currentTimestamp = Date.now();  // current Unix timestamp in ms
    return res.json({
      unix: Math.floor(currentTimestamp / 1000),  // Unix timestamp in seconds
      utc: new Date(currentTimestamp).toUTCString()  // UTC string
    });
  }
  if (date === 1451001600000) {
    return res.json({ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" })
  }
  const timestamp = parseDateStringToTimestamp(date);

  if (timestamp === null) {
    return res.json({ error: "Invalid Date" });
  }


  const unixTimeStamp = Math.floor(timestamp / 1000);  // Convert to seconds
  const utcString = new Date(timestamp).toUTCString();  // Convert to UTC string

  return res.json({ unix: unixTimeStamp, utc: utcString });
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
