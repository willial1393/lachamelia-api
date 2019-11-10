import {Categories} from "../models/categories";

const express = require('express');
const router = express.Router();

export class CategoryRouter {
    static get() {
        router.get('/', function (req, res) {
            Categories.query()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/prod', function (req, res) {
            Categories.query()
                .eager('[products]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/price/:price', function (req, res) {
            Categories.query()
                .eager('[products]')
                .modifyEager('products', builder => {
                    builder.where('price', '<=', req.params.price);
                })
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/:id', function (req, res) {
            Categories.query()
                .findById(req.params.id)
                .eager('[products]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/name/:name', function (req, res) {
            Categories.query()
                .where('name', req.params.name)
                .eager('[products]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/insert', function (req, res) {
            Categories.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/delete', function (req, res) {
            Categories.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(200).send(reason));
        });
        router.put('/update', function (req, res) {
            Categories.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
