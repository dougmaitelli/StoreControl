angular.module('storecontrol').factory('DbService', function() {

  var dbPath = process.env.APPDATA + '/storecontrol/';

  var Datastore = require('nedb');

  var oDatabaseService = {
    db: []
  };

  oDatabaseService.getDb = function(collectionName) {
    if (!oDatabaseService.db[collectionName]) {
      oDatabaseService.db[collectionName] = new Datastore({filename: dbPath + collectionName + '.db',  autoload: true});
    }

    return oDatabaseService.db[collectionName];
  };

  oDatabaseService.getCollection = function(collectionName) {
      return this.getDb(collectionName);
  };

  return oDatabaseService;
});
