export default function AccountActivationEmailTemplate(activatorToken: string | undefined) {
	return `
		<div>
			<h1>Account activation</h1>

			<p style="font-size: 1.125em">
				You can activate your account by clicking the button below.
			</p>

			<a
				href="http://localhost:3000/activate-account/${activatorToken}"
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
					Activate account
				</button>
			</a>
		</div>
	`;
}
