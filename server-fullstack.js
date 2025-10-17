const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const Database = require('./database');
const EmailService = require('./email');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const db = new Database();
const emailService = new EmailService();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:3000", "http://localhost:*"],
            frameSrc: ["'self'", "https://www.google.com"]
        }
    }
}));

// Rate limiting
const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 registration attempts per windowMs
    message: {
        error: 'Too many registration attempts. Please try again later.',
        retryAfter: '15 minutes'
    }
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/register', registrationLimiter);
app.use(generalLimiter);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true
}));

// API Routes

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, affiliation, phone, interests, selectedDays } = req.body;

        // Validation
        if (!fullName || !email || !affiliation) {
            return res.status(400).json({
                success: false,
                error: 'Full name, email, and affiliation are required'
            });
        }

        // Validate at least one day is selected
        if (!selectedDays || !Array.isArray(selectedDays) || selectedDays.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please select at least one day to attend'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }

        // Check if registration exists
        const existingRegistration = await db.getRegistrationByEmail(email);
        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                error: 'This email is already registered'
            });
        }

        // Create registration with day selections
        const registrationData = {
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            affiliation: affiliation.trim(),
            phone: phone ? phone.trim() : null,
            researchInterests: interests ? interests.trim() : null,
            day1: selectedDays.includes('day1'),
            day2: selectedDays.includes('day2'),
            day3: selectedDays.includes('day3'),
            day4: selectedDays.includes('day4'),
            day5: selectedDays.includes('day5')
        };

        const result = await db.createRegistration(registrationData);
        
        // Get complete registration data for email
        const completeRegistration = await db.getRegistration(result.id);
        
        // Send confirmation email with selected days
        const emailResult = await emailService.sendConfirmationEmail({
            ...registrationData,
            full_name: registrationData.fullName,
            research_interests: registrationData.researchInterests,
            registration_date: completeRegistration.registration_date,
            selectedDays: selectedDays
        });

        // Send admin notification
        emailService.sendAdminNotification({
            ...registrationData,
            full_name: registrationData.fullName,
            research_interests: registrationData.researchInterests,
            selectedDays: selectedDays
        });

        // Update email sent status
        if (emailResult.success) {
            await db.updateEmailSent(result.id);
            await db.logEmail(result.id, 'confirmation', email, 'sent');
        } else {
            await db.logEmail(result.id, 'confirmation', email, 'failed', emailResult.error);
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email for confirmation.',
            registrationId: result.id,
            emailSent: emailResult.success
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Registration failed. Please try again.'
        });
    }
});

// Check registration status
app.get('/api/registration/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const registration = await db.getRegistrationByEmail(email);
        
        if (!registration) {
            return res.status(404).json({
                success: false,
                error: 'Registration not found'
            });
        }

        // Format selected days
        const selectedDays = [];
        if (registration.day1) selectedDays.push('Day 1 - Nov 10');
        if (registration.day2) selectedDays.push('Day 2 - Nov 11');
        if (registration.day3) selectedDays.push('Day 3 - Nov 12');
        if (registration.day4) selectedDays.push('Day 4 - Nov 13');
        if (registration.day5) selectedDays.push('Day 5 - Nov 14');

        res.json({
            success: true,
            registration: {
                id: registration.id,
                fullName: registration.full_name,
                email: registration.email,
                affiliation: registration.affiliation,
                registrationDate: registration.registration_date,
                emailSent: registration.email_sent,
                selectedDays: selectedDays
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch registration'
        });
    }
});

// Admin dashboard endpoint (basic authentication needed in production)
app.get('/api/admin/registrations', async (req, res) => {
    try {
        // In production, add authentication middleware here
        const registrations = await db.getAllRegistrations();
        const stats = await db.getRegistrationStats();
        
        res.json({
            success: true,
            registrations,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch registrations'
        });
    }
});

// Registration statistics endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await db.getRegistrationStats();
        res.json({
            success: true,
            stats: {
                total: stats.total,
                today: stats.today,
                emailsSent: stats.emailsSent,
                byAffiliation: stats.byAffiliation,
                byDay: {
                    day1: stats.day1,
                    day2: stats.day2,
                    day3: stats.day3,
                    day4: stats.day4,
                    day5: stats.day5
                }
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

// Get day-specific registrations
app.get('/api/day/:dayNumber', async (req, res) => {
    try {
        const { dayNumber } = req.params;
        const day = parseInt(dayNumber);
        
        if (day < 1 || day > 5) {
            return res.status(400).json({
                success: false,
                error: 'Invalid day number. Must be between 1 and 5.'
            });
        }
        
        const registrations = await db.getDayRegistrations(day);
        res.json({
            success: true,
            day: day,
            count: registrations.length,
            registrations
        });
    } catch (error) {
        console.error('Day registrations error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch day registrations'
        });
    }
});

// Update registration status
app.put('/api/registration/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        
        const validStatuses = ['active', 'cancelled', 'waitlist', 'confirmed', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }
        
        await db.updateRegistrationStatus(id, status, notes);
        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update status'
        });
    }
});

// Update payment status
app.put('/api/registration/:id/payment', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'paid', 'refunded', 'waived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment status'
            });
        }
        
        await db.updatePaymentStatus(id, status);
        res.json({
            success: true,
            message: 'Payment status updated successfully'
        });
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update payment status'
        });
    }
});

// Get registrations by status
app.get('/api/registrations/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const registrations = await db.getRegistrationsByStatus(status);
        res.json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (error) {
        console.error('Get by status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch registrations by status'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve admin dashboard (MUST be before catch-all route)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access'
        });
    }
    
    // Default error
    res.status(500).json({
        success: false,
        error: 'Internal server error. Please try again later.'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Received SIGTERM, shutting down gracefully');
    db.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 Received SIGINT, shutting down gracefully');
    db.close();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log('🌐 DLSMHSI Research Week 2025 - Full Stack Server');
    console.log('=' .repeat(60));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Website: http://localhost:${PORT}`);
    console.log(`👨‍💼 Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log(`🔌 API Health Check: http://localhost:${PORT}/api/health`);
    console.log('=' .repeat(60));
    console.log('🗄️  Database: SQLite (registrations.db)');
    console.log('📧 Email Service: NodeMailer configured');
    console.log('🔒 Security: Helmet, Rate Limiting, CORS enabled');
    console.log('📊 Features: Registration tracking, Email automation');
    console.log('💾 Status Tracking: Active, Cancelled, Waitlist, Confirmed, Completed');
    console.log('=' .repeat(60));
    console.log('🎯 Ready for production deployment!');
    console.log('💡 Set EMAIL_USER and EMAIL_PASS environment variables for email');
    console.log('=' .repeat(60));
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port or stop the other process.`);
        console.error('💡 Try: netstat -ano | findstr :3000');
    } else {
        console.error('❌ Server error:', err);
    }
    process.exit(1);
});

module.exports = app;