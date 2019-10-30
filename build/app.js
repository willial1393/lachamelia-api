"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var productRouter_1 = require("./routers/productRouter");
var categoryRouter_1 = require("./routers/categoryRouter");
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
app.use('/product', productRouter_1.ProductRouter.get());
app.use('/category', categoryRouter_1.CategoryRouter.get());
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=app.js.map