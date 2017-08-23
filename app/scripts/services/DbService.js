angular.module('tadanan').factory('DbService', function() {

    var dbPath = process.env.APPDATA + '/tadanan';
    //var dbPath = 'data';

	var fs = require('fs');
	var Engine = require('tingodb')();

	var oDatabaseService = {
	  db: null
	};

	oDatabaseService.getDb = function() {
      if (!oDatabaseService.db) {
        try {
          fs.accessSync(dbPath, fs.F_OK);
	    } catch (e) {
	      fs.mkdirSync(dbPath);
	    }

        oDatabaseService.db = new Engine.Db(dbPath, {});
      }

      return oDatabaseService.db;
	};

	oDatabaseService.getQuestionnaireCollection = function() {
      return this.getDb().collection("questionnaire");
	};

	return oDatabaseService;
});
