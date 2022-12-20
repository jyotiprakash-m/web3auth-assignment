import mongoose from 'mongoose';
const connectMongo = async () => mongoose.connect("mongodb+srv://jyoti:jyoti@cluster0.zyky9hh.mongodb.net/?retryWrites=true&w=majority");

export default connectMongo;