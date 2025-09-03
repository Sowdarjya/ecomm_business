import nodemailer from "nodemailer";

export const sendOrderConfirmedEmail = async (
  email: string,
  name: string,
  orderId: string,
  orderTotal: number,
  address: string,
  contactNo: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation #${orderId} - Beeচিত্র`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">Beeচিত্র</h1>
            <p style="color: #7f8c8d; margin: 5px 0 0 0; font-size: 14px;">Thank you for your order!</p>
          </div>
          
          <div style="background-color: #27ae60; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 20px;">✅ Order Confirmed!</h2>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Hello ${name},</h3>
            <p style="color: #34495e; line-height: 1.6; font-size: 16px;">
              We're excited to confirm that your order has been successfully placed! 
              Your items are being prepared and will be shipped to you soon.
            </p>
          </div>
          
          <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #2c3e50; margin-top: 0;">📋 Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Order ID:</td>
                <td style="padding: 8px 0; color: #2c3e50;">#${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Total Amount:</td>
                <td style="padding: 8px 0; color: #27ae60; font-weight: bold; font-size: 18px;">₹${orderTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Delivery Address:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Contact Number:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${contactNo}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #3498db; color: white; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0;">📦 What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 5px;">Your order is being processed</li>
              <li style="margin-bottom: 5px;">Expected delivery: 7 business days</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #7f8c8d; margin-bottom: 15px;">Need help with your order?</p>
            <a href="mailto:${
              process.env.EMAIL_USER
            }" style="background-color: #e74c3c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Contact Support</a>
          </div>
          
          <div style="border-top: 2px solid #ecf0f1; padding-top: 20px; text-align: center;">
            <p style="color: #95a5a6; font-size: 14px; margin: 0;">
              Thank you for choosing Beeচিত্র!<br>
              We appreciate your business and look forward to serving you again.
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
Order Confirmation - Beeচিত্র

Hello ${name},

Thank you for your order! We're excited to confirm that your order #${orderId} has been successfully placed.

Order Details:
- Order ID: #${orderId}
- Total Amount: ₹${orderTotal.toLocaleString()}
- Delivery Address: ${address}
- Contact Number: ${contactNo}

What's Next?
• Your order is being processed
• Expected delivery: 7 business days

If you have any questions about your order, please contact us at ${
      process.env.EMAIL_USER
    }

Thank you for choosing Beeচিত্র!
We appreciate your business and look forward to serving you again.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};
