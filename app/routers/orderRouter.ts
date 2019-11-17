import {Orders} from "../models/orders";
import {Model, transaction} from "objection";
import {Employees} from "../models/employees";
import {Tables} from "../models/tables";
import {Users} from "../models/users";
import {DetailsOrder} from "../models/detailsOrder";
import {Products} from "../models/products";

const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

export class OrderRouter {
    static get() {
        router.get('/', function (req, res) {
            Orders.query()
                .whereNull('end')
                .eager('[tables, employees, detailsOrder.[products]]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/:id', function (req, res) {
            Orders.query()
                .findById(req.params.id)
                .eager('[tables, employees, detailsOrder]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            Orders.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Orders.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        // Metodo para traer las ordenes atendidas diarias con el nombre del mesero
        router.get('/ordersDailyByNameOfWaiter/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let employee: any = await Employees.query(trx)
                        .where('name', req.params.name)
                        .first();

                    const currentDate = moment(new Date()).tz('America/Bogota');
                    const date1: string = currentDate.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    const date2: string = currentDate.add(1, "days").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date1, date2])
                        .andWhere('employeeId', employee.id)
                        .eager('[detailsOrder.[products], tables]');

                    return orders;
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });
        //Metodo para cambiar el estado de la mesa cuando se despacho el pedido
        router.get('/name/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const getTable: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();
                    getTable.status = 'Ocupado';
                    await Tables.query(trx).updateAndFetchById(getTable.id, getTable)

                    const order: any = await Orders.query(trx)
                        .eager('[detailsOrder, employees]')
                        .first()
                        .where('tableId', getTable.id)
                        .whereNull('end');
                    order.end = new Date();

                    return (
                        await Orders.query(trx).updateAndFetchById(order.id, order)
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });


        // Metodo guardar el total de la orden y cambiar el estado de la mesa
        router.post('/payOrder', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    delete req.body.detailsOrder;

                    const orderSaved: any = await Orders.query(trx)
                        .where('id', req.body.id)
                        .first()
                    orderSaved.total = req.body.total;
                    await Orders.query(trx).updateAndFetchById(orderSaved.id, orderSaved)
                    const tableChanged: any = await Tables.query(trx)
                        .where('id', orderSaved.tableId)
                        .first()
                    tableChanged.status = 'Disponible';
                    await Tables.query(trx).updateAndFetchById(tableChanged.id, tableChanged)

                    return (orderSaved);
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        // Metodo para guardar la orden con sus detalles y cambiar el estado de la mesa
        router.post('/insertOrderWithDetails', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {

                    let contador = 0;
                    const orderFull: Orders = req.body
                    delete req.body.detailsOrder.products;

                    const orderSaved: any = await Orders.query(trx)
                        .insertAndFetch(orderFull);


                    while (req.body.detailsOrder[contador]){
                        req.body.detailsOrder[contador].orderId = orderSaved.id;
                        delete req.body.detailsOrder[contador].products;
                        const product: any = await Products.query(trx)
                            .where('id', req.body.detailsOrder[contador].productId)
                            .first();
                        const precioDetalle = product.price * req.body.detailsOrder[contador].quantity;
                        req.body.detailsOrder[contador].price = precioDetalle
                        await DetailsOrder.query(trx)
                            .insertAndFetch(req.body.detailsOrder[contador]);
                        contador++;
                    }

                    let table: any = await Tables.query(trx)
                        .where('id', orderSaved.tableId)
                        .first();
                    table.status = 'En cocina';
                    await Tables.query(trx).updateAndFetchById(table.id, table)
                    return (orderSaved);
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para regresar la cantidad de mesas atendidas por el id del mesero en una semana
        router.get('/getOrdersByEmployeeInWeek/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "weeks").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('employeeId', req.params.employeeId)
                                .count().as('length'));
                    return {status: orders.length};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para regresar la cantidad de mesas atendidas por el id del mesero en una mes
        router.get('/getOrdersByEmployeeInMonth/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "months").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('employeeId', req.params.employeeId)
                                .count().as('length'));
                    return {status: orders.length};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para regresar las ganancias totales de las ordenes por mesero en una semana
        router.get('/getCostOfOrdersByEmployeeInWeek/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "weeks").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('employeeId', req.params.employeeId);

                    while (orders[contador]) {
                        total = Number(total) + Number(orders[contador].total);
                        contador++;
                    }
                    return {total};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para regresar las ganancias totales de las ordenes por mesero en un mes
        router.get('/getCostOfOrdersByEmployeeInMonth/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "months").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('employeeId', req.params.employeeId);

                    while (orders[contador]) {
                        total = Number(total) + Number(orders[contador].total);
                        contador++;
                    }
                    return {total};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        return router;
    }
}
