angular.module('storecontrol').factory('DbService', function() {

    var dbPath = process.env.APPDATA + '/storecontrol';
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

	oDatabaseService.getCustomerCollection = function() {
      return this.getDb().collection("customer");
	};

  oDatabaseService.getProductCollection = function() {
      return this.getDb().collection("product");
	};

	return oDatabaseService;
});
