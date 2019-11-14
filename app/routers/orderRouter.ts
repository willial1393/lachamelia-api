import {Orders} from "../models/orders";
import {Model, transaction} from "objection";
import {Users} from "../models/users";
import {Employees} from "../models/employees";
import {Tables} from "../models/tables";

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
        return router;
    }
}
