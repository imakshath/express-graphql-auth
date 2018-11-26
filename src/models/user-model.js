import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { 
	ObjectId,
	String,
	Boolean
} = Schema.Types;

const UserSchema = new Schema({
	id: ObjectId,
	name: String,
	email: { type: String, required: true },
	password: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		default: false
	},
	verificationCode: String
}, {
	timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;