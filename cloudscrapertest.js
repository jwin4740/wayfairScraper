/* Scraping into DB (18.2.5)
 * ========================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();


var cloudscraper = require('cloudscraper');
cloudscraper.get('https://www.wayfair.com/bed-bath/sb0/sheets-c431080.html/', function(error, response, body) {
  if (error) {
    console.log('Error occurred');
  } else {
    console.log(body, response);
  }
});






// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
