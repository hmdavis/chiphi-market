/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

// return all items 
exports.itemlist = function(db) { 
  return function(req,res) { 
    var collection = db.get('itemcollection'); 
    collection.find({},{},function(e,docs) { 
      var render_me = {'itemlist': docs};
      res.render('itemlist', render_me); 
    });
  };
};

exports.newitem = function(req,res) { 
	var render_me = {title: 'Add New Item'};
	res.render('newitem', render_me); 
};

exports.additem = function(db) { 
	return function(req, res) { 
		var userName = req.body.username; 
		var userEmail = req.body.email; 
		var userPhone = req.body.phone; 
		var itemTitle = req.body.title; 
		var itemPrice = req.body.price; 
		var isNegotiable = req.body.negotiable; 
		var itemDescription = req.body.description; 

		var collection = db.get('itemcollection'); 

		collection.insert({
			"username":userName, 
			"email":userEmail, 
			"phone":userPhone,
			"title":itemTitle, 
			"price":itemPrice, 
			"negotiable":isNegotiable,
			"description":itemDescription,
			"created_at": new Date(), 
			"num_wants":0
		}, function(err,doc) { 
			if (err) res.send(err); 
			else { 
				res.location('itemlist');
				res.redirect('itemlist');
			}
		});
	};
};

exports.wantitem = function(db) {
	return function(req,res) { 
	var itemId = req.body.id; 
	var itemTitle = req.body.title; 
	var render_me = {title: 'Want ' + itemTitle, itemId: itemId, itemTitle: itemTitle};
	res.render('wantitem', render_me);
	};
};

// email the seller about who wants to buy, their number, return address, any special message 
// incremement the number of wants an item has (can display on the homepage)
exports.notifyseller = function(db, smtp) {
	return function(req,res) { 
		var itemId = req.body.id; 
		var itemTitle = req.body.title; 
		var buyerName = req.body.username; 
		var buyerNumber = req.body.phone;
		var buyerEmail = req.body.email;

		var collection = db.get('itemcollection');
		var query = {_id:itemId}; 
		var fields = {email:true, username:true, _id:false}; 
		collection.findOne(query, fields, function(err,doc) { 
			if (err) { 
				console.log("error finding item"); 
				res.send(err); 
			} else { 
				var sellerEmail = doc.email; 
				var sellerName = doc.username; 
				var messageBody = "Hi " + sellerName + ",\n\nI'm interested in purchasing your item: " + itemTitle + ". To further discuss this, you can contact me at: \nEmail:\t" + buyerEmail + "\nPhone:\t" + buyerNumber +"\n\nThanks,\n" + buyerName; 
				var mailOptions = { 
					from: buyerEmail, 
					to: sellerEmail, 
					subject: "Interested in " + itemTitle, 
					text: messageBody
				}; 
				smtp.sendMail(mailOptions, function(err, res) { 
					if(err) { 
						console.log("error sending email"); 
						res.send(err); 
					} else {
						console.log("Message sent: " + res.message); 
					}
				});
			}
		}); 

		// TODO: notify successful email? 
		res.location('itemlist');
		res.redirect('itemlist');
	}; 
}; 
