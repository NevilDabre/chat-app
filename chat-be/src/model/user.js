import mongooes from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

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

UserSchema.pre('save', async ()=>{
    const user = this;
    const hash = await bcrypt.hashSync(this.password, 10);
    this.password = hash;
    next();
})

UserSchema.methods.isValidPassword = async (password)=>{
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongooes.model('user', UserSchema);

module.exports = UserModel;