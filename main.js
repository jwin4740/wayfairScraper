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
var sizess;




// START DEPENDENCIES
var express = require("express");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");
var mongo = require("mongodb");
var app = express();
var wParse = require("./functions.js")

// END DEPENDENCIES





function Product(name, supplier, sku, priceObj, colors, sizes, financing, link) {
    this.Name = name;
    this.Supplier = supplier;
    this.SKU = sku;
    this.Pricing = priceObj;
    this.Colors = colors;
    this.Sizes = sizes;
    this.Financing = financing;
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
        link = 'https://www.wayfair.com/Red-Barrel-Studio-Biggsville-1200-Thread-Count-Cotton-Sheet-Set-RDBL1806.html';
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



var priceObj;



    /*------------- Function Definitions -----------------------------*/

    function cheerioGo(body) {
        colorsArray = [];
        sizesArray = [];
        var $ = cheerio.load(body);


        name = wParse.Name($);
        supplier = wParse.Supplier($);
        sku = wParse.Sku($);
        sizess = wParse.Sizes($);
        colorss = wParse.Colors($);
        priceObj = wParse.Pricing($);
     
       
        var financing = "N/A";
     

        
      
        if (colorss.length === 0) {
            colorss = "single color only";
        }
        currentProduct = new Product(name, supplier, sku, priceObj, colorss, sizess, financing, link);
        console.log(currentProduct);
        // if (err) throw err;
        // insertToMongo();
    }
});

function insertToMongo() {
    if (currentProduct.name != null) {
        db.collection('BasicInfo').insert(currentProduct);
    }
    setTimeout(function () {
        requestController();
        if (counter % 5 === 0) {
            console.log(counter + " records inserted");
        }
    }, 300);
}