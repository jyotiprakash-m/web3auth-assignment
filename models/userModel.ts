import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: String,
    address: String,
    mobile: String
});

const User = models.User || model('User', userSchema);

export default User;