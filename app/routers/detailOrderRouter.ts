import {DetailsOrder} from "../models/detailsOrder";
import {Products} from "../models/products";
import {Model, transaction} from "objection";
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
        router.post('/insert', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    delete req.body.products;
                    let detailReturn: any;
                    const productReturn: any = await  Products.query(trx)
                        .where('id', req.body.productId)
                        .first();
                    if (productReturn.quantity >= req.body.quantity) {
                        req.body.price = (productReturn.price * req.body.quantity);
                        req.body.cost = (productReturn.cost * req.body.quantity);
                        detailReturn = await DetailsOrder.query(trx).insertAndFetch(req.body);
                        productReturn.quantity = Number(productReturn.quantity) - Number(req.body.quantity);
                        await Products.query(trx).updateAndFetchById(productReturn.id, productReturn);
                    }
                    return (
                        detailReturn
                    )
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const productReturn: any = await  Products.query(trx)
                        .findById(req.body.productId)
                        .first();
                    productReturn.quantity = Number(productReturn.quantity) + Number(req.body.quantity);
                    await Products.query(trx).updateAndFetchById(productReturn.id, productReturn);
                    return (DetailsOrder.query(trx).deleteById(req.body.id)
                        .then(value => res.status(200).send(value))
                        .catch(reason => res.status(403).send(reason)) )
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });

        // Metodo para modificar el pedido ya realizado desde la vista de mesas
        router.put('/update', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    delete req.body.products;
                    let detailReturn: any;
                    const productReturn: any = await  Products.query(trx)
                        .where('id', req.body.productId)
                        .first();
                    const detailOrderReturn: any = await  DetailsOrder.query(trx)
                        .where('id', req.body.id)
                        .first();

                    productReturn.quantity = Number(productReturn.quantity) + Number(detailOrderReturn.quantity);
                    if (productReturn.quantity >= req.body.quantity) {
                        productReturn.quantity = Number(productReturn.quantity) - Number(req.body.quantity);
                        await Products.query(trx).updateAndFetchById(productReturn.id, productReturn);


                        req.body.price = (productReturn.price * req.body.quantity);
                        req.body.cost = (productReturn.cost * req.body.quantity);
                        detailReturn = await DetailsOrder.query(trx).updateAndFetchById(req.body.id, req.body);
                    }
                    return (
                        detailReturn
                    )
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });
        // Metodo para traer todos los detalles con sus productos segun el id de la orden
        router.get('/byOrderId/:orderId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const orderReturn: any = await  Orders.query(trx)
                        .whereNull('total')
                        .andWhere('id', req.params.orderId)
                        .first();
                    const detailsOrder: any = await DetailsOrder.query(trx)
                        .where('orderId', orderReturn.id)
                        .eager('[products]');
                    return (detailsOrder )
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });
        // Metodo para traer todos los detalles con sus productos segun el id de la orden
        router.get('/getDetailsWithOrderId/:orderId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {

                    const orderReturn: any = await  Orders.query(trx)
                        .where('id', req.params.orderId)
                        .first();
                    return (DetailsOrder.query(trx)
                        .where('orderId', orderReturn.id)
                        .eager('[products]'))
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });
        return router;
    }
}
