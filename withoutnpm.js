/* Scraping into DB (18.2.5)
 * ========================== */

// Dependencies
var express = require("express");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongo = require("mongodb");
// Initialize Express
var app = express();
var currentProduct;
const url = 'mongodb://localhost:27017/wayfair';

var resultsArray = [];

function Product(name, supplier, currentPrice, sku) {
    this.name = name;
    this.supplier = supplier;
    this.currentPrice = currentPrice;
    this.sku = sku;

}

app.listen(8080, function () {
    console.log("App running on port 8080!");
});

var len;
var resultsArray;
var itemsPerPage = 96;
var currPage = 0;
var x = 0;
var name;
var supplier;
var currentPrice;
var counter = 0;
var sku;
mongo.connect(url, function (err, db) {
    if (err) throw err
    else {
        console.log("we are in");
    }
    var search = db.collection('wLinks').find();
    search.forEach(function (doc, err) {
        resultsArray.push(doc);


    }, function () {
        len = resultsArray.length;
        requestController();


    });

    function requestController() {

        if (counter < len) {
            makeRequest(counter);
            counter++;
        } else {
            db.close();
            console.log("closed");
        }

    }

    function makeRequest(counter) {
        var options = {
            url: resultsArray[counter].link,
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
                name = $(".ProductDetailInfoBlock-header-title").text();
                supplier = $(".ProductDetailInfoBlock-header-link").text();
                currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children('span').text();
                sku = $("span.ProductDetailBreadcrumbs-item--product").text();
                currentProduct = new Product(name, supplier, currentPrice, sku);
                

                insertToMongo();

            }
        }
        request(options, callback);
    }

    function insertToMongo() {

        db.collection('BasicInfo').insert(currentProduct);


        setTimeout(function () {
            requestController();
            console.log("next");
        }, 500);
    }

});