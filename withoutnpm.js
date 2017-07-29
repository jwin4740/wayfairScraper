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

function Product(name, supplier, currentPrice, sku, colors, sizes) {
    this.name = name;
    this.supplier = supplier;
    this.currentPrice = currentPrice;
    this.sku = sku;
    this.colors = colors;
    this.sizes = sizes

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
var counter = 2599;
var sku;
mongo.connect(url, function (err, db) {
    if (err) throw err
    else {
        console.log("we are in");
    }
    var search = db.collection('allLinks').find();
    search.forEach(function (doc, err) {
        resultsArray.push(doc);


    }, function () {
        len = resultsArray.length;
        console.log(len);
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
            
            if (error) {
                return;
            }
            if (!error && response.statusCode == 200) {
                var colorsArray = [];
                var sizesArray = [];
                var $ = cheerio.load(body);
                name = $(".ProductDetailInfoBlock-header-title").text();
                supplier = $(".ProductDetailInfoBlock-header-link").text();
                currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children('span').text();
                sku = $("span.ProductDetailBreadcrumbs-item--product").text();
                $("a.ProductDetailOptions-thumbnail").each(function (i, elem) {
                    colorsArray[i] = $(this).attr("data-name");
                });
                $("select.ProductDetailOptions-select").children().each(function (i, elem) {
                    sizesArray[i] = $(this).attr("data-option-name");
                });
                sizesArray.shift();
                currentProduct = new Product(name, supplier, currentPrice, sku, colorsArray, sizesArray);


                insertToMongo();

            }
        }
        request(options, callback);
    }

    function insertToMongo() {

        if (currentProduct.name != null) {

            db.collection('BasicInfo').insert(currentProduct);
        }


        setTimeout(function () {
            requestController();
            if (counter % 5 === 0){
                console.log(counter + " records inserted");
            }
        }, 300);

    }

});