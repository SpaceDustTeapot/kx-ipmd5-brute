
var vichanConnection = require('./mysqlDb').connection;
var fs = require('fs');
var gstring ="";

function iterateThreads(foundThreads, callback, index) {
	console.log("in IterateThreads");
	console.log("and index is? ",index);
  index = index || 0;

  if (index >= foundThreads.length) {
	fs.writeFileSync("kusabadump.txt",gstring);
    callback();
    return;

  }

  migrateThread(foundThreads[index], function migratedThread(error) {

    if (error) {
      callback(error);
    } else {
      iterateThreads(foundThreads, callback, ++index);
    }

  });

}


exports.migrateThreads = function(callback) {
console.log("Grabing post");

  vichanConnection.query(
      'SELECT * from posts;', function(error,
          foundThreads) {

        if (error) {
		console.log(error);
          callback(error);
        } else {
          iterateThreads(foundThreads, callback);
        }

      });

};



function migrateThread(thread, callback) {

  console.log(thread.ipmd5);
  gstring = gstring + thread.ipmd5 + "\n"; 
	callback();

}
