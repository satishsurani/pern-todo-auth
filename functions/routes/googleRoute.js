const express = require('express')
const passport = require('passport');
const { generateToken } = require('../utils/generateToken');
require('../controllers/googleOthController')

const router = express.Router();
const url = process.env.UI_URL

router.get('/auth/google', 
  passport.authenticate( 'google',{
    scope: ['profile', 'email']
  } )
)

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: `${url}/login`}),
    function(req, res){
        const token = generateToken(req.user)
        res.cookie('token', token, {maxAge:3600000})
        res.redirect(`${url}/success-login?token=${token}`)
    }
)

module.exports = router;