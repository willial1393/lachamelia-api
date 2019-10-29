import express = require('express');
import {Products} from "./models/products";

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

app.use(bodyParser.json())
app.use((request, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/product/', function (req, res) {
    Products.query().then(value => res.status(200).send(value))
        .catch(reason => res.status(200).send(reason))
});
app.post('/product/insert', function (request, res) {
    console.log(request.body);
    Products.query().insertAndFetch(request.body).then(value => res.status(200).send(value))
        .catch(reason => res.status(200).send(reason))
});
app.post('/product/delete', function (req, res) {
    Products.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
        .catch(reason => res.status(200).send(reason))
});
app.put('/product/update', function (req, res) {
    Products.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
        .catch(reason => res.status(200).send(reason))
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
