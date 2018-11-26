import nodemailer from "nodemailer";
require('dotenv').config();

class Email {
	constructor(options) {
		this.host = options.host;
		this.recipient = options.recipient;
	}

	async init() {
		const account = await nodemailer.createTestAccount();
		this.transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass // generated ethereal password
			}
		});
		// setup email data with unicode symbols
		this.mailOptions = {
			to: this.recipient, // list of receivers
			subject: '', // Subject line
			text: '', // plain text body
			html: '' // html body
		};

	}
	send() {
	}
}

export class VerificationEmail extends Email {
	constructor(options) {
		super(options);
		this.verificationCode = options.verificationCode;
	}
	async send() {
		await this.init();
		const link = "http://" + this.host + "/verify?id=" + this.verificationCode;
		this.mailOptions.subject = "Please confirm your Email account",
		this.mailOptions.text = "Hello, Please Click on the link to verify your email." + link;
		this.mailOptions.html = "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>";
		const info = await this.transporter.sendMail(this.mailOptions);
		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	}
}
