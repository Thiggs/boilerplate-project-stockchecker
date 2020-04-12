/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require('mongoose');

const CONNECTION_STRING = process.env.DB; 
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if(err){console.log("error")}
});

var Schema = mongoose.Schema;

var stockSchema = new Schema({
    stock: String,
    price: String,
    likes: Number
});
//
var Stock = mongoose.model("Stock", stockSchema);

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
    console.log(req.query.like)
    var retObj={stockData:[]}
    var company = req.query.stock
    var likeAdder = 0
    
    if(req.query.like=="true"){ likeAdder = 1}
    if(!company){res.send("Please include a company name")}
    else{
    var searchURL = "https://repeated-alpaca.glitch.me/v1/stock/"+company+"/quote"
    fetch(searchURL)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
      //
      var newStock=new Stock({
        stock: company,
        price: data.latestPrice,
        likes: likeAdder
      })

      newStock.save();
      retObj.stockData.push(newStock);
      console.log(retObj)
      res.send(retObj);
        });
}
    });
  
function newCompany(){
  
}

    
};
