export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	try {
		const formData = req.body;

		if (!formData) {
			return res.status(400).json({ message: 'Form data is missing' });
		}

		const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				service_id: process.env.EMAILJS_SERVICE_ID,
				template_id: process.env.EMAILJS_TEMPLATE_ID,
				user_id: process.env.EMAILJS_PUBLIC_KEY,
				template_params: formData,
			}),
		});

		const responseBody = await response.json();

		if (!response.ok) {
			throw new Error(`Failed to send email: ${responseBody.message}`);
		}

		res.status(200).json({ message: 'Email sent successfully', response: responseBody });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email', error: error.message });
	}
}
