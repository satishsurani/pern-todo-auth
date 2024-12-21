const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const model = require('../models');
const { generateUUID } = require('../utils/generateUUID')
const { responde } = require('../utils/responseHandler');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            const id = generateUUID();
            const { emails, displayName, photos } = profile;
            console.log(emails)
            try {
                let user = await model.User.findOne({ where: { email: emails[0].value } });
                if (user) {
                    if (!user.profileImage) {
                        user.profileImage = photos[0]?.value;
                        await user.save();
                    }
                    return done(null, user);
                }
                user = await model.User.create({
                    id,
                    name: displayName,
                    email: emails[0].value,
                    profileImage: photos[0]?.value,
                    isVerified: emails[0].verified,
                });
                return done(null, user); 
            } catch (error) {
                return done(error); 
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user with ID:", id);
    try {
        const user = await model.User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
