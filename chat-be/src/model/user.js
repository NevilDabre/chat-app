import mongooes from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const SALT_WORK_FACTOR = 10;

const Schema = mongooes.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.isValidPassword = function (password) {
    const user = this;
    return bcrypt.compareSync(password, user.password);
}

const UserModel = mongooes.model('user', UserSchema);

module.exports = UserModel;