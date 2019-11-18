import {Roles} from "../models/roles";
import {Model} from "objection";

const express = require('express');
const router = express.Router();
const {transaction} = require('objection');
const moment = require('moment-timezone');

export class RolRouter {
    static get() {

        router.get('/getMeseros', async function (req, res) {
            try {
                const users: any = await Roles.query()
                    .where('name', 'Mesero')
                    .eager('[users.[employees]]')
                    .then(value => res.status(200).send(value))
                    .catch(reason => res.status(403).send(reason));
                res.status(200).send(users);
            } catch (err) {
                res.status(403).send(err);
            }
        });




        // Metodo para traer todos los roles
        router.get('/', function (req, res) {
            Roles.query()
                .whereNull('deleted')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para ingresar un nuevo rol
        router.post('/insert', function (req, res) {
            Roles.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para actualizar un rol
        router.put('/update', function (req, res) {
            Roles.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para eliminar suave un rol
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let rolReturn: any = await Roles.query(trx)
                        .where('id', req.body.id)
                        .first();
                    const currentDate = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    rolReturn.deleted = currentDate;

                    return (
                        await Roles.query(trx).updateAndFetchById(rolReturn.id, rolReturn)
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
