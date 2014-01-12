var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var item_schema = new Schema({
	username: String, 
	email: String,
	title: String,
	price: String, 
	negotiable: String, 
	description: String, 
	num_wants: Number
});

mongoose.model('Items', item_schema); 

var uristring = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'localhost/items';

mongoose.connect(uristring, function (err, res) {
    if (err) { 
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Connected to: ' + uristring);
    }
});