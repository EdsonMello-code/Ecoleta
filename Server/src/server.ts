import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';

const server = express();

server.use(cors())
server.use(express.json());

server.use(routes); 

server.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads' )))

server.listen(3333)
