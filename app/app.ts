import express = require('express');
import {ProductRouter} from "./routers/productRouter";
import {CategoryRouter} from "./routers/categoryRouter";
import {UserRouter} from "./routers/userRouter";
import {EmployeeRouter} from "./routers/employeeRouter";
import {DetailOrderRouter} from "./routers/detailOrderRouter";
import {TableRouter} from "./routers/tableRouter";
import {OrderRouter} from "./routers/orderRouter";
import {RolRouter} from "./routers/rolRouter";

const bodyParser = require('body-parser');
const {Model} = require('objection');
const Knex = require('knex');
const knex = Knex({
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
        host: '3.133.54.94',
        user: 'root',
        port: '3307',
        password: 'csH6jG8W5cvPWVT',
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
app.use('/table', TableRouter.get());
app.use('/order', OrderRouter.get());
app.use('/detailOrder', DetailOrderRouter.get());
app.use('/product', ProductRouter.get());
app.use('/category', CategoryRouter.get());
app.use('/user', UserRouter.get());
app.use('/employee', EmployeeRouter.get());
app.use('/rol', RolRouter.get());

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});
