import {Orders} from "../models/orders";
import {Model, transaction} from "objection";
import {Employees} from "../models/employees";
import {Tables} from "../models/tables";
import {DetailsOrder} from "../models/detailsOrder";
import {Products} from "../models/products";

const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

export class OrderRouter {
    static get() {
        router.get('/', function (req, res) {
            Orders.query()
                .whereNull('end')
                .eager('[tables, employees, detailsOrder.[products.[categories]]]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
        router.get('/week', async function (req, res) {
            try {
                let currentDate = moment(new Date()).tz('America/Bogota').hours(23).minutes(59).seconds(59);
                const lastDate = moment(new Date()).tz('America/Bogota').hours(0).minutes(0).seconds(0).add(-7, "days");
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
                        value1: 0,
                        value2: 0,
                        value3: 0,
                        value4: 0,
                        value5: 0,
                    };
                    w.value = orders
                        .filter(value => moment(value.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value.length !== 0) {
                        w.value = w.value.map(value => value.cost)
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

                    w.value2 = orders
                        .filter(value2 => moment(value2.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value2.length !== 0) {
                        w.value2 = w.value2.map(value2 => value2.total)
                            .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
                    } else {
                        w.value2 = 0;
                    }

                    w.value3 = orders
                        .filter(value3 => moment(value3.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value3.length !== 0) {
                        w.value3 = w.value3.map(value3 => value3.totalService)
                            .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
                    } else {
                        w.value3 = 0;
                    }

                    w.value4 = orders
                        .filter(value4 => moment(value4.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value4.length !== 0) {
                        w.value4 = w.value4.map(value4 => value4.descuento)
                            .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
                    } else {
                        w.value4 = 0;
                    }

                    w.value5 = orders
                        .filter(value5 => moment(value5.start, 'YYYY-MM-DD').isSame(currentDate.format('YYYY-MM-DD')));
                    if (w.value5.length !== 0) {
                        w.value5 = w.value5.map(value5 => value5.subtotal)
                            .reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue));
                    } else {
                        w.value5 = 0;
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
                const currentDate = moment(new Date()).tz('America/Bogota').hours(23).minutes(59).seconds(59);
                const lastDate = moment(new Date()).tz('America/Bogota').day(0).hours(0).minutes(0).seconds(0).add(-1, "months");


                const products = (await Model.raw(`
                            SELECT d.productId, p.name, COUNT(*) as total, SUM(p.price) as price, SUM(p.cost) as cost
                            FROM detailsorder d, products p, orders o
                            WHERE d.orderId = o.id
                            AND d.productId  = p.id
                            AND o.\`start\` >= '${lastDate.format('YYYY-MM-DD HH:mm:ss')}'  
                            AND o.\`start\` <= '${currentDate.format('YYYY-MM-DD HH:mm:ss')}'
                            GROUP BY d.productId
                            `))[0];
                // .orderBy('quantity', 'desc');
                res.status(200).send(products);
            } catch (e) {
                if (e instanceof Error) {
                    e = e.message;
                }
                res.status(403).send(e);
            }
        });
        router.post('/monthByRange', async function (req, res) {
            try {
                const currentDate = req.body.dateEndSearch;
                const lastDate = req.body.dateStartSearch;

                const products = (await Model.raw(`
                            SELECT d.productId, p.name, COUNT(*) as total, SUM(p.price) as price, SUM(p.cost) as cost
                            FROM detailsorder d, products p, orders o
                            WHERE d.orderId = o.id
                            AND d.productId  = p.id
                            AND o.\`start\` >= '${lastDate}'  
                            AND o.\`start\` <= '${currentDate}'
                            GROUP BY d.productId
                            `))[0];
                res.status(200).send(products);
            } catch (e) {
                if (e instanceof Error) {
                    e = e.message;
                }
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
        router.post('/changeStatusDetail', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let detailOrderSaved: any = await DetailsOrder.query(trx)
                        .where('id', req.body.idDetailOrder)
                        .first();

                    if (req.body.status === 'Cancelado') {
                        let productReturn: any = await Products.query(trx)
                            .where('id', detailOrderSaved.productId)
                            .first();
                        productReturn.quantity = Number(productReturn.quantity) + Number(detailOrderSaved.quantity);
                        await Products.query(trx).updateAndFetchById(productReturn.id, productReturn);
                    }

                    detailOrderSaved.status = req.body.status;
                    detailOrderSaved = await DetailsOrder.query(trx).updateAndFetchById(detailOrderSaved.id, detailOrderSaved);
                    return (detailOrderSaved)
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.get('/getCostOfOrdersInDayAllWaiters', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1]);

                    while (orders[contador]) {
                        total = Number(total) + Number(orders[contador].totalService);
                        contador++;
                    }
                    const infoDay= {
                        total,
                        cantOrders: orders.length
                    };

                    return {infoDay};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.get('/:id', function (req, res) {
            Orders.query()
                .findById(req.params.id)
                .eager('[tables, employees, detailsOrder]')
                .then(value => res.status(200).send(value))
                .catch(reason => res.status(403).send(reason));
        });
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
        router.get('/name/:name', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const getTable: any = await Tables.query(trx)
                        .where('name', req.params.name)
                        .first();
                    getTable.status = 'Ocupado';
                    await Tables.query(trx).updateAndFetchById(getTable.id, getTable);

                    return (
                        await Orders.query(trx)
                            .first()
                            .where('tableId', getTable.id)
                            .whereNull('end')
                    );
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.post('/payOrder', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    delete req.body.detailsOrder;

                    let orderSaved: any = await Orders.query(trx)
                        .where('id', req.body.id)
                        .first();
                    // const ivaReturn: any = await Tariffs.query(trx).first();
                    orderSaved.end = moment(new Date()).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
                    orderSaved.duration = moment.utc(moment(orderSaved.end, "YYYY-MM-DD HH:mm:ss").diff(moment(orderSaved.start, "YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss");

                    orderSaved.subtotal = req.body.subtotal;
                    orderSaved.totalService = req.body.totalService;
                    orderSaved.impuesto = req.body.tax;

                    orderSaved.cost = req.body.cost;
                    orderSaved.descuento = Number(req.body.descuento);
                    orderSaved.ganancias = Number(orderSaved.subtotal) - Number(orderSaved.cost) - Number(orderSaved.descuento) - Number(orderSaved.totalService) - Number(orderSaved.impuesto);
                    orderSaved.total = Number(orderSaved.subtotal) - Number(orderSaved.descuento) + Number(orderSaved.totalService) + Number(orderSaved.impuesto);

                    //orderSaved.impuesto = (Number(ivaReturn.iva)/100)*(Number(req.body.subtotal));
                    //orderSaved.total = Number(orderSaved.subtotal) + Number(orderSaved.impuesto);

                    orderSaved = await Orders.query(trx)
                        .eager('[detailsOrder.[products], employees, tables]')
                        .updateAndFetchById(orderSaved.id, orderSaved);
                    const tableChanged: any = await Tables.query(trx)
                        .where('id', orderSaved.tableId)
                        .first();
                    tableChanged.status = 'Disponible';
                    await Tables.query(trx).updateAndFetchById(tableChanged.id, tableChanged);
                    return (orderSaved)
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.post('/cancelOrder', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {

                    req.body.tables.status = 'Disponible';
                    const tableReturn = await Tables.query(trx).updateAndFetchById(req.body.tables.id, req.body.tables);

                    for (let i = 0; i < req.body.detailsOrder.length; i++) {
                        let productReturn: any = await Products.query(trx)
                            .findById(req.body.detailsOrder[i].productId);

                        productReturn.quantity = productReturn.quantity + req.body.detailsOrder[i].quantity;
                        await Products.query(trx).updateAndFetchById(productReturn.id, productReturn);

                        await DetailsOrder.query(trx).deleteById(req.body.detailsOrder[i].id);
                    }
                    await Orders.query(trx).deleteById(req.body.id);
                    return (tableReturn)
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.post('/prepareOrder', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    req.body.tables.status = 'Ocupado';
                    const tableReturn = await Tables.query(trx).updateAndFetchById(req.body.tables.id, req.body.tables);

                    for (let i = 0; i < req.body.detailsOrder.length; i++) {
                        if (req.body.detailsOrder[i].status === 'Pedido') {
                            req.body.detailsOrder[i].status = 'Preparando';
                            await DetailsOrder.query(trx).updateAndFetchById(req.body.detailsOrder[i].id, req.body.detailsOrder[i]);
                        }
                    }

                    return (tableReturn)
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.post('/dispatchOrder', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    req.body.tables.status = 'Ocupado';
                    const tableReturn = await Tables.query(trx).updateAndFetchById(req.body.tables.id, req.body.tables);

                    for (let i = 0; i < req.body.detailsOrder.length; i++) {
                        if (req.body.detailsOrder[i].status === 'Pedido' ||
                            req.body.detailsOrder[i].status === 'Preparando') {
                            req.body.detailsOrder[i].status = 'Despachado';
                            await DetailsOrder.query(trx).updateAndFetchById(req.body.detailsOrder[i].id, req.body.detailsOrder[i]);
                        }
                    }

                    return (tableReturn)
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
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
                        if (product.quantity < req.body.detailsOrder[contador].quantity) {
                            disponibilidadProductos = false;
                        }
                        contador++;
                    }
                    contador = 0;

                    if (disponibilidadProductos === true) {
                        while (req.body.detailsOrder[contador]) {
                            let product: any = await Products.query(trx).findById(req.body.detailsOrder[contador].productId);
                            product.quantity = Number(product.quantity) - Number(req.body.detailsOrder[contador].quantity);
                            await Products.query(trx).updateAndFetchById(product.id, product);
                            contador++;
                        }
                        contador = 0;


                        orderSaved = await Orders.query(trx)
                            .insertAndFetch(orderFull);
                        while (req.body.detailsOrder[contador]) {
                            req.body.detailsOrder[contador].orderId = orderSaved.id;
                            req.body.detailsOrder[contador].status = 'Pedido';
                            delete req.body.detailsOrder[contador].products;
                            const product: any = await Products.query(trx)
                                .where('id', req.body.detailsOrder[contador].productId)
                                .first();
                            req.body.detailsOrder[contador].price = product.price * req.body.detailsOrder[contador].quantity;
                            req.body.detailsOrder[contador].cost = product.cost * req.body.detailsOrder[contador].quantity;
                            req.body.detailsOrder[contador].service = ((product.percentageService * req.body.detailsOrder[contador].price)/100);
                            req.body.detailsOrder[contador].tax = ((product.tax * req.body.detailsOrder[contador].price)/100);

                            await DetailsOrder.query(trx)
                                .insertAndFetch(req.body.detailsOrder[contador]);
                            contador++;
                        }
                        let table: any = await Tables.query(trx)
                            .where('id', orderSaved.tableId)
                            .first();
                        table.status = 'En cocina';
                        await Tables.query(trx).updateAndFetchById(table.id, table);
                    } else {
                        orderSaved = null;
                    }
                    return (orderSaved);
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.post('/saveOrderWithDescount', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    return (await Orders.query(trx).updateAndFetchById(req.body.id, req.body))
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.get('/getOrdersByEmployeeInDay/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

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
        router.get('/getOrdersByEmployeeInWeek/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.add(-1, "weeks").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

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
        router.get('/getOrdersByEmployeeInMonth/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.add(-1, "months").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

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
        router.post('/getOrdersByEmployeeInMonthByRange/', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let date1: string = req.body.dateEndSearch;
                    let date2: string = req.body.dateStartSearch;

                    const orders: any = await Orders.query(trx)
                        .first()
                        .select('*',
                            Orders.query(trx)
                                .whereBetween('start', [date2, date1])
                                .andWhere('employeeId', req.body.idEmployeeSearch)
                                .count().as('length'));
                    return {status: orders.length};
                });
                res.status(200).send(trans);

            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.get('/getCostOfOrdersByEmployeeInWeek/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.add(-1, "weeks").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

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
        router.get('/getCostOfOrdersByEmployeeInDay/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('employeeId', req.params.employeeId);

                    while (orders[contador]) {
                        total = Number(total) + Number(orders[contador].totalService);
                        contador++;
                    }
                    return {total};
                });
                res.status(200).send(trans);
            } catch (err) {
                res.status(403).send(err);
            }
        });
        router.get('/getCostOfOrdersByEmployeeInMonth/:employeeId', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    const currentDate1 = moment(new Date()).tz('America/Bogota');
                    const currentDate2 = moment(new Date()).tz('America/Bogota');
                    let date1: string = currentDate1.add(23, "hours").add(59, "minutes").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                    let date2: string = currentDate2.add(-1, "months").hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');

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
        router.post('/getCostOfOrdersByEmployeeInMonthByRange/', async function (req, res) {
            try {
                const trans = await transaction(Model.knex(), async (trx) => {
                    let contador = 0;
                    let total = 0;
                    let date1: string = req.body.dateEndSearch;
                    let date2: string = req.body.dateStartSearch;

                    const orders: any = await Orders.query(trx)
                        .whereBetween('start', [date2, date1])
                        .andWhere('employeeId', req.body.idEmployeeSearch);

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
