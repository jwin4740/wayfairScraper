var product = {
    dateSearched : "asfasf",
    link: "asfasfd",
    name: "sdfsf",
    supplier: "sadfasf",
    sku: 123123,
    colors : ["asdfasf", "asdfasf"],
    sizes : ["sfds", "dgdsgd"],
    pricing: function () {
        var price = this.sizes.length;
       
        return price;
    }


};


var temp = product.sizes[0];
product[temp] = 15;
console.log(product);

var date = new Date();
console.log(now);