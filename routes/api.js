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
    likes: Number,
    likeIP: String
});
//
var Stock = mongoose.model("Stock", stockSchema);

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
    var retObj={stockData:[]}
    var company = []
    var curLikes = 0
    var likeAdder = 0

    if(Array.isArray(req.query.stock)){company = req.query.stock}
    else company.push(req.query.stock)
    if(req.query.like=="true"){ likeAdder = 1}
    if(!company){res.send("Please include a company name")}
    else{
      company.forEach((d)=>{
    var searchURL = "https://repeated-alpaca.glitch.me/v1/stock/"+d+"/quote"
    fetch(searchURL)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
      var newStock=new Stock({
        stock: d,
        price: data.latestPrice,
        likes: likeAdder,
        likeIP: req.ip
      })
      newStock.save();
      retObj.stockData.push(newStock)
      console.log(retObj)
      res.send(retObj);
            })
    });
    }
});
};
//