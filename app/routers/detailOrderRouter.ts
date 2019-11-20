import {DetailsOrder} from "../models/detailsOrder";
import {Products} from "../models/products";
import {Categories} from "../models/categories";
import {Model, transaction} from "objection";
import {Employees} from "../models/employees";
import {Orders} from "../models/orders";
import {TypeTable} from "../models/typeTable";

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
                    delete req.body.products
                    const productReturn: any = await  Products.query(trx)
                        .where('id', req.body.productId)
                        .first();
                    req.body.price = (productReturn.price * req.body.quantity);
                    return (
                        DetailsOrder.query(trx).insertAndFetch(req.body)
                    )
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });
        router.post('/delete', function (req, res) {
            DetailsOrder.query().deleteById(req.body.id)
                .then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });


        // Metodo para modificar el pedido ya realizado desde la vista de mesas
        router.put('/update', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const detailOrderReturn: any = await  DetailsOrder.query(trx)
                        .where('id', req.body.id)
                        .first();
                    delete  req.body.products;
                    const productReturn: any = await  Products.query(trx)
                        .where('id', req.body.productId)
                        .first();
                    req.body.price = (productReturn.price * req.body.quantity);
                    console.log(req.body);
                    return (
                        DetailsOrder.query(trx).updateAndFetchById(req.body.id, req.body)
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
                        .eager('[products]')
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
