const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = null;
        this.emailEnabled = false;
        this.setupTransporter();
    }

    setupTransporter() {
        try {
            // Email configuration - can be customized for different providers
            this.transporter = nodemailer.createTransporter({
                service: 'gmail', // Can be changed to other services
                auth: {
                    user: process.env.EMAIL_USER || 'researchweek@dlsmhsi.edu.ph',
                    pass: process.env.EMAIL_PASS || 'your-app-password-here'
                }
            });

            // Verify connection configuration
            this.transporter.verify((error, success) => {
                if (error) {
                    console.log('⚠️  Email service not configured (this is optional)');
                    console.log('💡 Set EMAIL_USER and EMAIL_PASS environment variables to enable emails');
                    this.emailEnabled = false;
                } else {
                    console.log('✅ Email service is ready to send messages');
                    this.emailEnabled = true;
                }
            });
        } catch (error) {
            console.log('⚠️  Email service initialization skipped (nodemailer not configured)');
            console.log('💡 Registration will work without email notifications');
            this.emailEnabled = false;
        }
    }

    generateConfirmationEmail(registrationData) {
        const {
            full_name,
            email,
            affiliation,
            phone,
            research_interests,
            registration_date
        } = registrationData;

        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DLSMHSI Research Week 2025 - Registration Confirmation</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    padding: 0;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #1e4d2b 0%, #2d5a3d 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 10px 0 0 0;
                    opacity: 0.9;
                }
                .content {
                    padding: 30px;
                }
                .welcome {
                    background: #f8f9fa;
                    padding: 20px;
                    border-left: 4px solid #1e4d2b;
                    margin: 20px 0;
                }
                .details {
                    background: #fff;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .details h3 {
                    color: #1e4d2b;
                    margin-top: 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                .info-label {
                    font-weight: bold;
                    color: #1e4d2b;
                }
                .schedule {
                    background: #e8f5e8;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .day {
                    margin: 15px 0;
                    padding: 10px;
                    background: white;
                    border-radius: 5px;
                    border-left: 3px solid #1e4d2b;
                }
                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #1e4d2b, #2d5a3d);
                    color: white;
                    padding: 12px 25px;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .footer {
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    border-top: 1px solid #e9ecef;
                }
                .contact-info {
                    margin: 20px 0;
                    padding: 15px;
                    background: #fff;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>DLSMHSI Research Week 2025</h1>
                    <p>Expanding Horizons, Strengthening Research Excellence</p>
                </div>
                
                <div class="content">
                    <div class="welcome">
                        <h2>Welcome, ${full_name}! 🎉</h2>
                        <p>Thank you for registering for DLSMHSI Research Week 2025. We're excited to have you join us for this premier academic event.</p>
                    </div>

                    <div class="details">
                        <h3>📋 Your Registration Details</h3>
                        <div class="info-row">
                            <span class="info-label">Name:</span>
                            <span>${full_name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span>${email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Affiliation:</span>
                            <span>${affiliation}</span>
                        </div>
                        ${phone ? `
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span>${phone}</span>
                        </div>
                        ` : ''}
                        ${research_interests ? `
                        <div class="info-row">
                            <span class="info-label">Research Interests:</span>
                            <span>${research_interests}</span>
                        </div>
                        ` : ''}
                        <div class="info-row">
                            <span class="info-label">Registration Date:</span>
                            <span>${new Date(registration_date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div class="schedule">
                        <h3>📅 Event Schedule - November 10-14, 2025</h3>
                        <div class="day">
                            <strong>Day 1 (Nov 10):</strong> Opening Ceremonies & Keynote Speakers
                        </div>
                        <div class="day">
                            <strong>Day 2 (Nov 11):</strong> 18th Students' Research Contest
                        </div>
                        <div class="day">
                            <strong>Day 3 (Nov 12):</strong> Residents' Research Contest
                        </div>
                        <div class="day">
                            <strong>Day 4 (Nov 13):</strong> Faculty Research Forum
                        </div>
                        <div class="day">
                            <strong>Day 5 (Nov 14):</strong> Innovation Seminar & Culminating Activity
                        </div>
                    </div>

                    <div class="contact-info">
                        <h3>📍 Event Information</h3>
                        <p><strong>Venue:</strong> Villarosa Hall, DLSMHSI Angelo King Medical Center</p>
                        <p><strong>Address:</strong> Dasmariñas, Cavite, Philippines</p>
                        <p><strong>Website:</strong> <a href="https://dlsmhsiresearch2025.com">dlsmhsiresearch2025.com</a></p>
                    </div>

                    <div style="text-align: center;">
                        <a href="https://dlsmhsiresearch2025.com" class="btn">Visit Event Website</a>
                    </div>

                    <div class="welcome">
                        <h3>🎯 What to Expect</h3>
                        <ul>
                            <li>Inspiring keynote presentations</li>
                            <li>Cutting-edge research showcases</li>
                            <li>Networking opportunities</li>
                            <li>Innovation seminars and workshops</li>
                            <li>Certificate of participation</li>
                        </ul>
                    </div>

                    <div class="contact-info">
                        <h3>📞 Contact Information</h3>
                        <p><strong>Email:</strong> researchweek@dlsmhsi.edu.ph</p>
                        <p><strong>Phone:</strong> (046) 416-4341</p>
                        <p>For any questions or concerns, please don't hesitate to contact us.</p>
                    </div>
                </div>

                <div class="footer">
                    <p>© 2025 De La Salle Medical and Health Sciences Institute</p>
                    <p>This email was sent to ${email} regarding your registration for Research Week 2025.</p>
                    <p>Please save this email for your records.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        return {
            subject: '✅ DLSMHSI Research Week 2025 - Registration Confirmed',
            html: htmlTemplate,
            text: `
Dear ${full_name},

Thank you for registering for DLSMHSI Research Week 2025!

Event Details:
- Theme: Expanding Horizons, Strengthening Research Excellence
- Dates: November 10-14, 2025
- Venue: Villarosa Hall, DLSMHSI Angelo King Medical Center

Your Registration:
- Name: ${full_name}
- Email: ${email}
- Affiliation: ${affiliation}
${phone ? `- Phone: ${phone}` : ''}
${research_interests ? `- Research Interests: ${research_interests}` : ''}

We look forward to seeing you at this premier academic event!

Contact us: researchweek@dlsmhsi.edu.ph | (046) 416-4341
Website: https://dlsmhsiresearch2025.com

Best regards,
DLSMHSI Research Week 2025 Organizing Committee
            `
        };
    }

    async sendConfirmationEmail(registrationData) {
        if (!this.emailEnabled || !this.transporter) {
            console.log('📧 Email not sent (service not configured) - Registration still successful');
            return {
                success: false,
                error: 'Email service not configured'
            };
        }
        
        try {
            const emailContent = this.generateConfirmationEmail(registrationData);
            
            const mailOptions = {
                from: {
                    name: 'DLSMHSI Research Week 2025',
                    address: process.env.EMAIL_USER || 'researchweek@dlsmhsi.edu.ph'
                },
                to: registrationData.email,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            };

            const result = await this.transporter.sendMail(mailOptions);
            
            console.log(`✅ Confirmation email sent to ${registrationData.email}`);
            return {
                success: true,
                messageId: result.messageId,
                response: result.response
            };
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendAdminNotification(registrationData) {
        if (!this.emailEnabled || !this.transporter) {
            return { success: false, error: 'Email service not configured' };
        }
        
        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'researchweek@dlsmhsi.edu.ph';
            
            const mailOptions = {
                from: {
                    name: 'DLSMHSI Registration System',
                    address: process.env.EMAIL_USER || 'researchweek@dlsmhsi.edu.ph'
                },
                to: adminEmail,
                subject: `🆕 New Registration - DLSMHSI Research Week 2025`,
                html: `
                    <h2>New Registration Received</h2>
                    <p><strong>Name:</strong> ${registrationData.full_name}</p>
                    <p><strong>Email:</strong> ${registrationData.email}</p>
                    <p><strong>Affiliation:</strong> ${registrationData.affiliation}</p>
                    <p><strong>Phone:</strong> ${registrationData.phone || 'Not provided'}</p>
                    <p><strong>Research Interests:</strong> ${registrationData.research_interests || 'Not provided'}</p>
                    <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
                    
                    <p>Please review this registration in the admin dashboard.</p>
                `,
                text: `
New Registration for DLSMHSI Research Week 2025

Name: ${registrationData.full_name}
Email: ${registrationData.email}
Affiliation: ${registrationData.affiliation}
Phone: ${registrationData.phone || 'Not provided'}
Research Interests: ${registrationData.research_interests || 'Not provided'}
Registration Time: ${new Date().toLocaleString()}
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log(`📧 Admin notification sent for ${registrationData.full_name}`);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error sending admin notification:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = EmailService;