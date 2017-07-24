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

var resultLength = 0;

var itemsPerPage = 96;
var currPage = 0;

makeRequest();

function makeRequest() {
  var options = {
    url: 'https://www.wayfair.com/bed-bath/sb0/sheets-c431080.html?itemsperpage=' + itemsPerPage + '&curpage=' + currPage,
    method: 'get',
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {
    currPage++;
    if (error) {
      return;
    }
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var test = $(".product_blocks_wrapper").find("a.SbProductBlock").attr("href");
      resultLength += test.length;
      console.log(resultLength);
      setTimeout(makeRequest, 500);
    }

  }

  request(options, callback);

}




// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});