import express from 'express';
import api from './src/routes';

const app = express();

app.use(express.json());
app.use('/api',api);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`App listening on port: ${port}`))