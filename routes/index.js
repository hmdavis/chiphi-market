
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