"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var products_1 = require("./models/products");
var bodyParser = require('body-parser');
var Model = require('objection').Model;
var Knex = require('knex');
var knex = Knex({
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'lachamelia'
    }
});
Model.knex(knex);
var app = express();
app.use(bodyParser.json());
app.use(function (request, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.get('/product/', function (req, res) {
    products_1.Products.query().then(function (value) { return res.status(200).send(value); })
        .catch(function (reason) { return res.status(200).send(reason); });
});
app.post('/product/insert', function (request, res) {
    console.log(request.body);
    products_1.Products.query().insertAndFetch(request.body).then(function (value) { return res.status(200).send(value); })
        .catch(function (reason) { return res.status(200).send(reason); });
});
app.post('/product/delete', function (req, res) {
    products_1.Products.query().deleteById(req.body.id).then(function (value) { return res.status(200).send('{"status":"deleted"}'); })
        .catch(function (reason) { return res.status(200).send(reason); });
});
app.put('/product/update', function (req, res) {
    products_1.Products.query().updateAndFetchById(req.body.id, req.body).then(function (value) { return res.status(200).send(value); })
        .catch(function (reason) { return res.status(200).send(reason); });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=app.js.map