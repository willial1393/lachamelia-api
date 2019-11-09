import {Users} from "../models/users";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const key = 's0/\/\P4$$w0rD';

export class UserRouter {
    static get() {
        router.get('/', function (req, res) {
            Users.query()
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/:id', function (req, res) {
            Users.query()
                .findById(req.params.id)
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.get('/role/:role', function (req, res) {
            Users.query()
                .where('role', req.params.role)
                .eager('[employees]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/register', function (req, req1, res) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    req.body.password = hash;

                    const { transaction } = require('objection');

                    try {
                        const scrappy = await transaction(req, req1, async (Person, Animal) => {
                            // Person and Animal inside this function are bound to a newly
                            // created transaction. The Person and Animal outside this function
                            // are not! Even if you do `require('./models/Person')` inside this
                            // function and start a query using the required `Person` it will
                            // NOT take part in the transaction. Only the actual objects passed
                            // to this function are bound to the transaction.

                            await Person
                                .query()
                                .insert({firstName: 'Jennifer', lastName: 'Lawrence'});

                            return Animal
                                .query()
                                .insert({name: 'Scrappy'});
                        });
                    } catch (err) {
                        console.log('Something went wrong. Neither Jennifer nor Scrappy were inserted');
                    }
                });
            });
        });
        router.post('/login', function (req, res) {
            Users.query()
                .where('email', req.body.email)
                .eager('[employees,clients]')
                .first()
                .then((value: any) => {
                    bcrypt.compare(req.body.password, value.password).then(value1 => {
                        if (value1) {
                            delete value.password;
                            res.status(200).send(value);
                        } else {
                            res.status(200).send('{"status":false}');
                        }
                    });
                })
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/delete', function (req, res) {
            Users.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(200).send(reason));
        });
        router.put('/update', function (req, res) {
            Users.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
