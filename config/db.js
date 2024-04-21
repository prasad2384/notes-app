import mongoose from 'mongoose';

const connectdb = async () => {
    try {

        //setup mongodb connection
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connect To MongoDb Database ${conn.connection.host}`);


    } catch (error) {
        console.log(error);

    }
}
export default connectdb;