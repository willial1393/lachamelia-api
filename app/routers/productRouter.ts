import {Products} from "../models/products";
import {Model, transaction} from "objection";

const express = require('express');
const router = express.Router();

export class ProductRouter {
    static get() {
        router.get('/', function (req, res) {
            Products.query()
                .whereNull('deleted')
                .eager('[categories]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/:id', function (req, res) {
            Products.query()
                .findById(req.params.id)
                .eager('[categories]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/insert', function (req, res) {
            Products.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let product: any = await Products.query(trx)
                        .where('id', req.body.id)
                        .first();
                    product.deleted = new Date();
                    return (
                        Products.query().updateAndFetchById(product.id, product).then(value => res.status(200).send(value))
                            .catch(reason => res.status(403).send(reason))
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.put('/update', function (req, res) {
            Products.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
