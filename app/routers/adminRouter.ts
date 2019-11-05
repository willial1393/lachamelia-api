import {Admins} from "../models/Admins";

const express = require('express');
const router = express.Router();

export class AdminRouter {
    static get() {
        router.get('/', function (req, res) {
            Admins.query()
                .eager('[users]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/insert', function (req, res) {
            Admins.query().insertAndFetch(req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        router.post('/delete', function (req, res) {
            Admins.query().deleteById(req.body.id).then(value => res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(200).send(reason));
        });
        router.put('/update', function (req, res) {
            Admins.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(200).send(reason));
        });
        return router;
    }
}
