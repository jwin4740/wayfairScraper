// GLOBAL VARIABLES
const url = 'mongodb://localhost:27017/wayfair';
var currentProduct;
var len;
var resultsArray;
var itemsPerPage = 96;
var currPage = 0;
var x = 0;
var link;
var name;
var supplier;
var currentPrice;
var counter = 2599;
var sku;
var resultsArray = [];
var colorsArray = [];
var sizesArray = [];
var colors;
var sizes;
const site = "Wayfair";






// START DEPENDENCIES
var express = require("express");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");
var mongo = require("mongodb");
var app = express();
var priceParse = require("./pricingFunction.js");
var wParse = require("./functions.js")

// END DEPENDENCIES





function Product(site, name, supplier, sku, priceObj, colors, sizes, link) {
    this.Site = site;
    this.Name = name;
    this.Supplier = supplier;
    this.SKU = sku;
    this.Pricing = priceObj;
    this.Colors = colors;
    this.Sizes = sizes;
    this.Link = link;
    this.SearchDate = moment().format('MMMM Do YYYY');
}










app.listen(8080, function () {
    console.log("App running on port 8080!");
});
mongo.connect(url, function (err, db) {
    if (err) throw err
    else {
        console.log("we are in");
    }
    var search = db.collection('validLinks').find();
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
        link = resultsArray[counter].link;
        var options = {
            url: link,
            method: 'get',
            headers: {
                'User-Agent': 'request'
            }
        };
        request(options, callback);

        function callback(error, response, body) {
            if (error) {
                return;
            }
            if (!error && response.statusCode == 200) {
                cheerioGo(body);

            }
        }
    }



    var priceObj = "";



    /*------------- Function Definitions -----------------------------*/

    function cheerioGo(body) {
        var $ = cheerio.load(body);

        colorsArray = [];
        sizesArray = [];


     
        name = wParse.Name($);
        supplier = wParse.Supplier($);
        sku = wParse.Sku($);
        sizess = wParse.PricingAndSizes($);

        colors = wParse.Colors($);
        var regex = /\d{1,5}\.\d{0,2}/;




        // var currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children().text().trim();
        // $("select.ProductDetailOptions-select").children().each(function (i, elem) {
        //     var temp = $(this).text().trim();
        //     if (temp != "Select Size") {
        //         sizesArray.push(temp);
        //     }

        // });
        // console.log(sizesArray);








        if (colors.length === 0) {
            colors = "single color only";
        }
        currentProduct = new Product(site, name, supplier, sku, priceObj, colors, sizess, link);
        console.log(currentProduct);
        // if (err) throw err;
        insertToMongo();
    }



    function insertToMongo() {

        db.collection('sizeObject').insert(currentProduct);

        // console.log("done");
        // setTimeout(function () {
        //     requestController();
        //     if (counter % 5 === 0) {
        //         console.log(counter + " records inserted");
        //     }
        // }, 300);
    }
});