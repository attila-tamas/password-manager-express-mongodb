export default function PasswordChangeRequestEmailTemplate(userId: any, token: string) {
	return `
		<div style="width: 35%; min-width: 30em;">
			<h1>Password change request</h1>

			<p style="font-size: 1.125em">
				A request has been received to change the password for your account. You can create a new password by clicking the button below.
			</p>

			<a
				href="http://localhost:3000/change-password/${userId}/${token}"
				target="_blank"
				rel="noopener noreferrer">
				<button
					style="
						padding: 1em 2em;
						border: none;
						border-radius: 0.25em;
						font-weight: bold;
						font-size: 1.125em;
						background-color: #5ac97a;
						color: #ffffff;
					">
					Change password
				</button>
			</a>

			<p style="font-size: 1em">This link will expire in 10 minutes.</p>

			<p style="font-size: 1em">
				If you did not request this change or if you would no longer like to change your existing password, you can safely ignore this email.
			</p>
		</div>
	`;
}
