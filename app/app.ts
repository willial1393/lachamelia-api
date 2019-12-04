import express = require('express');
import {ProductRouter} from "./routers/productRouter";
import {CategoryRouter} from "./routers/categoryRouter";
import {UserRouter} from "./routers/userRouter";
import {EmployeeRouter} from "./routers/employeeRouter";
import {DetailOrderRouter} from "./routers/detailOrderRouter";
import {TableRouter} from "./routers/tableRouter";
import {OrderRouter} from "./routers/orderRouter";
import {RolRouter} from "./routers/rolRouter";
import {TypeTableRouter} from "./routers/typeTableRouter";
import {TariffRouter} from "./routers/tariffRouter";

require('dotenv').config();
const bodyParser = require('body-parser');
const {Model} = require('objection');
const Knex = require('knex');
const knex = Knex({
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
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
app.use('/typeTable', TypeTableRouter.get());
app.use('/tariff', TariffRouter.get());

app.listen(process.env.PORT, function () {
    console.log('listen on http://localhost:' + process.env.PORT);
});
