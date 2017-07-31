module.exports = {

    // START function that grabs the name of the product
    Name: function ($) {
        return $(".ProductDetailInfoBlock-header-title").text();
    },
    // END function that grabs name of product


    // START function that grabs the supplier of the product
    Supplier: function ($) {
        return $(".ProductDetailInfoBlock-header-link").text().trim();
    },
    // END function that grabs supplier of product

    Sku: function ($) {
        var rawSku = $("span.ProductDetailBreadcrumbs-item--product").text().trim();
        return rawSku.replace(/SKU: /, "");

    },

    Sizes: function ($) {
          var sizesArray = [];
      
        $("select.ProductDetailOptions-select").children().each(function (i, elem) {
            var temp = $(this).attr("data-option-name");
            sizesArray.push(temp);
        });
        sizesArray.shift();
        return sizesArray;
    },

    QueryResultLength: function ($) {
        var resultsSumTemp = $('.js-filter-remove-list').children().text().trim();
        return parseInt(resultsSumTemp.replace(/,/, ""));

    },

    Colors: function ($) {
          var colorsArray = [];
        $("a.ProductDetailOptions-thumbnail").each(function (i, elem) {

            var temp = $(this).attr("data-name");
            colorsArray.push(temp);
        });
        return colorsArray;

    },

    Pricing: function ($) {

        return priceObj = $(".ProductDetailInfoBlock-pricing").text().trim();

    }



















}