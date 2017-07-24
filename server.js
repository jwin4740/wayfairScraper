/* Scraping into DB (18.2.5)
 * ========================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "wayfair";
var collections = ["wSuppliers"];
var results = [];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl);
db.on("error", function(error) {
  console.log("Database Error:", error);
});



// // Retrieve data from the db
// app.get("/all", function(req, res) {
//   // Find all results from the scrapedData collection in the db
//   db.scrapedData.find({}, function(error, found) {
//     // Throw any errors to the console
//     if (error) {
//       console.log(error);
//     }
//     // If there are no errors, send the data to the browser as a json
//     else {
//       res.json(found);
//     }
//   });
// });

// Scrape data from one site and place it into the mongodb db

  request("https://www.wayfair.com/bed-bath/sb0/sheets-c431080.html/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    console.log(html);
    // For each element with a "title" class
    $("#att_1224_109").each(function(i, element) {
      // Save the text of each link enclosed in the current element
      var name = $(this).children("a").text();
      // Save the href value of each link enclosed in the current element
      console.log(name);
      // If this title element had both a title and a link
      if (name) {
        // Save the data in the scrapedData db
        db.wSuppliers.insert({
          name: name
         
        },
        function(error, saved) {
          // If there's an error during this query
          if (error) {
            // Log the error
            console.log(error);
          }
          // Otherwise,
          else {
            // Log the saved data
            console.log(saved);
          }
        });
      }
    });
  });





// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
