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
		const html = `<p>Hi ${name}, welcome to our service!</p>`;
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Welcome to Our Service",
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
