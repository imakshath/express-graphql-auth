import jwt from 'express-jwt';

// authentication middleware
const authMiddleware = jwt({
	secret: process.env.JWT_SECRET || 'blabla',
	credentialsRequired: false,
}).unless({
	path: ['/graphql', '/verify']
});

export default authMiddleware;