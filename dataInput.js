'use strict';


var mysqlDb = require('./mysqlDb');
var readline = require('readline');
var fs = require('fs');
var rl;

connectMysql();


function getDirectory() {

 	console.log("AAAAAA");

      require('./ipmd5dump').migrateThreads( function migrated(error) {
        console.log(error || '\n\nMigration finished.\n\n');

        mysqlDb.close();
    });

}


function connectMysql() {

  mysqlDb.init(function(error, connection) {

    if (error) {
      console.log(error);
      connectMysql();

    } else {
	console.log("checking File exists");
	checkFile();

      getDirectory();

    }

  });

}

function checkFile()
{
	try{
		var checkIfFileExists = fs.existsSync("kusabadump.txt");
		if(!checkIfFileExists)
		{
		console.log("KusabaDump Doesn't exist");
			//create file 
			//checkIfFileExists.close();
			
			
			
		}
	
	}
	catch(e)
	{
		
	}
}

exports.getData = function() {
    
      connectMysql();

};
