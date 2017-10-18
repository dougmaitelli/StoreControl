angular.module('storecontrol').factory('DbService', () => {
  const dbPath = process.env.APPDATA + '/storecontrol/';

  const Datastore = require('nedb');

  const oDatabaseService = {
    db: []
  };

  oDatabaseService.getDb = function (collectionName) {
    if (!oDatabaseService.db[collectionName]) {
      oDatabaseService.db[collectionName] = new Datastore({filename: dbPath + collectionName + '.db', autoload: true});
    }

    return oDatabaseService.db[collectionName];
  };

  oDatabaseService.getCollection = function (collectionName) {
    return this.getDb(collectionName);
  };

  return oDatabaseService;
});
