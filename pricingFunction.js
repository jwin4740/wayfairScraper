module.exports = {


    Pricing: function ($, element) {

      
        var currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children().text().trim();
       
    
       
        return currentPrice;
    }
}

  var regex = /\d{1,5}\.\d{0,2}/;