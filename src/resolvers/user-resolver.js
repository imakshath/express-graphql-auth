import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { VerificationEmail } from '../services';
require('dotenv').config();

async function getUser(args, context, info) {
	return await User.findById(args.id);
}

async function signup(args, context, info) {
	try {
		// 1
		const password = await bcrypt.hash(args.user.password, 10)
		// 2
		const existingUser = await User.findOne({ email: args.user.email }).exec();

		if (existingUser) {
			throw new Error('This emailId already registered');
		}

		const verificationCode = await crypto.randomBytes(16).toString('hex');

		const user = await User.create({
			...args.user,
			activationCode: verificationCode,
			password
		});
		
		const verificationEmail = new VerificationEmail({
			host: context.host,
			recipient: args.user.email,
			verificationCode
		});
		await verificationEmail.send();
		// 3
		const token = jwt.sign({
			userId: user.id
		}, process.env.JWT_SECRET)

		// 4
		return {
			token,
			user,
		}
	} catch(e) {
		console.log(e)
	}

}

async function login(parent, args, context, info) {
	try {
		const user = await User.findOne({
			email: args.email
		})
		if (!user) {
			throw new Error('No such user found')
		}
	
		// 2
		const valid = await bcrypt.compare(args.user.password, user.password)
		if (!valid) {
			throw new Error('Invalid password')
		}
	
		const token = jwt.sign({
			userId: user.id
		}, process.env.JWT_SECRET)
	
		// 3
		return {
			token,
			user,
		}
	} catch (error) {
		console.log(error)
		return {
			errors: error,
			ok: false
		}
	}
}

async function verifyUser(verificationCode) {
	try {
		const user = await User.findOne({
			verificationCode
		}).exec();
		console.log(user)
		if (!user) {
			throw new Error('No user found!');
			return;
		}
		await User.update({id: user.id},{
			active: true,
			verificationCode: null
		});
		return true;
	} catch(e) {
		throw new Error('No user found!');
	}
}

module.exports = {
	signup,
	login,
	getUser,
	verifyUser
}
