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

		// Read the raw response text
		const responseText = await response.text();

		// Log the raw response text
		console.log('Raw response text:', responseText);

		// Attempt to parse the response text as JSON
		let responseBody;
		try {
			responseBody = JSON.parse(responseText);
		} catch (e) {
			responseBody = { message: 'Response is not valid JSON' };
		}

		if (!response.ok) {
			throw new Error(`Failed to send email: ${responseBody.message || responseText}`);
		}

		res.status(200).json({ message: 'Email sent successfully', response: responseBody });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email', error: error.message });
	}
}
