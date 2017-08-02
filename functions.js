var priceParse = require("./pricingFunction.js");


// sheet elements

const nameElement = "#product-page-title";
const supplierElement = "a.ProductDetailInfoBlock-header-manuLink";
const priceElement = "span#sale_price";
const skuElement = "select.js-select-category.ProductDetail-select-category";
const colorElement = '.ProductDetail-select-category[data-category="Color"]';

module.exports = {


    // START function that grabs the name of the product
    Name: function ($) {
        return $(nameElement).text().trim();
    },
    // END function that grabs name of product


    // START function that grabs the supplier of the product
    Supplier: function ($) {
        return $(supplierElement).text().trim();
    },
    // END function that grabs supplier of product

    Sku: function ($) {
        var sku = $(skuElement).attr("data-sku");
        return sku;

    },

    PricingAndSizes: function ($) {

        var sizesArray = []; // cheerio results are stored in here
        var exportedArray = [];

        function SizeConstruct(size, price) {
            this.Size = size;
            this.Price = price;
        }
        var currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children().text().trim();
        $("select.ProductDetailOptions-select").children().each(function (i, elem) {
            var temp = $(this).text().trim();
            if (temp != "Select Size") {
                sizesArray.push(temp)
            }

        });
        return sizesArray;
        // sizesArray.forEach(function (element) {
        //     var sizeConstruct = new SizeConstruct(element, currenciesAsNumbers);
        //     exportedArray.push(sizeConstruct);

        // }, this);
        // return exportedArray;
    },

    QueryResultLength: function ($) {
        var resultsSumTemp = $('.js-filter-remove-list').children().text().trim();
        return parseInt(resultsSumTemp.replace(/,/, ""));

    },

    Colors: function ($) {
        var colorsArray = [];
        $(colorElement).children().each(function (i, elem) {

            var temp = $(this).attr("data-option-name");
            if (typeof temp != "undefined") {
                colorsArray.push(temp);
            }
        });
        return colorsArray;

    }





}