import express = require('express');
import {ProductRouter} from "./routers/productRouter";
import {CategoryRouter} from "./routers/categoryRouter";

const bodyParser = require('body-parser');
const {Model} = require('objection');
const Knex = require('knex');
const knex = Knex({
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
const app = express();

app.use(bodyParser.json());
app.use((request, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use('/product', ProductRouter.get());
app.use('/category', CategoryRouter.get());
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
