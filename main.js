// START DEPENDENCIES
var express = require("express");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");
var mongo = require("mongodb");
var app = express();

// END DEPENDENCIES



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

function Product(link, name, supplier, sku, priceObj, colors, sizes, financing) {
    this.Link = link;
    this.SearchDate = moment().format('MMMM Do YYYY');
    this.Name = name;
    this.Supplier = supplier;
    this.SKU = sku;
    this.Pricing = priceObj;
    this.Colors = colors;
    this.Sizes = sizes;
    this.Financing = financing;
}










app.listen(8080, function () {
    console.log("App running on port 8080!");
});
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
        link = resultsArray[counter].link;
        var options = {
            url: "https://www.wayfair.com/Cafe-100%25-Egyptian-Quality-Cotton-Sheet-Set-STPH1235.html",
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
function parseSizes (){
    
}
    function cheerioGo(body) {
        colorsArray = [];
        sizesArray = [];
        var $ = cheerio.load(body);
        name = $(".ProductDetailInfoBlock-header-title").text();
        supplier = $(".ProductDetailInfoBlock-header-link").text().trim();
        var rawSku = $("span.ProductDetailBreadcrumbs-item--product").text().trim();
        sku = rawSku.replace(/SKU: /, "");


        $("select.ProductDetailOptions-select").children().each(function (i, elem) {
            sizesArray[i] = $(this).attr("data-option-name");
        });
        sizesArray.shift();
        $("a.ProductDetailOptions-thumbnail").each(function (i, elem) {

            colorsArray[i] = $(this).attr("data-name");
        });
        var financing;
        var financeDiv = $(".ProductDetailCardMarketing").text().trim();

        if (financeDiv != null) {
            financing = financeDiv;
        } else {
            financing = "none";
        }

        var priceObj = $(".ProductDetailInfoBlock-pricing").text().trim();
        priceObj.replace('\n', ' ');
      if (colorsArray.length === 0)
        {
            colorsArray = "single color only";
        }
        currentProduct = new Product(link, name, supplier, sku, priceObj, colorsArray, sizesArray, financing);
        console.log(currentProduct);
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