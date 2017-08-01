'use strict';

var fs = require('fs');
var lastInformedPath = __dirname + '/lastVichanData.json';
var readline = require('readline');
var rl;

function connect(info, callback) {

  rl.close();

  exports.connection = require('mysql').createConnection(info);

  exports.connection.query('SELECT 1', function(err, rows) {
    callback(err);
  });

}

function askDbPassword(info, callback) {

  rl.question('Inform the database password: ', function read(answer) {

    info.password = answer;

    fs.writeFileSync(lastInformedPath, JSON.stringify(info, null, 2));

    connect(info, callback);

  });

}

function askDbUser(info, callback) {

  rl.question('Inform the database user: ', function read(answer) {

    info.user = answer.trim();

    askDbPassword(info, callback);

  });

}

function askDbDb(info, callback) {

  rl.question('Inform the database being used on the Kusaba database: ',
      function read(answer) {

        info.database = answer.trim();

        askDbUser(info, callback);

      });

}

function askDbPort(info, callback) {

  rl.question('Inform the port of Kusaba database(Defaults to 3306): ',
      function read(answer) {

        answer = answer.trim();

        if (!answer.length) {
          answer = '3306';
        }

        info.port = +answer;

        askDbDb(info, callback);

      });

}

function askAddress(callback) {

  var info = {};

  rl.question('Inform the address of Kusaba database: ', function read(answer) {

    info.host = answer.trim();

    askDbPort(info, callback);

  });

}

exports.init = function(callback) {

  rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
  });

  try {

    var parsedLastData = JSON.parse(fs.readFileSync(lastInformedPath));

    rl.question('Do you wish to reuse the Kusaba information? (y/n): ',
        function read(answer) {

          if (answer.trim().toLowerCase() === 'y') {
            connect(parsedLastData, callback);
          } else {
            askAddress(callback);
          }

        });

  } catch (error) {
    askAddress(callback);
  }

};

exports.close = function() {

  if (exports.connection) {
    exports.connection.destroy();
  }

};
