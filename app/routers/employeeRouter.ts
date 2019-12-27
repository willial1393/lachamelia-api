import {Employees} from "../models/employees";
import {Model} from "objection";
import {Users} from "../models/users";

const {transaction} = require('objection');
const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

export class EmployeeRouter {
    static get() {
        router.get('/waiters', function (req, res) {
            Employees.query()
                .whereNull('deleted')
                .eager('[users.[roles]]')
                .modifyEager('users.roles', builder => {
                    builder.where('name', 'Mesero')
                })
                .then((value: any[]) => {
                    value = value.filter(value1 => value1.users.roles !== null);
                    res.status(200).send(value);
                })
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/email/:email', function (req, res) {
            Employees.query()
                .where('email', req.params.email)
                .eager('[users]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/idUsers/:users_idUsers', function (req, res) {
            Employees.query()
                .where('users_idUsers', req.params.users_idUsers)
                .eager('[users]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/insert', function (req, res) {
            Employees.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });


        //REVISIÓN DE METODOS QUE ESTAN SIENDO USADOS
        // Metodo para traer todos los usuarios que no han sido eliminados
        router.get('/', function (req, res) {
            Employees.query()
                .whereNull('deleted')
                .eager('[users.[roles]]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para traer la informacion del empleado con su nombre
        router.get('/nameWaiter/:name', async function (req, res) {
            await Employees.query()
                .whereNull('deleted')
                .where('name', req.params.name)
                .first()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // Metodo para actualizar el empleado
        router.put('/update',  async function(req, res) {
            await bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    try {
                        const trans = await transaction(Model.knex(), async (trx) => {
                            if (req.body.users.password !== req.body.password) {
                                req.body.users.password = hash;
                                await Users.query(trx).updateAndFetchById(req.body.users.id, req.body.users);
                            }
                            delete req.body.users;
                            delete req.body.password;
                            const employeeUpdated: any = await Employees.query(trx).updateAndFetchById(req.body.id, req.body);
                            return (employeeUpdated);
                        });
                        res.status(200).send(trans);
                    } catch (err) {
                        res.status(403).send(err);
                    }
                });
            });
        });
        // Metodo para eliminación suave del empleado
        router.post('/delete', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let employeeReturn: any = await Employees.query(trx)
                        .where('id', req.body.id)
                        .first();
                    const currentDate = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    employeeReturn.deleted = currentDate;

                    let userReturn: any = await Users.query(trx)
                        .where('id', employeeReturn.userId)
                        .first();
                    userReturn.deleted = currentDate;
                    await Users.query(trx).updateAndFetchById(userReturn.id, userReturn)
                    return (
                        await Employees.query(trx).updateAndFetchById(employeeReturn.id, employeeReturn)
                );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.get('/id/:id', function (req, res) {
            Employees.query()
                .findById(req.params.id)
                .whereNull('deleted')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
