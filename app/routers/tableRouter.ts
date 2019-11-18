import {Tables} from "../models/tables";
import {Model} from "objection";
import {Orders} from "../models/orders";
import {Employees} from "../models/employees";
import {TypeTable} from "../models/typeTable";

const {transaction} = require('objection');
const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

export class TableRouter {
    static get() {

        router.get('/:id', function (req, res) {
            Tables.query()
                .findById(req.params.id)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        router.get('/status/:status', function (req, res) {
            Tables.query()
                .where('status', req.params.status)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        // Metodo para eliminar suave una tabla
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let tableReturn: any = await Tables.query(trx)
                        .where('id', req.body.id)
                        .first();
                    const currentDate = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    tableReturn.deleted = currentDate;

                    return (
                        await Tables.query(trx).updateAndFetchById(tableReturn.id, tableReturn)
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para cargar todas las mesas que no han sido eliminadas
        router.get('/', function (req, res) {
            Tables.query()
                .whereNull('deleted')
                .eager('[typeTables]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para guardar una mesa
        router.post('/insert', function (req, res) {
            Tables.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        //Metodo para actualizar una mesa
        router.put('/update', function (req, res) {
            Tables.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo que retorna la orden que no se han terminado, usando el nombre de la mesa
        router.get('/name/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const table: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();
                    const order: any = await Orders.query(trx)
                        .whereNull('total')
                        .andWhere('tableId', table.id)
                        .first()
                        .eager('[detailsOrder, employees, tables]')
                    return (
                        order
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para traer la cantidad de ordenes diarias segun el nombre de la mesa
        router.get('/quantityOrdersDairysByTable/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');

                    const tableReturn: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first()

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('tableId', tableReturn.id)
                                .count().as('length'));
                    return {status: orders.length};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        //Metodo para traer el total ganado diario segun el nombre de la mesa
        router.get('/totalPaidOrdersDairysByTable/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');

                    const tableReturn: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first()

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('tableId', tableReturn.id);

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
        // Metodo que retorna las ordenes diarias, usando el nombre de la mesa
        router.get('/getOrdersWithNameOfTable/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');

                    const table: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();

                    const order: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('tableId', table.id)
                        .eager('[employees]')
                    console.log(order);
                    return (
                        order
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        return router;
    }
}
