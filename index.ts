import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {sequelizeConnection} from './databaseConfig';
import {authRouter} from './routes/authenticationRoutes';
import {userRouter} from './routes/userRoutes';
import createInitialEntities from './model/InitialSetup';

dotenv.config();

const app: Express = express();

// Should set this up so that the front-end app can access this api even tough 
// we are running on different ports, maybe different hosts.
// haven't actually tryied it but it should work fine if in "origin" we set the URI for the front-end
// as is, the front-end should be reachable at localhost adding one to our port number
// TODO: the right thing to do would be to put the whole uri for the front-end in the environment
// with that we could have two containers/hosts/whatever one for the front-end and other for the back-end
const port: string = process.env.PORT || '3000';

app.use(express.json())
app.use(express.urlencoded({extended: true}));

//synchronizing the database and forcing it to false so we dont lose data
sequelizeConnection.sync({ force: false }).then(() => {
    createInitialEntities();
    console.log("db has been re sync")
}).catch( e => {
    console.log("Something went wrong conneceting to the database: " + e);
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.get('/', (_req: Request, res: Response) => {
    res.send('You are running Cubeseed back-end!');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[server]: Front-end should be running at ${origin}`);
});

