const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationOTP = async (email, otp, shopName) => {
  await resend.emails.send({
    from: 'KiranaIQ <onboarding@resend.dev>',
    to: email,
    subject: 'Your KiranaIQ verification code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #C07841; margin-bottom: 4px;">🌾 KiranaIQ</h1>
        <p style="color: #8A7055; margin-top: 0;">Smart inventory for kirana stores</p>
        <hr style="border: none; border-top: 1px solid #f0e6d3; margin: 24px 0;" />
        <h2 style="color: #2C1810;">Hello ${shopName}! 👋</h2>
        <p style="color: #8A7055;">Use this OTP to verify your email address. It expires in 10 minutes.</p>
        <div style="background: #FDF6ED; border: 2px dashed #C07841; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #8A7055; font-size: 13px; margin: 0 0 8px;">Your verification code</p>
          <h1 style="color: #C07841; font-size: 48px; letter-spacing: 12px; margin: 0; font-family: monospace;">${otp}</h1>
        </div>
        <p style="color: #8A7055; font-size: 13px;">If you didn't create a KiranaIQ account, ignore this email.</p>
      </div>
    `
  })
}

const sendPasswordResetOTP = async (email, otp) => {
  await resend.emails.send({
    from: 'KiranaIQ <onboarding@resend.dev>',
    to: email,
    subject: 'Your KiranaIQ password reset code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #C07841; margin-bottom: 4px;">🌾 KiranaIQ</h1>
        <p style="color: #8A7055; margin-top: 0;">Smart inventory for kirana stores</p>
        <hr style="border: none; border-top: 1px solid #f0e6d3; margin: 24px 0;" />
        <h2 style="color: #2C1810;">Password Reset Request</h2>
        <p style="color: #8A7055;">Use this OTP to reset your password. It expires in 10 minutes.</p>
        <div style="background: #FDF6ED; border: 2px dashed #C07841; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #8A7055; font-size: 13px; margin: 0 0 8px;">Your reset code</p>
          <h1 style="color: #C07841; font-size: 48px; letter-spacing: 12px; margin: 0; font-family: monospace;">${otp}</h1>
        </div>
        <p style="color: #8A7055; font-size: 13px;">If you didn't request this, ignore this email. Your password won't change.</p>
      </div>
    `
  })
}

module.exports = { sendVerificationOTP, sendPasswordResetOTP }