module.exports = {


    Pricing: function ($, element) {

      
        var currentPrice = $(".ProductDetailInfoBlock-pricing-amount").children().text().trim();
       
    
       
        return currentPrice;
    }
}

     