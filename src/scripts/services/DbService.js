const Datastore = require("nedb");

export default class DbService {
  constructor() {
    this.dbPath = "./data/";
    this.db = [];
  }

  getDb(collectionName) {
    if (!this.db[collectionName]) {
      this.db[collectionName] = new Datastore({
        filename: this.dbPath + collectionName + ".db",
        autoload: true
      });
    }

    return this.db[collectionName];
  }

  getCollection(collectionName) {
    return this.getDb(collectionName);
  }
}
