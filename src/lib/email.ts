import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL || "The Fairway Standard <noreply@thefairwaystandard.org>";

export async function sendBookingConfirmation({
  to,
  playerName,
  providerName,
  serviceName,
  date,
  price,
}: {
  to: string;
  playerName: string;
  providerName: string;
  serviceName: string;
  date: string;
  price: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Booking Confirmed: ${serviceName} with ${providerName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #15803d;">Booking Confirmed!</h2>
        <p>Hi ${playerName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 4px 0;"><strong>Provider:</strong> ${providerName}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>Price:</strong> $${price}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">See you on the course!</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">The Fairway Standard — Premium golf services at fair prices.</p>
      </div>
    `,
  });
}

export async function sendNewBookingNotification({
  to,
  providerName,
  playerName,
  serviceName,
  date,
  price,
}: {
  to: string;
  providerName: string;
  playerName: string;
  serviceName: string;
  date: string;
  price: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `New Booking Request: ${serviceName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #15803d;">New Booking Request!</h2>
        <p>Hi ${providerName},</p>
        <p>You have a new booking request. Log in to accept or decline it.</p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 4px 0;"><strong>Player:</strong> ${playerName}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>Price:</strong> $${price}</p>
        </div>
        <a href="https://fairway-standard.vercel.app/dashboard" style="display: inline-block; background: #15803d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in Dashboard</a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">The Fairway Standard — Premium golf services at fair prices.</p>
      </div>
    `,
  });
}
