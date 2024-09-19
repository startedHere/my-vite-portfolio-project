// api/sendEmail.js
import emailjs from 'emailjs-com';
// You need to install emailjs in your project

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	try {
		const { formData } = req.body;
		// Form data from frontend

		const response = await emailjs.sendForm(
			process.env.EMAILJS_SERVICE_ID,
			process.env.EMAILJS_TEMPLATE_ID,
			formData,
			process.env.EMAILJS_PUBLIC_KEY
		);
		if (response.status === 200) {
			console.log('Email sent successfully!', response);
			return true; // Indicate success
		} else {
			console.error('Failed to send email, response:', response);
			return false; // Indicate failure
		}
		// res.status(200).json({ message: 'Email sent successfully', response });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email', error });
	}
}
