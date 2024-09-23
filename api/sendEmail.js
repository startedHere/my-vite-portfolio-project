import nodemailer from 'nodemailer';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		// return res.status(405).json({ message: 'Method Not Allowed' });
		//_ using the (return) keyword first in an IF STATEMENT prevents all other line codes after IT from running...

		const { first_name, last_name, email, user_project } = req.body;

		if (!first_name || !last_name || !email || !user_project) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// Create transporter using SMTP
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			// true for 465, false for other ports
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		// Email content
		const mailOptions = {
			// from: `"${name}" <${email}>`, // sender address
			from: `"${first_name}" "${last_name}" <${email}>`, // sender address
			to: 'ugwu.chukwuma@outlook.com', // receiver's email
			subject: `New contact from ${first_name}`,
			text: message, // plain text
			// html: `<p>${message}</p>`, // HTML version
			html: `<p>${user_project}</p>`, // HTML version
		};

		try {
			// Send email
			await transporter.sendMail(mailOptions);

			res.status(200).json({ message: 'Email sent successfully' });
		} catch (error) {
			console.error('Error sending email:', error);
			res.status(500).json({ message: 'Failed to send email', error });
		}
	} else {
		res.status(405).json({ message: 'Method Not Allowed' });
	}
}
