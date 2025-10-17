const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'registrations.db');
        this.db = new sqlite3.Database(this.dbPath);
        this.initializeTables();
    }

    initializeTables() {
        // Create registrations table with enhanced status tracking
        const createRegistrationsTable = `
            CREATE TABLE IF NOT EXISTS registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                affiliation TEXT NOT NULL,
                phone TEXT,
                research_interests TEXT,
                day1 BOOLEAN DEFAULT FALSE,
                day2 BOOLEAN DEFAULT FALSE,
                day3 BOOLEAN DEFAULT FALSE,
                day4 BOOLEAN DEFAULT FALSE,
                day5 BOOLEAN DEFAULT FALSE,
                registration_status TEXT DEFAULT 'active',
                payment_status TEXT DEFAULT 'pending',
                registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                email_sent BOOLEAN DEFAULT FALSE,
                email_sent_date DATETIME,
                attendance_confirmed BOOLEAN DEFAULT FALSE,
                last_login DATETIME,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create email_logs table for tracking
        const createEmailLogsTable = `
            CREATE TABLE IF NOT EXISTS email_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                registration_id INTEGER,
                email_type TEXT NOT NULL,
                sent_to TEXT NOT NULL,
                sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'sent',
                error_message TEXT,
                FOREIGN KEY (registration_id) REFERENCES registrations(id)
            )
        `;

        // Create admin_settings table
        const createAdminSettingsTable = `
            CREATE TABLE IF NOT EXISTS admin_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.serialize(() => {
            this.db.run(createRegistrationsTable);
            this.db.run(createEmailLogsTable);
            this.db.run(createAdminSettingsTable);
            
            // Insert default admin settings
            const defaultSettings = [
                ['event_name', 'DLSMHSI Research Week 2025'],
                ['event_date', 'November 10-14, 2025'],
                ['event_venue', 'Villarosa Hall, DLSMHSI Angelo King Medical Center'],
                ['admin_email', 'researchweek@dlsmhsi.edu.ph'],
                ['max_registrations', '500'],
                ['registration_open', 'true']
            ];

            const insertSetting = this.db.prepare(`
                INSERT OR IGNORE INTO admin_settings (setting_key, setting_value) 
                VALUES (?, ?)
            `);

            defaultSettings.forEach(([key, value]) => {
                insertSetting.run(key, value);
            });

            insertSetting.finalize();
        });

        console.log('✅ Database tables initialized successfully');
    }

    // Registration methods
    async createRegistration(registrationData) {
        return new Promise((resolve, reject) => {
            const {
                fullName,
                email,
                affiliation,
                phone,
                researchInterests,
                day1,
                day2,
                day3,
                day4,
                day5
            } = registrationData;

            const insertQuery = `
                INSERT INTO registrations 
                (full_name, email, affiliation, phone, research_interests, day1, day2, day3, day4, day5)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.run(insertQuery, [
                fullName, email, affiliation, phone, researchInterests,
                day1 ? 1 : 0, day2 ? 1 : 0, day3 ? 1 : 0, day4 ? 1 : 0, day5 ? 1 : 0
            ], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Email already registered'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({
                        id: this.lastID,
                        message: 'Registration successful'
                    });
                }
            });
        });
    }

    async getRegistration(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM registrations WHERE id = ?';
            this.db.get(query, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async getRegistrationByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM registrations WHERE email = ?';
            this.db.get(query, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async getAllRegistrations() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    id, full_name, email, affiliation, phone, 
                    research_interests, day1, day2, day3, day4, day5,
                    registration_status, payment_status,
                    registration_date, email_sent, attendance_confirmed,
                    notes
                FROM registrations 
                ORDER BY registration_date DESC
            `;
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async updateEmailSent(registrationId) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE registrations 
                SET email_sent = TRUE, email_sent_date = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            this.db.run(query, [registrationId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // Email logging methods
    async logEmail(registrationId, emailType, sentTo, status = 'sent', errorMessage = null) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO email_logs 
                (registration_id, email_type, sent_to, status, error_message)
                VALUES (?, ?, ?, ?, ?)
            `;
            this.db.run(query, [registrationId, emailType, sentTo, status, errorMessage], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    // Statistics methods
    async getRegistrationStats() {
        return new Promise((resolve, reject) => {
            const queries = {
                total: 'SELECT COUNT(*) as count FROM registrations',
                today: `SELECT COUNT(*) as count FROM registrations 
                       WHERE DATE(registration_date) = DATE('now')`,
                emailsSent: 'SELECT COUNT(*) as count FROM registrations WHERE email_sent = TRUE',
                byAffiliation: `SELECT affiliation, COUNT(*) as count 
                               FROM registrations 
                               GROUP BY affiliation 
                               ORDER BY count DESC`,
                day1: 'SELECT COUNT(*) as count FROM registrations WHERE day1 = TRUE',
                day2: 'SELECT COUNT(*) as count FROM registrations WHERE day2 = TRUE',
                day3: 'SELECT COUNT(*) as count FROM registrations WHERE day3 = TRUE',
                day4: 'SELECT COUNT(*) as count FROM registrations WHERE day4 = TRUE',
                day5: 'SELECT COUNT(*) as count FROM registrations WHERE day5 = TRUE'
            };

            const stats = {};
            let completed = 0;
            const total = Object.keys(queries).length;

            Object.entries(queries).forEach(([key, query]) => {
                if (key === 'byAffiliation') {
                    this.db.all(query, [], (err, rows) => {
                        if (err) reject(err);
                        else {
                            stats[key] = rows;
                            completed++;
                            if (completed === total) resolve(stats);
                        }
                    });
                } else {
                    this.db.get(query, [], (err, row) => {
                        if (err) reject(err);
                        else {
                            stats[key] = row.count;
                            completed++;
                            if (completed === total) resolve(stats);
                        }
                    });
                }
            });
        });
    }

    // Get day-specific registrations
    async getDayRegistrations(day) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, full_name, email, affiliation 
                FROM registrations 
                WHERE day${day} = TRUE 
                ORDER BY registration_date DESC
            `;
            this.db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Update registration status
    async updateRegistrationStatus(id, status, notes = null) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE registrations 
                SET registration_status = ?, 
                    notes = COALESCE(?, notes),
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            this.db.run(query, [status, notes, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // Update payment status
    async updatePaymentStatus(id, status) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE registrations 
                SET payment_status = ?,
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            this.db.run(query, [status, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // Get registrations by status
    async getRegistrationsByStatus(status) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM registrations 
                WHERE registration_status = ? 
                ORDER BY registration_date DESC
            `;
            this.db.all(query, [status], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Close database connection
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

module.exports = Database;