import {Tables} from "../models/tables";
import {Model} from "objection";
import {Orders} from "../models/orders";
import {Employees} from "../models/employees";

const {transaction} = require('objection');

const express = require('express');
const router = express.Router();

export class TableRouter {
    static get() {
        router.get('/', function (req, res) {
            Tables.query()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
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
        router.post('/insert', function (req, res) {
            Tables.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            Tables.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Tables.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        // Metodo que retorna la orden que nos e ha terminado, usando el nombre de la mesa
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
                        .eager('[detailsOrder, employees]')
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
                    const table: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();

                    var currentDate = new Date();
                    var modifyDate = new Date();
                    modifyDate.setDate((currentDate.getDate())-1);
                    var pastDate = modifyDate;

                    const orders: any = Orders.query(trx)
                        .whereBetween('start', [pastDate, currentDate])
                        .andWhere('tableId', table.id)
                        .count()
                        .first()
                        .then(value => res.status(200).send(value))
                        .catch(reason => res.status(403).send(reason));

                    return (orders);
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
                    const table: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();

                    var currentDate = new Date();
                    var modifyDate = new Date();
                    modifyDate.setDate((currentDate.getDate())-1);
                    var pastDate = modifyDate;

                    const orders: any = Orders.query(trx)
                        .whereBetween('start', [pastDate, currentDate])
                        .andWhere('tableId', table.id)
                        .sum('total')
                        .first()
                        .then(value => res.status(200).send(value))
                        .catch(reason => res.status(403).send(reason));

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
