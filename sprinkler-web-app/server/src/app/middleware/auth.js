export default function authMiddleware (req, res, next) {
    if(!req.session.user) res.redirect('/login');
    else next();
}