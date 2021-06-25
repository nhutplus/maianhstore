var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mystore";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mystore");
  dbo.collection('order').aggregate([
   {
      $lookup:
        {
          from: "user",
          localField: "user_id",
          foreignField: "user_id",
          as: "donhang_nguoimua"
        }
   },
 
    {
      $lookup:
        {
          from: "product",
          localField: "product_id",
          foreignField: "product_id",
          as: "donhang_sanpham"
        }
   },
 
     {   
         $project:{
               _id : 0,
               order_id : 1,
               name : "$donhang_nguoimua.name",
               email : "$donhang_nguoimua.email",
               phone : "$donhang_nguoimua.phone",
               address : "$donhang_nguoimua.address",
               product : "$donhang_sanpham.name",
               price : "$donhang_sanpham.price",
               tongdonhang : { '$sum' : '$donhang_sanpham.price' },
         } 
     },
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res, null, 2));
    db.close(); 
  });
});