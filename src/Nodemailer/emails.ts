import { transporter, sender } from "./nodemailer.config";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates";

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
	try {
		const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Verify your email",
			html,
		});

		console.log("Verification email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending verification email:", error);
		throw new Error(`Error sending verification email: ${(error as Error).message}`);
	}
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
	try {
		const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Welcome to Techbase</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #000000; /* Black background for the entire email */
					margin: 0;
					padding: 0;
					color: #ffffff;
					width: 100%;
				}
				.email-container {
					width: 100%;
					max-width: 600px;
					margin: 0 auto;
					background-color: #1e1e1e; /* Dark card background */
					border-radius: 8px;
					padding: 30px;
					box-shadow: 0 2px 10px rgba(0,0,0,0.2);
					text-align: center;
				}
				.header {
					text-align: center;
					padding: 20px 0;
					background: #FFA500; /* Orange gradient background */
					border-radius: 8px 8px 0 0;
				}
				.header h1 {
					color: #ffffff;
					font-size: 24px;
					margin: 0;
				}
				.content {
					background-color: #2b2b2b; /* Slightly lighter black for content */
					padding: 20px;
					border-radius: 0 0 8px 8px;
				}
				.content p {
					color: #cccccc;
					margin: 0 0 10px;
				}
				.content a {
					display: inline-block;
					padding: 12px 25px;
					background-color: #FFA500;
					color: #ffffff;
					text-decoration: none;
					border-radius: 5px;
					margin-top: 20px;
					font-weight: bold;
				}
				.content a:hover {
					background-color: #ff8800;
				}
				.footer {
					text-align: center;
					margin-top: 30px;
					color: #777777;
					font-size: 12px;
				}
				.footer p {
					margin: 0;
				}
				.logo {
					color: #FFA500;
					font-size: 16px;
					font-weight: bold;
				}
			</style>
		</head>
		<body>
			<div class="email-container">
				<!-- Header section -->
				<div class="header">
					<h1>Welcome to Techbase!</h1>
				</div>
				
				<!-- Content section -->
				<div class="content">
					<p>Hello ${name},</p>
					<p>We are thrilled to have you on board at Techbase. Get ready to experience our platform!</p>
					<p>Feel free to explore and if you need any assistance, we're here to help you.</p>
					<a href="https://techbase.com/dashboard">Start Exploring</a>
				</div>

				<!-- Footer section -->
				<div class="footer">
					<p>Thank you for joining us,</p>
					<p class="logo">Techbase Team</p>
				</div>
			</div>
		</body>
		</html>
		`;

		const info = await transporter.sendMail({
			from: `"Techbase" <noreply@techbase.com>`,
			to: email,
			subject: "Welcome to Techbase!",
			html,
		});

		console.log("Welcome email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending welcome email:", error);
		throw new Error(`Error sending welcome email: ${(error as Error).message}`);
	}
};

export const sendPasswordResetEmail = async (email: string, resetURL: string): Promise<void> => {
	try {
		const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Reset your password",
			html,
		});

		console.log("Password reset email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending password reset email:", error);
		throw new Error(`Error sending password reset email: ${(error as Error).message}`);
	}
};

export const sendResetSuccessEmail = async (email: string): Promise<void> => {
	try {
		const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Password Reset Successful",
			html,
		});

		console.log("Password reset success email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending password reset success email:", error);
		throw new Error(`Error sending password reset success email: ${(error as Error).message}`);
	}
};
