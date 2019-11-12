import {Tables} from "../models/tables";
import {Model} from "objection";
import {Orders} from "../models/orders";

const {transaction} = require('objection');

const express = require('express');
const router = express.Router();

export class TableRouter {
    static get() {
        router.get('/', function (req, res) {
            Tables.query()
                .eager('[orders, typeTables]')
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
        //Metodo para revisar
        router.get('/name/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const table: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();
                    return (
                        await Orders.query(trx)
                            .eager('[detailsOrder, employees]')
                            .first()
                            .where('tableId', table.id)
                            .whereNull('end')
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
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
        return router;
    }
}
