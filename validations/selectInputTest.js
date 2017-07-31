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
var counter = 0;
var sku;
var resultsArray = [];
var colorsArray = [];
var sizesArray = [];
var multipleSizesArray = [];




// START DEPENDENCIES
var express = require("express");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");
var mongo = require("mongodb");
var app = express();
// var wParse = require("./functions.js")

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
        if (counter < 20) {
            makeRequest(counter);
            counter++;
        } else {
            insertToMongo();
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







    /*------------- Function Definitions -----------------------------*/

    function cheerioGo(body) {
        colorsArray = [];
        sizesArray = [];
        var $ = cheerio.load(body);


        $(".ProductDetailOptions-select").children().each(function (i, elem) {
            sizesArray[i] = $(this).attr("data-option-name");
        });
        multipleSizesArray.push(sizesArray);

        setTimeout(function () {
            requestController();
            if (counter % 5 === 0) {
                console.log(counter + " records searched");
            }
        }, 100);
    }




    function insertToMongo() {
        var n = resultsArray.length;
        for (var i = 0; i < 20; i++) {
            db.collection('selectionTest').insert({
                "link": resultsArray[i],
                "selects": multipleSizesArray[i]

            });

        }
        db.close();
        console.log("done inserting into mongo");
    }

});