// api/sendEmail.js
// import emailjs from 'emailjs-com';
// You need to install emailjs in your project

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	console.log('EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID);
	console.log('EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID);
	console.log('EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY);

	if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
		return res.status(500).json({ message: 'Missing EmailJS environment variables' });
	}

	try {
		// const { formData } = req.body;
		const formData = req.body;
		// Form data from frontend

		console.log(req.body);

		if (!formData) {
			return res.status(400).json({ message: 'Form data missing' });
		}

		const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				// process.env.EMAILJS_SERVICE_ID,
				// process.env.EMAILJS_TEMPLATE_ID,
				// formData,
				// process.env.EMAILJS_PUBLIC_KEY

				service_id: process.env.EMAILJS_SERVICE_ID,
				template_id: process.env.EMAILJS_TEMPLATE_ID,
				user_id: process.env.EMAILJS_PUBLIC_KEY,
				template_params: formData, // Use the received form data
			}),
		});
		// const response = await emailjs.send(
		// 	process.env.EMAILJS_SERVICE_ID,
		// 	process.env.EMAILJS_TEMPLATE_ID,
		// 	formData,
		// 	process.env.EMAILJS_PUBLIC_KEY
		// );
		// if (response.status === 200) {
		// 	console.log('Email sent successfully!', response);
		// 	return true; // Indicate success
		// } else {
		// 	console.error('Failed to send email, response:', response);
		// 	return false; // Indicate failure
		// }

		if (!response.ok) {
			throw new Error(`Failed to send email: ${response.statusText}`);
		}

		const result = await response.json();

		res.status(200).json({ message: 'Email sent successfully', response });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email', error });
	}
}
