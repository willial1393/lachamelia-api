import {Orders} from "../models/orders";
import {Model, transaction} from "objection";
import {Employees} from "../models/employees";
import {Tables} from "../models/tables";

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
        router.post('/insert', function (req, res) {
            Orders.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
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

        // Metodo para traer la cantidad de mesas atendidas diarias con el nombre del mesero
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
                    let table: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();
                    table.status = 'Ocupado';
                    Tables.query().updateAndFetchById(table.id, table).then(value => res.status(200).send(value))
                        .catch(reason => res.status(403).send(reason))
                    let order: any = await Orders.query(trx)
                        .eager('[detailsOrder, employees]')
                        .first()
                        .where('tableId', table.id)
                        .whereNull('end');
                    order.end = new Date();
                    console.log(order);
                    return (
                        Orders.query().updateAndFetchById(order.id, order).then(value => res.status(200).send(value))
                            .catch(reason => res.status(403).send(reason))
                    );
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
                    var currentDate = new Date();
                    var modifyDate = new Date();
                    modifyDate.setDate((currentDate.getDate()) - 7);
                    var pastDate = modifyDate;

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [pastDate, currentDate])
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
                    var currentDate = new Date();
                    var modifyDate = new Date();
                    modifyDate.setMonth((currentDate.getMonth()) - 1);
                    var pastDate = modifyDate;
                    const orders: any = Orders.query(trx)
                        .whereBetween('start', [pastDate, currentDate])
                        .andWhere('employeeId', req.params.employeeId)
                        .count()
                        .first()
                        .then(value => {
                            const value1 = value.toJSON();
                            res.status(200).send(value1)
                        })
                        .catch(reason => res.status(403).send(reason));
                    console.log(pastDate);
                    return (orders);
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
                    var currentDate = new Date();
                    var modifyDate = new Date();
                    modifyDate.setDate((currentDate.getDate()) - 7);
                    var pastDate = modifyDate;

                    const orders: any = Orders.query(trx)
                        .whereBetween('start', [pastDate, currentDate])
                        .andWhere('employeeId', req.params.employeeId)
                        .sum('total')
                        .first()
                        .then(value => {
                            const value1 = value.toJSON();
                            res.status(200).send(value1)
                        })
                        .catch(reason => res.status(403).send(reason));
                    console.log(pastDate);
                    return (orders);
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
                    var currentDate = new Date();
                    var modifyDate = new Date();
                    modifyDate.setMonth((currentDate.getMonth()) - 1);
                    var pastDate = modifyDate;

                    const orders: any = Orders.query(trx)
                        .whereBetween('start', [pastDate, currentDate])
                        .andWhere('employeeId', req.params.employeeId)
                        .sum('total')
                        .first()
                        .then(value => {
                            const value1 = value.toJSON();
                            res.status(200).send(value1)
                        })
                        .catch(reason => res.status(403).send(reason));
                    console.log(pastDate);
                    return (orders);
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        return router;
    }
}
