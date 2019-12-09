const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secureRoute = require('./secure-routes');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Welcome to our chat application.');
})

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An Error occured: User Not Found.')
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, 'top_secret');
                return res.json({ token });
            });
        } catch (error) {
            return next({ message: 'Error at login'});
        }
    })(req, res, next);
});

//We plugin our jwt strategy as a middleware so only verified users can access this route
router.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

module.exports = router;