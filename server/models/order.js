'use strict';
const mongoose = require('mongoose');
// Define our order schema
const UserSchema = new mongoose.Schema({
    id: Number,
    date_created: Date,
    date_shipped: Date,
    subtotal_inc_tax: Number,
    shipping_cost_inc_tax: Number,
    total_inc_tax: Number,
    payment_method: String,
    discount_amount: Number,
    coupon_discount: Number,
    billing_address: Object,
    products: Object
});
