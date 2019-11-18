import {Products} from "../models/products";
import {Model, transaction} from "objection";

const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

export class ProductRouter {
    static get() {
        router.get('/:id', function (req, res) {
            Products.query()
                .findById(req.params.id)
                .eager('[categories]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        // Metodo para traer los productos no eliminados
        router.get('/', function (req, res) {
            Products.query()
                .whereNull('deleted')
                .eager('[categories]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para guardar un producto
        router.post('/insert', function (req, res) {
            Products.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para actualizar un producto
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let product: any = await Products.query(trx)
                        .where('id', req.body.id)
                        .first();

                    const currentDate = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    product.deleted = currentDate;

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
        // Metodo para eliminar suave un producto
        router.put('/update', function (req, res) {
            Products.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
