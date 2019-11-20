import {Tables} from "../models/tables";
import {Model} from "objection";
import {Orders} from "../models/orders";

const {transaction} = require('objection');
const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

export class TableRouter {
    static get() {
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

        //Metodo para traer todas las tabals con el total ganado en un mes
        router.get('/totalEarningsEachTable', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contadorTablas = 0;
                    let contadorOrdenes = 0;
                    let total = 0;
                    let arrayTotales = Array();
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(-1, "months").format('YYYY-MM-DD HH:mm:ss');
                    const tablesReturn: any = await  Tables.query(trx).whereNull('deleted')

                    while (tablesReturn[contadorTablas]) {
                        const orders: any = await Orders.query(trx)
                            .whereBetween('start', [date1, date2])
                            .andWhere('tableId', tablesReturn[contadorTablas].id);
                        while (orders[contadorOrdenes]){
                            total = Number(total) + Number(orders[contadorOrdenes].subtotal);
                            contadorOrdenes++;
                        }
                        arrayTotales[contadorTablas] = total;
                        contadorOrdenes = 0;
                        total = 0;
                        contadorTablas++;
                    }
                    return (
                        arrayTotales
                    )
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        router.get('/month', async function (req, res) {
            try {
                const month: any[] = [];
                let monthVar: any;
                let contadorTablas = 0;
                let contadorOrdenes = 0;
                let total = 0;
                let currentDate = moment(new Date()).hours(23).minutes(59).seconds(59);
                const lastDate = moment(new Date()).hours(0).minutes(0).seconds(0).add(-1, "months");
                const tablesReturn: any = await  Tables.query().whereNull('deleted')

                while (tablesReturn[contadorTablas]){
                    const orders: any[] = await Orders.query()
                        .andWhere('tableId', tablesReturn[contadorTablas].id)
                        .whereNotNull('end')
                        .whereBetween('start', [
                            lastDate.format('YYYY-MM-DD HH:mm:ss'),
                            currentDate.format('YYYY-MM-DD HH:mm:ss')
                        ]);
                    while (orders[contadorOrdenes]){
                        total = Number(total) + Number(orders[contadorOrdenes].subtotal);
                        contadorOrdenes++;
                    }
                    monthVar = {
                        nameTable: tablesReturn[contadorTablas].name,
                        totalTable: total
                    };
                    month.push(monthVar);
                    contadorOrdenes = 0;
                    total = 0;
                    contadorTablas++;
                }
                res.status(200).send(month);
            } catch (e) {
                res.status(403).send(e);
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
                    let subtotal = 0;
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
                        subtotal = Number(subtotal) + Number(orders[contador].subtotal);
                        contador++;
                    }
                    return {subtotal};
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
