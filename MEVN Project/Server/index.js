
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import 'dotenv/config';
import userRouter from "./routes/user.js";
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use("/user", userRouter);


const pORT = process.env.PORT|| 5000;
const uri = process.env.ATLAS_URI

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(pORT, () => console.log(`Server Running on Port: http://localhost:${pORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

