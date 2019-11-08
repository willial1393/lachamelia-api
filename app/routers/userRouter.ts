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
        router.post('/register', function (req, res) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    req.body.password = hash;
                    Users.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                        .catch(reason => res.status(200).send(reason));
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
