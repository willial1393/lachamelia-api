import {Users} from "../models/users";
import {Model} from "objection";
import {Employees} from "../models/employees";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {transaction} = require('objection');

export class UserRouter {
    static get() {
        router.get('/', function (req, res) {
            Users.query()
                .eager('[roles, employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/:id', function (req, res) {
            Users.query()
                .findById(req.params.id)
                .first()
                .eager('[roles]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/role/:role', function (req, res) {
            Users.query()
                .where('role', req.params.role)
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        // router.post('/register/employee', function (req, res) {
        //     bcrypt.genSalt(saltRounds, function (err, salt) {
        //         bcrypt.hash(req.body.password, salt, async function (err, hash) {
        //             req.body.password = hash;
        //             try {
        //                 const trans = await transaction(Model.knex(), async (trx) => {
        //                     return (await Users.query(trx)
        //                         .insertGraphAndFetch(req.body));
        //                 });
        //                 res.status(200).send(trans);
        //             } catch (err) {
        //                 res.status(403).send(err);
        //             }
        //         });
        //     });
        // });


        router.post('/login/employee', function (req, res) {
            Users.query()
                .where('email', req.body.email)
                .first()
                .then((value: any) => {
                    bcrypt.compare(req.body.password, value.password).then(async value1 => {
                        if (value1) {
                            Employees.query()
                                .eager('[users.roles]')
                                .where('userId', value.id)
                                .first()
                                .then(value2 => {
                                    res.status(200).send(value2);
                                });
                        } else {
                            res.status(403).send('{"status":"error gravisimo que ni idea"}');
                        }
                    });
                })
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            Users.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {

                    const user: any = await Users.query(trx)
                        .updateAndFetchById(req.body.users.id, req.body.users);
                    delete req.body.users;
                    delete req.body.roles;
                    req.body.userId = user.id;
                    const employee: any = await Employees.query(trx)
                        .updateAndFetchById(req.body.id, req.body);

                    return (await Employees.query(trx)
                        .findById(employee.id)
                        .eager('[users.roles]'));
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });



        //Metodo para registrar el empleado con su correspondiente usuario
        router.post('/register/employee', async function (req, res) {
            console.log(req.body);
            await bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.users.password, salt, async function (err, hash) {
                    try {
                        const trans = await transaction(Model.knex(), async (trx) => {
                            req.body.users.password = hash;

                            const user: any = await Users.query(trx)
                                .insertAndFetch(req.body.users);
                            delete req.body.users;
                            delete req.body.roles;
                            req.body.userId = user.id;
                            const employee: any = await Employees.query(trx)
                                .insertAndFetch(req.body);

                            return (await Employees.query(trx)
                                .findById(employee.id)
                                .eager('[users.roles]'));
                        });
                        res.status(200).send(trans);
                    } catch (err) {
                        res.status(403).send(err);
                    }
                });
            });

        });
        return router;
    }
}
