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

var databaseUrl = "wayfair";
var collections = ["wLinks"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function (error) {
  console.log("Database Error:", error);
});

var resultLength = 0;
var resultsArray = [];
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

      $("a.SbProductBlock").each(function (i, elem) {
        var tempLink = $(this).attr("href");
        resultsArray.push(tempLink)
      });
     
      console.log(resultsArray.length);
      if (currPage < 2) {
      setTimeout(makeRequest, 500);
      } else {
        console.log("done requesting");
        insertToMongo();
      }
    }

  }

  request(options, callback);

}

function insertToMongo() {
  var n = resultsArray.length;
  for (var i = 0; i < n; i++) {
    db.wSuppliers.insert({
      "link": resultsArray[i]
    });

  }
  db.close();
  console.log("done inserting into mongo");
}


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});