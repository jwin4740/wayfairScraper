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
var resultsArray;
var itemsPerPage = 96;
var currPage = 0;
var x = 0;

db.wLinks.find({}).toArray(function (err, result) {
    if (err) throw err;

    resultsArray = result;
    db.close();
    console.log(resultsArray[0]);
});
// constructor object for resultsArray

// makeRequest();



app.listen(8080, function () {
    console.log("App running on port 8080!");
});