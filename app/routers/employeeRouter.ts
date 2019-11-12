import {Employees} from "../models/employees";

const express = require('express');
const router = express.Router();

export class EmployeeRouter {
    static get() {
        router.get('/', function (req, res) {
            Employees.query()
                .eager('[users.[roles]]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/:id', function (req, res) {
            Employees.query()
                .findById(req.params.id)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/name/:name', function (req, res) {
            Employees.query()
                .where('name', req.params.name)
                .eager('[orders]')
                .then(value => res.status(200).send(value))
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
        router.post('/delete', function (req, res) {
            Employees.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Employees.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
