import conn from '../db';
import getLogger from '../logging';
import Product from "../models/product";
import Component from "../models/component";
import User from "../models/user";

const logger = getLogger(__filename);

export default {

    authenticate(username, password, callback) {
        const sql = "select id from user where username=? and password=?";
        const values = [username, password];
        conn.query({sql, values}, (err, res, fields) => {
            if (err) {
                logger.error('Failed to authenticate user', err);
                callback(err);
            } else {
                const userId = res.length ? res[0].id : null;
                logger.info('User authentication complete. User ID = %s', userId);
                callback(null, userId);
            }
        });
    },

    getAllProducts(userId, callback) {
        const sql = "select id, product_type_id from product where user_id=?";
        const values = [userId];
        conn.query({sql, values}, (err, res, fields) => {
            if (err) {
                logger.error('Failed to fetch products for user', err);
                callback(err);
            } else {
                const products = res.map(row => new Product({
                    productId: row.id,
                    productTypeId: row.product_type_id
                }));
                logger.info('Num products fetched for user = %d', products.length, {products, res, fields});
                callback(null, products);
            }
        });
    },

    getAllComponents(userId, callback) {
        const sql = "select component.id, component.component_type_id, component.product_id " +
            "from component join product on component.product_id=product.id where product.user_id=?";
        const values = [userId];
        conn.query({sql, values}, (err, res, fields) => {
            if (err) {
                logger.error('Failed to fetch components for user', err);
                callback(err);
            } else {
                const components = res.map(row => new Component({
                    componentId: row.id,
                    componentTypeId: row.component_type_id,
                    productId: row.product_id
                }));
                logger.info('Num components fetched for user = %d', components.length, {components, res, fields});
                callback(null, components);
            }
        });
    },

    getUserInfo(userId, callback) {
        this.getAllProducts(userId, (err, products) => {
            if (err) {
                logger.error('Failed to fetch user info');
                callback(err);
            } else {
                this.getAllComponents(userId, (err, components) => {
                    if (err) {
                        logger.error('Failed to fetch user info');
                        callback(err);
                    } else {
                        const user = new User({userId, products, components});
                        logger.info("User info fetch completed", user);
                        callback(null, user);
                    }
                });
            }
        });
    }

};