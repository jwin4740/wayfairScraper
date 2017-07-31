// GLOBAL VARIABLES
const url = 'mongodb://localhost:27017/wayfair';
var resultLength = 0; // how many results in total are there in the initial search
var resultsArray = [];
var itemsPerPage = 96;
var currPage = 0;


// START DEPENDENCIES
var express = require("express");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");
var mongo = require("mongodb");
var app = express();
var wParse = require("./functions.js");
// END DEPENDENCIES

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});


mongo.connect(url, function (err, db) {
    if (err) throw err
    else {
        makeRequest();
    }

    function makeRequest() {
        currPage++;
        var options = {
            url: 'https://www.wayfair.com/bed-bath/sb0/sheets-c431080.html?itemsperpage=' + itemsPerPage + '&curpage=' + currPage,
            method: 'get',
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {

            if (error) {
                return;
            }
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                if (currPage === 1) {
                    resultLength = wParse.QueryResultLength($);
                    console.log("Total Results: " + resultLength);
                }

                $("a.SbProductBlock").each(function (i, elem) {  // a.SbProductBlock seems to be a validated tag
                    var tempLink = $(this).attr("href");
                    resultsArray.push(tempLink)
                });
                var len = resultsArray.length;


                if (len < resultLength) {
                    console.log(len);
                    makeRequest();
                } else {
                    console.log("done requesting");
                    insertToMongo();
                }
            }
        }

        request(options, callback); // where request is called

    }

    function insertToMongo() {
        var n = resultsArray.length;
        for (var i = 0; i < n; i++) {
            db.collection('validLinks').insert({
                "link": resultsArray[i]
            });

        }
        db.close();
        console.log("done inserting into mongo");
    }

});