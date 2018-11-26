import { buildSchema } from 'graphql';
import userSchema from './user-schema';
const schema = buildSchema(''.concat(userSchema));
export {
	schema 
}