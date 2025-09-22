import express from 'express'
import routes from './routes.js'
import cors from "cors";

const app = express();
app.use(cors()); // libera todas origens
app.use(express.json());
app.use('/api', routes)

export default app