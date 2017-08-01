module.exports = {


    Pricing: function ($) {

      
        var currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children().text().trim();
        var temp = $(".ProductDetailInfoBlock-pricing-strikethrough.js-listprice").text();
        var tempStrike = /\d+/.exec(temp);
        var discountPercentage = $("span.ProductDetailInfoBlock-pricing-discount.ProductDetailInfoBlock-pricing-discount--sale").text().trim();
        var tempparse = parseInt(tempStrike[0]);
        var strikeThrough = tempparse.toFixed(2);
        strikeThrough = '$' + strikeThrough;

        var priceObj = {
            currentPrice: currentPrice,
            priceDetails: {
                strikeThroughPrice: strikeThrough,
                discountPercentage: discountPercentage
            }

        }
       
        return priceObj;
    }
}