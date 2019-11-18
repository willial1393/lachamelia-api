import {Categories} from "../models/categories";
import {Model} from "objection";
import {Roles} from "../models/roles";

const express = require('express');
const router = express.Router();
const {transaction} = require('objection');
const moment = require('moment-timezone');

export class CategoryRouter {
    static get() {
        // Metodo para traer las cateforias y sus productos para la vistas de ordenes
        router.get('/prod', function (req, res) {
            Categories.query()
                .whereNull('deleted')
                .eager('[products]')
                .modifyEager('products', builder => {
                    builder.whereNull('deleted');
                })
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        router.get('/price/:price', function (req, res) {
            Categories.query()
                .eager('[products]')
                .modifyEager('products', builder => {
                    builder.where('price', '<=', req.params.price);
                })
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/:id', function (req, res) {
            Categories.query()
                .findById(req.params.id)
                .eager('[products]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/name/:name', function (req, res) {
            Categories.query()
                .where('name', req.params.name)
                .eager('[products]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });



        // Metodo para trer todas las categorias que no han sido eliminadas
        router.get('/', function (req, res) {
            Categories.query()
                .whereNull('deleted')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para guardar una nueva categoria
        router.post('/insert', function (req, res) {
            Categories.query().insertAndFetch(req.body)
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para actualizar una categoria
        router.put('/update', function (req, res) {
            Categories.query().updateAndFetchById(req.body.id, req.body)
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para eliminar suave una categoria
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let categoryReturn: any = await Categories.query(trx)
                        .where('id', req.body.id)
                        .first();
                    const currentDate = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    categoryReturn.deleted = currentDate;

                    return (
                        await Categories.query(trx).updateAndFetchById(categoryReturn.id, categoryReturn)
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
