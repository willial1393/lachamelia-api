import {Roles} from "../models/roles";
import {Model} from "objection";
import {Tables} from "../models/tables";
import {Orders} from "../models/orders";

const express = require('express');
const router = express.Router();
const {transaction} = require('objection');

export class RolRouter {
    static get() {
        router.get('/', function (req, res) {
            Roles.query()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
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
        router.post('/insert', function (req, res) {
            Roles.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.post('/delete', function (req, res) {
            Roles.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Roles.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
