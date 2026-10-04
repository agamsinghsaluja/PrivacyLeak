// Deliberately fake demonstration data. Never put real credentials in fixtures.
const databasePassword = "fixture-only-not-a-real-password";
const smtpPassword = process.env.SMTP_PASSWORD;
const message = "This is harmless text.";

export { databasePassword, smtpPassword, message };
