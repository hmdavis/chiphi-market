var mongoose = require('mongoose'); 
var Item = mongoose.model('Items'); 

// get homepage 
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

// return all items and renders to page 
exports.itemlist = function(req,res) { 
    Item.find({},{},function(e,docs) { 
      var render_me = {'itemlist': docs};
      res.render('itemlist', render_me); 
    });
  };

exports.newitem = function(req,res) { 
	var render_me = {title: 'Add New Item'};
	res.render('newitem', render_me); 
};

exports.additem = function(req, res) {
	new Item({ 
		username: req.body.username,
		email: req.body.email, 
		title: req.body.title, 
		price: req.body.price, 
		negotiable: req.body.negotiable, 
		description: req.body.description, 
		num_wants: 0
	}).save(function(err, item) { 
		if (err) res.send(err); 
		else { 
			console.log(item); 
			res.location('itemlist');
			res.redirect('itemlist');
		}
	});
};  

exports.wantitem = function(req,res) { 
	var itemId = req.body.id; 
	var itemTitle = req.body.title; 
	var render_me = {title: 'Want ' + itemTitle, itemId: itemId, itemTitle: itemTitle};
	res.render('wantitem', render_me);
	};

// email the seller about who wants to buy, their number, return address, any special message 
// incremement the number of wants an item has (can display on the homepage)
exports.notifyseller = function(smtp) {
	return function(req,res) { 
		// query database to identify and notify seller
		var itemId = req.body.id;  
		var query = {_id:itemId}; 
		var fields = {email:true, username:true, _id:false}; 
		Item.findOne(query, fields, function(err,doc) { 
			if (err) { 
				console.log("error finding item"); 
				res.send(err); 
			} else { 
				// package email to send to seller 
				var itemTitle = req.body.title; 
				var buyerName = req.body.username; 
				var buyerNumber = req.body.phone;
				var buyerEmail = req.body.email;
				var sellerEmail = doc.email; 
				var sellerName = doc.username; 
				var messageBody = "Hi " + sellerName + ",\n\nI'm interested in purchasing your item: " + itemTitle + ". To further discuss this, you can contact me at: \nEmail:\t" + buyerEmail + "\nPhone:\t" + buyerNumber +"\n\nThanks,\n" + buyerName; 
				var mailOptions = { 
					from: buyerEmail, 
					to: sellerEmail, 
					subject: "Interested in " + itemTitle, 
					text: messageBody
				}; 
				// send notification email to seller 
				smtp.sendMail(mailOptions, function(err, res) { 
					if(err) { 
						console.log("error sending email"); 
						res.send(err); 
					} else {
						console.log("Message sent: " + res.message); 
					}
				});
				// increment the num_wants field in item 
				var updates = {$inc: {num_wants: +1}};
				Item.update(query, updates);
			}
		}); 
		// TODO: notify successful email? 
		res.location('itemlist');
		res.redirect('itemlist');
	}; 
}; 
