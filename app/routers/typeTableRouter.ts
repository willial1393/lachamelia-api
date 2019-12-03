import {TypeTable} from "../models/typeTable";
import {Model} from "objection";

const express = require('express');
const router = express.Router();
const {transaction} = require('objection');
const moment = require('moment-timezone');

export class TypeTableRouter {
    static get() {

        // Metodo para traer los tipos de mesas, con las mesas y sus ordenes
        router.get('/table', function (req, res) {
            TypeTable.query()
                .whereNull('deleted')
                .eager('[tables.[orders]]')
                .modifyEager('tables', builder => {
                    builder.whereNull('deleted');
                })
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para traer todas las tipos de mesas no eliminadas
        router.get('/', function (req, res) {
            TypeTable.query()
                .whereNull('deleted')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para agregar un nuevo tipo de mesa
        router.post('/insert', function (req, res) {
            TypeTable.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para actualizar un nuevo tipo de mesa
        router.put('/update', function (req, res) {
            TypeTable.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // MEtodo para eliminar suave un tipo de mesa
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let typeTableReturn: any = await TypeTable.query(trx)
                        .where('id', req.body.id)
                        .first();
                    typeTableReturn.deleted = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

                    return (
                        await TypeTable.query(trx).updateAndFetchById(typeTableReturn.id, typeTableReturn)
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
