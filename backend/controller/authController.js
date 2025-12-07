const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Signup Controller
exports.signup = async (req, res) => {
    const { hospitalName, hospitalAddress, firstName, lastName, email, password } = req.body;

    try {
        // Validate input
        if (!hospitalName || !hospitalAddress || !firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await db.query(
            `INSERT INTO users (hospital_name, hospital_address, first_name, last_name, email, password_hash, role) 
             VALUES (?, ?, ?, ?, ?, ?, 'manager')`,
            [hospitalName, hospitalAddress, firstName, lastName, email, passwordHash]
        );

        // Log the signup action
        await db.query(
            'INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
            [result.insertId, 'SIGNUP', req.ip]
        );

        res.status(201).json({
            message: 'Account created successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const [users] = await db.query(
            'SELECT id, hospital_name, first_name, last_name, email, password_hash, role, is_active FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Check if account is active
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is deactivated. Contact support.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Update last login
        await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        // Save session token (optional)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await db.query(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, token, expiresAt]
        );

        // Log the login action
        await db.query(
            'INSERT INTO audit_logs (user_id, action, ip_address, user_agent) VALUES (?, ?, ?, ?)',
            [user.id, 'LOGIN', req.ip, req.get('User-Agent')]
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                hospitalName: user.hospital_name,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Logout Controller
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            // Delete session token
            await db.query('DELETE FROM sessions WHERE token = ?', [token]);

            // Log the logout action
            if (req.user) {
                await db.query(
                    'INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
                    [req.user.userId, 'LOGOUT', req.ip]
                );
            }
        }

        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

// Get Current User Profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, hospital_name, hospital_address, first_name, last_name, email, role, created_at, last_login FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: users[0] });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};