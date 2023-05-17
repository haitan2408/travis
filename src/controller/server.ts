import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import session from 'express-session';
import bookRouter from "./book.router";

const PORT = 3000;

const app = express();

declare module 'express-session' {
    export interface SessionData {
        success: string;
    }
}

app.set('view engine', 'ejs');
app.set('views', "./src/views");
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const DB_URL = 'mongodb://localhost:27017/training_nodejs';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: {maxAge: 60000}
}));

app.use('/book', bookRouter);

app.listen(PORT, () => {

    console.log("App running on port: " + PORT)

})
