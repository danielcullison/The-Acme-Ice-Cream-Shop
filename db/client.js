const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/acme_ice_cream_shop');

module.exports = client;