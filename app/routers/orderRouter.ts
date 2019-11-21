import {Orders} from "../models/orders";
import {Model, transaction} from "objection";
import {Employees} from "../models/employees";
import {Tables} from "../models/tables";
import {DetailsOrder} from "../models/detailsOrder";
import {Products} from "../models/products";
import {Tariffs} from "../models/tariffs";
import {Categories} from "../models/categories";

const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

export class OrderRouter {
    static get() {
        router.get('/', function (req, res) {
            Orders.query()
                .whereNull('end')
                .eager('[tables, employees, detailsOrder.[products]]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/week', async function (req, res) {
            try {
                let currentDate = moment(new Date()).hours(23).minutes(59).seconds(59);
                const lastDate = moment(new Date()).hours(0).minutes(0).seconds(0).add(-7, "days");
                const orders: any[] = await Orders.query()
                    .whereNotNull('end')
                    .whereBetween('start', [
                        lastDate.format('YYYY-MM-DD HH:mm:ss'),
                        currentDate.format('YYYY-MM-DD HH:mm:ss')
                    ]);
                const week: any[] = [];
                for (let i = 1; i <= 7; i++) {
                    const w: any = {
                        date: currentDate.format('YYYY-MM-DD'),
                        value: 0,
                        value1: 0
                    };
                    w.value = orders
                        .filter(value => moment(value.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value.length !== 0) {
                        w.value = w.value.map(value => value.total)
                            .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
                    } else {
                        w.value = 0;
                    }
                    w.value1 = orders
                        .filter(value1 => moment(value1.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value1.length !== 0) {
                        w.value1 = w.value1.map(value1 => value1.ganancias)
                            .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
                    } else {
                        w.value1 = 0;
                    }
                    week.push(w);
                    currentDate.add(-1, "days");
                }
                res.status(200).send(week);
            } catch (e) {
                res.status(403).send(e);
            }
        });
        router.get('/month', async function (req, res) {
            try {
                let contadorProductos = 0;
                let arrayCantidad: any[] = [];
                let contadorArray = 0;
                let cant: any;
                let currentDate = moment(new Date()).hours(23).minutes(59).seconds(59);
                const lastDate = moment(new Date()).hours(0).minutes(0).seconds(0).add(-1, "months");

                const products: any = await Products.query();

                while (products[contadorProductos]) {
                    cant = await DetailsOrder.query()
                        .first()
                        .select('*',
                            DetailsOrder.query()
                                .where('productId', products[contadorProductos].id)
                                .count().as('quantity'));

                    arrayCantidad[contadorArray] = {
                        nameProduct: products[contadorProductos].name,
                        cantidad: cant.quantity
                    };
                    contadorProductos++;
                    contadorArray++;
                }
                res.status(200).send(arrayCantidad);
            } catch (e) {
                res.status(403).send(e);
            }
        });

        router.post('/delete', function (req, res) {
            Orders.query().deleteById(req.body.id).then(res.status(200).send('{"status":"deleted"}'))
                .catch(reason => res.status(403).send(reason));
        });
        router.put('/update', function (req, res) {
            Orders.query().updateAndFetchById(req.body.id, req.body).then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        // Trae la informacion de la orden segun su id
        router.get('/:id', function (req, res) {
            Orders.query()
                .findById(req.params.id)
                .eager('[tables, employees, detailsOrder]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });

        // Metodo para traer las ordenes atendidas diarias con el nombre del mesero
        router.get('/ordersDailyByNameOfWaiter/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let employee: any = await Employees.query(trx)
                        .where('name', req.params.name)
                        .first();

                    const currentDate = moment(new Date()).tz('America/Bogota');
                    const date1: string = currentDate.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    const date2: string = currentDate.add(1, "days").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date1, date2])
                        .andWhere('employeeId', employee.id)
                        .eager('[detailsOrder.[products], tables]');

                    return orders;
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(JSON.stringify(err));
            }
        });

        //Metodo para cambiar el estado de la mesa cuando se despacho el pedido, poner la duracion y la fecha de terminacion de la orden
        router.get('/name/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const getTable: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();
                    getTable.status = 'Ocupado';
                    await Tables.query(trx).updateAndFetchById(getTable.id, getTable);

                    const order: any = await Orders.query(trx)
                        .eager('[detailsOrder, employees]')
                        .first()
                        .where('tableId', getTable.id)
                        .whereNull('end');
                    order.end = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    order.duration = moment.utc(moment(order.end, "YYYY-MM-DD HH:mm:ss").diff(moment(order.start, "YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss");
                    ;
                    return (
                        Orders.query(trx).updateAndFetchById(order.id, order)
                            .then(value => res.status(200).send(value))
                            .catch(reason => res.status(403).send(reason))
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        // Metodo guardar el total de la orden y cambiar el estado de la mesa
        router.post('/payOrder', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    delete req.body.detailsOrder;

                    const orderSaved: any = await Orders.query(trx)
                        .where('id', req.body.id)
                        .first();
                    const ivaReturn: any = await Tariffs.query(trx).first()

                    orderSaved.subtotal = req.body.subtotal;
                    orderSaved.impuesto = (Number(ivaReturn.iva)/100)*(Number(req.body.subtotal));
                    orderSaved.total = Number(orderSaved.subtotal) + Number(orderSaved.impuesto);
                    orderSaved.ganancias = (Number(ivaReturn.porcentajeGanancia)/100)*(Number(req.body.subtotal));

                    await Orders.query(trx).updateAndFetchById(orderSaved.id, orderSaved);
                    const tableChanged: any = await Tables.query(trx)
                        .where('id', orderSaved.tableId)
                        .first();
                    tableChanged.status = 'Disponible';
                    await Tables.query(trx).updateAndFetchById(tableChanged.id, tableChanged);

                    return (orderSaved);
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        // Metodo para guardar la orden con sus detalles y cambiar el estado de la mesa
        router.post('/insertOrderWithDetails', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {

                    delete req.body.detailsOrder.products;
                    let contador = 0;
                    let disponibilidadProductos = true;
                    const orderFull: any = req.body;
                    let orderSaved: any;

                    while (req.body.detailsOrder[contador]) {
                        const product: any = await Products.query(trx).findById(req.body.detailsOrder[contador].productId);
                        if (product.quantity < req.body.detailsOrder[contador].quantity){
                            disponibilidadProductos = false;
                        }
                        contador++;
                    }
                    contador=0;

                    if (disponibilidadProductos === true){
                        while (req.body.detailsOrder[contador]) {
                            let product: any = await Products.query(trx).findById(req.body.detailsOrder[contador].productId);
                            let restaCantidad = Number(product.quantity) - Number(req.body.detailsOrder[contador].quantity);
                            product.quantity = restaCantidad;
                            await Products.query(trx).updateAndFetchById(product.id, product)
                            contador++;
                        }
                        contador = 0;


                        orderSaved = await Orders.query(trx)
                            .insertAndFetch(orderFull);
                        while (req.body.detailsOrder[contador]) {
                            req.body.detailsOrder[contador].orderId = orderSaved.id;
                            delete req.body.detailsOrder[contador].products;
                            const product: any = await Products.query(trx)
                                .where('id', req.body.detailsOrder[contador].productId)
                                .first();
                            req.body.detailsOrder[contador].price = product.price * req.body.detailsOrder[contador].quantity;
                            let detailOr = await DetailsOrder.query(trx)
                                .insertAndFetch(req.body.detailsOrder[contador]);
                            contador++;
                        }
                        let table: any = await Tables.query(trx)
                            .where('id', orderSaved.tableId)
                            .first();
                        table.status = 'En cocina';
                        await Tables.query(trx).updateAndFetchById(table.id, table);
                    } else{
                        orderSaved = null;
                    }
                    return (orderSaved);
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        //Metodo para regresar la cantidad de mesas atendidas por el id del mesero en una semana
        router.get('/getOrdersByEmployeeInWeek/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "weeks").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('employeeId', req.params.employeeId)
                                .count().as('length'));
                    return {status: orders.length};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        //Metodo para regresar la cantidad de mesas atendidas por el id del mesero en una mes
        router.get('/getOrdersByEmployeeInMonth/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "months").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('employeeId', req.params.employeeId)
                                .count().as('length'));
                    return {status: orders.length};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        //Metodo para regresar las ganancias totales de las ordenes por mesero en una semana
        router.get('/getCostOfOrdersByEmployeeInWeek/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "weeks").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('employeeId', req.params.employeeId);

                    while (orders[contador]) {
                        total = Number(total) + Number(orders[contador].subtotal);
                        contador++;
                    }
                    return {total};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });

        //Metodo para regresar las ganancias totales de las ordenes por mesero en un mes
        router.get('/getCostOfOrdersByEmployeeInMonth/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    date1 = currentDate1.add(23, "hours").add(59, "minutes").format('YYYY-MM-DD HH:mm:ss');
                    date2 = currentDate2.add(-1, "months").format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('employeeId', req.params.employeeId);

                    while (orders[contador]) {
                        total = Number(total) + Number(orders[contador].subtotal);
                        contador++;
                    }
                    return {total};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        return router;
    }
}
