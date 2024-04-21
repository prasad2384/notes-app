import Express from "express";
import connectdb from "./config/db.js";
import 'dotenv/config';
import Authroute from './Routes/Authroute.js';
import Notesroute from './Routes/Notesroute.js';
import Otproute from './Routes/Otproute.js';
import cors from 'cors';
connectdb();

const app = Express();

app.use(Express.json());

app.use(cors());

app.use('/api/auth', Authroute);
app.use('/api', Notesroute);
app.use('/api',Otproute);

const port = process.env.PORT
app.get('/', (req, res) => {
    res.send({
        'message': "Welcome to Notes App"
    })
});
app.listen(port, () => {
    console.log(`server is running on ${port}`);
})