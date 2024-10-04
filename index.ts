import express from 'express';
import api from './src/routes';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use('/api', api);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`App listening on port: ${port}`))