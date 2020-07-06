import faker from 'faker';

const request = indexedDB.open("offline_db", 1);
let db;

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  db = request.result;
  const store = db.createObjectStore("customers", {keyPath: "id"});

  // Create indexes
  store.createIndex("by_name", "name", {unique: false});
  store.createIndex("by_location", "location");


  for(let i = 0; i < 50; i++) {
    store.add({
      id: i,
      url: `customers/${i}`,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`, //faker.name,
      location: `${faker.address.city()}, ${faker.address.countryCode()}`,//faker.address,
      latestOrderUrl: `orders/${faker.random.number()}`
    });
  }
};

request.onsuccess = function() {
  db = request.result;
};

request.onblocked = function(event) {
  // If some other tab is loaded with the database, then it needs to be closed
  // before we can proceed.
  alert("Please close all other tabs with this site open!");
};

