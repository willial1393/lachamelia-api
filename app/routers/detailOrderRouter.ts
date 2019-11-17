import {DetailsOrder} from "../models/detailsOrder";
import {Products} from "../models/products";
import {Categories} from "../models/categories";
import {Model, transaction} from "objection";
import {Employees} from "../models/employees";
import {Orders} from "../models/orders";

const express = require('express');
const router = express.Router();

export class DetailOrderRouter {
    static get() {
        router.get('/', function (req, res) {
            DetailsOrder.query()
                .eager('[products]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/insert', function (req, res) {
            DetailsOrder.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            DetailsOrder.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            DetailsOrder.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });


        // Metodo para traer todos los detalles con sus productos segun el id de la orden
        router.get('/byOrderId/:orderId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {

                    const orderReturn: any = await  Orders.query(trx)
                        .whereNull('total')
                        .andWhere('id', req.params.orderId)
                        .first();
                    return (DetailsOrder.query(trx)
                        .where('orderId', orderReturn.id)
                        .eager('[products]')
                        .then(value => res.status(200).send(value))
                        .catch(reason => res.status(403).send(reason)))

                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }


        });
        return router;
    }
}
