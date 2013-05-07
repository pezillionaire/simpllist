var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('simpllistdemo', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'simpllistdemo' database");
        db.collection('lists', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'simpllistdemo' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving lists: ' + id);
    db.collection('lists', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('lists', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addList = function(req, res) {
    var list = req.body;
    console.log('Adding list: ' + JSON.stringify(list));
    db.collection('lists', function(err, collection) {
        collection.insert(list, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateList = function(req, res) {
    var id = req.params.id;
    var list = req.body;
    console.log('Updating list: ' + id);
    console.log(JSON.stringify(list));
    db.collection('lists', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, list, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating list: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(list);
            }
        });
    });
}
 
exports.deleteList = function(req, res) {
    var id = req.params.id;
    console.log('Deleting list: ' + id);
    db.collection('lists', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function() {
 
    var lists = [
    {
        name: "my first list",
        createdBy: "Pez",
        dateCreated: "01/01/2013",
        dateModified: "04/22/2013",
        content: "this is temporary content"
    },
    {
        name: "my second list",
        createdBy: "Pez",
        dateCreated: "02/10/2013",
        dateModified: "05/06/2013",
        content: "this is temporary content"
    }];
 
    db.collection('lists', function(err, collection) {
        collection.insert(lists, {safe:true}, function(err, result) {});
    });
 
};