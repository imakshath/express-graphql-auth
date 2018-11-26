import express from 'express';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';
import {schema} from './schema';
import { resolvers } from './resolvers';
import cluster from 'cluster';
import {
	authMiddleware
} from './middlewares';
import mongoose from 'mongoose';
require('dotenv').config();

const pid = process.pid;

const app = express();
app.use(authMiddleware);
// bodyparser
app.use(bodyParser.json())

app.get('/verify', (req, res) => {
	console.log('Worker %d running!', cluster.worker.id);
	console.log(req.query.id)
	resolvers.verifyUser(req.query.id).then(result => {
		res.status(200).send('Success');
	})
	.catch((e) => {
		console.log(e)
		res.status(500).send('Something went wrong')
	})
});

app.use('/graphql', graphqlHTTP(req => ({
	schema,
	rootValue: resolvers,
	graphiql: true,
	context: {
		user: req.user,
		host: req.get('host')
	},
})))

/** DB connection */
mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Db connected successfully!');
});

app.listen(4000, async ()=> {
	console.log('Worker %d running!', cluster.worker.id);
	console.log(`App is running and Listening to ${pid}`);
});