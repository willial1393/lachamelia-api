import {Model} from "objection";
import {Tariffs} from "../models/tariffs";
const express = require('express');
const router = express.Router();

export class TariffRouter {
    static get() {
        router.get('/', function (req, res) {
            Tariffs.query()
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Tariffs.query().updateAndFetchById(req.body.id, req.body)
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        return router;
    }
}
