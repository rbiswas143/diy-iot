import getLogger from '../../logging';
import auth from './../middleware/auth';
import UserService from '../../service/user';
import path from 'path';

const logger = getLogger(__filename);

export default function registerAuthControllers(app) {

    app.get('/login', function (req, res) {
        logger.info("Request received for login page");
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.sendFile(path.resolve('client/dist/login.html'));
        }
    });

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        logger.info('Login request received', {username, password});
        UserService.authenticate(username, password, (err, userId) => {
            if (err) {
                logger.error("Error occurred while authenticating user");
                throw err;
            } else {
                const hasAuthenticated = userId !== null;
                if (hasAuthenticated) {
                    logger.info("User authenticated. User ID = %d", userId);
                    UserService.getUserInfo(userId, (err, user) => {
                        if (err) {
                            logger.error("Failed to fetch user info. Login failed");
                            throw err;
                        } else {
                            user.username = username;
                            req.session.user = user;
                            logger.info("User data added to session", req.session);
                            res.redirect('/');
                        }
                    });
                } else {
                    logger.warn("Invalid credentials. Login failed");
                    res.sendStatus(401);
                }
            }
        });
    });

    app.post('/logout', auth, (req, res) => {
        logger.info(`Logout request received for user id ${req.session.user.userId}`);
        req.session.destroy();
        res.end();
    });

}