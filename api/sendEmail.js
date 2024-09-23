import nodemailer from 'nodemailer';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	try {
		const { first_name, last_name, email, user_project } = req.body;

		console.log({ first_name, last_name, email, user_project });

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
			text: '', // plain text
			// html: `<p>${message}</p>`, // HTML version
			html: `<p>${user_project}</p>`, // HTML version
		};

		console.log({ first_name, last_name, email });

		// Send email
		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email', error });
	}
}
