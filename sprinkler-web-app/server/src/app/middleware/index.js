import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';

// TODO: org
export default function registerMiddleware(app){
    app.use(session({
        secret: 'random_secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(express.static(path.resolve('client/dist/public')));
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app.use(function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    });
}