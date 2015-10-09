'use strict';
const router = require('koa-router')({
        prefix: '/inventmanapi'
    }),
    config = require('../config.json'),
    jwt = require('jsonwebtoken'),
    MongoClient = require('mongodb'),
    koajwt = require('koa-jwt'),
    fetch = require('node-fetch'),
    GoogleSpreadsheet = require('google-spreadsheet'),
    promisify = require('promisify-any');
// protected inventman api router using koa-router middleware
router.use(koajwt({
    secret: config.secret
}));
// create route to check for valid jwt
router.get('/me', function*() {
    // this is a valid token
    this.response.body = "success";
});
// function to process an order
function orderProcessInsert(connection, page, index) {
    // check if the order already exists
    return connection.collection('orders').findOne({
        _id: page[index].id
    }).then(result => {
        // found the order
        if (result && index < page.length - 1) {
            // skip this order
            return orderProcessInsert(connection, page, ++index);
        } else if (!result && index < page.length) {
            // order does not exist so insert it
            return fetch(page[index].products.url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + config.bigcommerceauth,
                },
                compress: true
            }).then(response => {
                return response.json();
            }).then(json => {
                // this array will be reassigned to products
                let new_products = [],
                    noofproducts = json.length;
                // check if it is a master SKU
                for (let i = 0, product = {}; i < noofproducts;) {
                    // reinitialize the product
                    product = {};
                    // this is a master product
                    product.master_name = noofproducts > 1 ? json[i].name : '';
                    product.master_sku = noofproducts > 1 ? json[i].sku : '';
                    // initialize the children array
                    product.children = [];
                    // run a loop from next product till next master is found
                    for (i = noofproducts > 1 ? ++i : 0; i < noofproducts && json[i] && json[i].product_options.length == 0; i++) {
                        let child = {};
                        child.child_name = json[i].name;
                        child.child_sku = json[i].sku;
                        // push the child in the children array
                        product.children.push(child);
                    }
                    new_products.push(product);
                }
                // return the modified order
                page[index].products = new_products;
                return page[index];
            }).then(processedorder => {
                // start insertion into database
                return connection.collection('orders').insertOne({
                    _id: processedorder.id,
                    date_created: new Date(processedorder.date_created),
                    subtotal_inc_tax: parseFloat(processedorder.subtotal_inc_tax, 10),
                    shipping_cost_inc_tax: parseFloat(processedorder.shipping_cost_inc_tax, 10),
                    total_inc_tax: parseFloat(processedorder.total_inc_tax, 10),
                    payment_method: processedorder.payment_method,
                    discount_amount: parseFloat(processedorder.discount_amount, 10),
                    coupon_discount: parseFloat(processedorder.coupon_discount, 10),
                    billing_address: processedorder.billing_address,
                    products: processedorder.products
                }).then(result2 => {
                    if (result2 && index == page.length - 1) {
                        return "success";
                    } else if (result2 && index < page.length - 1) {
                        return orderProcessInsert(connection, page, ++index);
                    } else {
                        return "failure";
                    }
                }).catch(error => {
                    throw error;
                });
            }).catch(error => {
                throw error;
            });
        } else {
            // end of processing page
            return "success";
        }
    }).catch(error => {
        throw error;
    });
}
// function to process the pages
function processPage(connection, page) {
    console.log('Start syncing page: ' + page);
    return fetch('https://store-flx4x.mybigcommerce.com/api/v2/orders.json?limit=250&page=' + page, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + config.bigcommerceauth,
        },
        compress: true
    }).then(res => {
        return res.json();
    }).then(page => {
        // start processing the page the moment it arrives
        // recursively process all the orders from page[0]
        return orderProcessInsert(connection, page, 0);
    }).then(status => {
        if (status == "success") {
            console.log('Page ' + page + ' synced Successfully...');
            // return processPage(connection, ++page);
        } else {
            // rerun the same page
            return processPage(connection, page);
        }
    }).catch(error => {
        throw error;
    })
}
// router to start syncing of database
router.get('/syncdb', function*() {
    // start processing the E-commerce API for data
    // load the mongoDB native driver
    this.response.body = yield MongoClient.connect(config.dburl, {
        promiseLibrary: Promise
    }).then(db => {
        // get the total no of pages and create the promise chain
        return fetch('https://store-flx4x.mybigcommerce.com/api/v2/orders/count.json', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + config.bigcommerceauth,
            },
            compress: true
        }).then(response => {
            if (response.status == 509) {
                throw new Error("The requests-per-hour limit has been reached.");
            } else {
                return response.json();
            }
        }).then(json => {
            return parseInt(json.count / 250) + 1;
        }).then(noofpages => {
            let promiseArray = [];
            for (let i = 1; i <= noofpages; i++) {
                promiseArray.push(processPage(db, i));
            }
            // call the page processing function Array
            return Promise.all(promiseArray).then(result => {
                return db.close(true).then(result2 => {
                    // finally all done...
                    console.log('All orders and pages to be inserted processed');
                    return "success";
                }).catch(error => {
                    throw error;
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    }).catch(error => {
        console.log(error.message);
        return error.message;
    })
});
// function to add the rows
function addRow(orderstream, sheet1, doc, i) {
    // pause the stream
    orderstream.pause();
    // start adding the data
    sheet1.addRow({
        'Order ID': doc._id,
        'Order Date': doc.date_created.toString(),
        'First Name': doc.billing_address.first_name,
        'Last Name': doc.billing_address.last_name,
        'Street 1': doc.billing_address.street_1,
        'Street 2': doc.billing_address.street_2,
        'City': doc.billing_address.city,
        'State': doc.billing_address.state,
        'Zip': doc.billing_address.zip,
        'Country': doc.billing_address.country,
        'Phone': doc.billing_address.phone,
        'Email': doc.billing_address.email,
        'Order Total inc tax': doc.total_inc_tax,
        'Shipping Cost inc tax': doc.shipping_cost_inc_tax,
        'Payment Method': doc.payment_method,
        'Discount Amount': doc.discount_amount,
        'Coupon Discount': doc.coupon_discount,
        'Product Qty': doc.products.length,
        'Product SKU': doc.products[i].master_sku ? doc.products[i].master_sku : '',
        'Product Name': doc.products[i].master_name ? doc.products[i].master_name : '',
        'Child SKU 1': doc.products[i].children[0] ? doc.products[i].children[0].child_sku : '',
        'Child SKU 2': doc.products[i].children[1] ? doc.products[i].children[1].child_sku : '',
        'Child SKU 3': doc.products[i].children[2] ? doc.products[i].children[2].child_sku : '',
        'Child SKU 4': doc.products[i].children[3] ? doc.products[i].children[3].child_sku : '',
        'Child SKU 5': doc.products[i].children[4] ? doc.products[i].children[4].child_sku : '',
        'Child SKU 6': doc.products[i].children[5] ? doc.products[i].children[5].child_sku : '',
        'Child SKU 7': doc.products[i].children[6] ? doc.products[i].children[6].child_sku : '',
        'Child SKU 8': doc.products[i].children[7] ? doc.products[i].children[7].child_sku : '',
        'Child SKU 9': doc.products[i].children[8] ? doc.products[i].children[8].child_sku : '',
        'Child SKU 10': doc.products[i].children[9] ? doc.products[i].children[9].child_sku : ''
    }, error => {
        // callback
        if (error) {
            // log the error
            // console.log(error);
            console.log('Inventman was unable to add a row due to some Google API error');
            // start calling the addRow(orderstream, sheet1, doc, i); again recursively after 31 seconds
            setTimeout(() => {
                addRow(orderstream, sheet1, doc, i);
            }, 31000);
        } else {
            // data added successfully
            if (++i < doc.products.length) {
                // only if it does not exceed the length
                addRow(orderstream, sheet1, doc, i);
            } else {
                // resume the stream for next doc
                orderstream.resume();
            }
        }
    });
}
// checks if ID already matches
function findId(rows, docid) {
    for (let row of rows) {
        // row must not be null which means invalid row
        if (row && row.orderid == docid) {
            return true;
        }
    }
    return false;
}
// function to trim fat
function removeInvalidRows(rows) {
    let rowDeletionPromiseArray = [];
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i],
            productqty = 0;
        for (let row2 of rows) {
            if (row.orderid == row2.orderid) {
                productqty++;
            }
        }
        if (row.productqty != productqty) {
            // create row deletion promises
            let del = promisify(row.del)().then((err, result) => {
                console.log(row.orderid + ' deleted');
                // invalidate the row
                rows[i] = null;
                return "deleted";
            }).catch(error => {
                throw error;
            });
            rowDeletionPromiseArray.push(del);
        }
    }
    console.log('All invalid rows deletion promises generated...');
    return rowDeletionPromiseArray;
}

// router to sync the Google Sheets
router.get('/syncgsheet', function*() {
    // load the mongoDB native driver
    this.response.body = yield MongoClient.connect(config.dburl, {
        promiseLibrary: Promise
    }).then(db => {
        // spreadsheet key - the long id in sheets url
        let my_sheet = new GoogleSpreadsheet(config.spreadsheet_id);
        // With auth -- read + write
        let creds = require(config.path_gapi_key);
        // start promisifying the functions
        let auth = promisify(my_sheet.useServiceAccountAuth, 1);
        let getInfo = promisify(my_sheet.getInfo);
        // start promise processing
        return auth(creds).then(error => {
            if (error) {
                throw new Error("Unable to Login using the provided credentials");
            } else {
                return true;
            }
        }).then(loggedin => {
            if (loggedin) {
                // getInfo returns info about the sheet and an array or "worksheet" objects
                return getInfo().then(sheet_info => {
                    console.log(sheet_info.title + ' is loaded');
                    return sheet_info;
                }).then(sheet_info => {
                    // assign sheet1/Orders
                    let sheet1 = sheet_info.worksheets[0];
                    let getRows = promisify(sheet1.getRows);
                    return getRows().then(rows => {
                        // rows loaded finally
                        console.log('The rows have been fetched in memory');
                        return Promise.all(removeInvalidRows(rows)).then(results => {
                            console.log('pushing the new rows to Google Spreadsheet...');
                            // create the stream
                            let orderstream = db.collection('orders').find().addCursorFlag('noCursorTimeout', true).stream();
                            // start listening to events on the stream
                            orderstream.on('data', doc => {
                                // check if data already exists
                                if (!findId(rows, doc._id)) {
                                    // add some data
                                    addRow(orderstream, sheet1, doc, 0);
                                } else {
                                    orderstream.resume();
                                }
                            }).on('error', error => {
                                console.log(error.message);
                                // send failure
                                throw error;
                            }).on('end', () => {
                                // the stream is ended
                                console.log('No more data to sync...');
                                // send success
                                // return "success";
                                db.close();
                            });
                            // this success just tell that all the data has been processed as Google Sheets takes too long to process
                            return "success";
                        }).catch(error => {
                            throw error;
                        });
                    }).catch(error => {
                        throw error;
                    });

                }).catch(error => {
                    throw error;
                });
            }
        }).then(result => {
            return result;
            // close the database connection
            db.close();
        }).catch(error => {
            // close the database connection
            db.close();
            throw error;
        });

    }).catch(error => {
        // final error catcher
        console.log(error);
        return error.message;
    });
});


// router to get all sales
router.get('/getsales/:sku', function*() {
    if (this.params.sku == 'all') {
        this.response.body = yield MongoClient.connect(config.dburl, {
            promiseLibrary: Promise
        }).then(db => {
            // exclusive rows
            return db.collection('orders').aggregate([{
                $group: {
                    _id: {
                        $substr: ["$date_created", 0, 10]
                    },
                    qtysales: {
                        $sum: 1
                    },
                    totalvalue: {
                        $sum: "$subtotal_inc_tax"
                    }
                }
            }]).toArray().then(orders => {
                // close the database connection
                db.close();
                // console.log('The sales-data processed and retrieved in memory...');
                // return the response
                return orders;
            }).catch(error => {
                // close the database connection
                db.close();
                throw error;
            });
        }).catch(error => {
            // final error catcher
            console.log(error);
            return error.message;
        });
    } else {
        this.response.body = yield MongoClient.connect(config.dburl, {
            promiseLibrary: Promise
        }).then(db => {
            // exclusive rows
            return db.collection('orders').aggregate([{
                $match: {
                    'products.master_sku': this.params.sku
                }
            }, {
                $group: {
                    _id: {
                        $substr: ["$date_created", 0, 10]
                    },
                    qtysales: {
                        $sum: 1
                    },
                    totalvalue: {
                        $sum: "$subtotal_inc_tax"
                    }
                }
            }]).toArray().then(orders => {
                // close the database connection
                db.close();
                // console.log('The sales-data processed and retrieved in memory...');
                // return the response
                return orders;
            }).catch(error => {
                // close the database connection
                db.close();
                throw error;
            });
        }).catch(error => {
            // final error catcher
            console.log(error);
            return error.message;
        });
    }
});
// router to get top 10 master SKUs
router.get('/getsales/top10master/:period', function*() {
    if (this.params.period == -1) {
        this.response.body = yield MongoClient.connect(config.dburl, {
            promiseLibrary: Promise
        }).then(db => {
            // exclusive rows
            return db.collection('orders').aggregate([{
                $unwind: "$products"
            }, {
                $group: {
                    _id: {
                        sku: "$products.master_sku",
                        name: "$products.master_name"
                    },
                    qtysales: {
                        $sum: 1
                    },
                    totalvalue: {
                        $sum: "$subtotal_inc_tax"
                    }
                }
            }, {
                $sort: {
                    "qtysales": -1
                }
            }]).limit(10).toArray().then(orders => {
                // close the database connection
                db.close();
                // console.log('The sales-data processed and retrieved in memory...');
                // return the response
                return orders;
            }).catch(error => {
                // close the database connection
                db.close();
                throw error;
            });
        }).catch(error => {
            // final error catcher
            console.log(error);
            return error.message;
        });
    } else if (this.params.period != "max" && parseInt(this.params.period) > 0) {
        this.response.body = yield MongoClient.connect(config.dburl, {
            promiseLibrary: Promise
        }).then(db => {
            // exclusive rows
            return db.collection('orders').aggregate([{
                $project: {
                    products: "$products",
                    date_diff: {
                        $subtract: [new Date(), "$date_created"]
                    },
                    subtotal_inc_tax: "$subtotal_inc_tax"
                }
            }, {
                $project: {
                    products: "$products",
                    date_diff: {
                        $lt: ["$date_diff", parseInt(this.params.period) * 24 * 60 * 60 * 1000]
                    },
                    subtotal_inc_tax: "$subtotal_inc_tax"
                }
            }, {
                $match: {
                    date_diff: true
                }
            }, {
                $unwind: "$products"
            }, {
                $match: {
                    "products.master_sku": {
                        $ne: ''
                    }
                }
            }, {
                $group: {
                    _id: {
                        sku: "$products.master_sku",
                        name: "$products.master_name"
                    },
                    qtysales: {
                        $sum: 1
                    },
                    totalvalue: {
                        $sum: "$subtotal_inc_tax"
                    }
                }
            }, {
                $sort: {
                    "qtysales": -1
                }
            }]).limit(10).toArray().then(orders => {
                // close the database connection
                db.close();
                // console.log('The sales-data processed and retrieved in memory...');
                // return the response
                return orders;
            }).catch(error => {
                // close the database connection
                db.close();
                throw error;
            });
        }).catch(error => {
            // final error catcher
            console.log(error);
            return error.message;
        });
    }
});

// export the entire router
module.exports = router;
