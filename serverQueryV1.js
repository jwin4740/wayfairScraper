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
var name;
var supplier;
var currentPrice;

// constructor object for resultsArray
var currentProduct;

function Product(id, name, supplier, currentPrice) {
    this._id = id
    this.name = name;
    this.supplier = supplier;
    this.currentPrice = currentPrice;

}

db.wLinks.find({}).toArray(function (err, result) {
    if (err) throw err;
    resultsArray = result;
    db.close();
    console.log(resultsArray[0]);
    makeRequest();
});



function makeRequest() {
    var options = {
        url: resultsArray[0].link,
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
            //   currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children().text();

            currentProduct = new Product("15", name, supplier, currentPrice);



            console.log("done requesting");
            insertToMongo();

        }

    }

    request(options, callback);

}


function insertToMongo() {


    db.wSuppliers.insert({
        "Name": name,
        "Supplier": supplier,
        "CurrentPrice": currentPrice
       

    });
   
    console.log("done inserting into mongo");
}




app.listen(8080, function () {
    console.log("App running on port 8080!");
});