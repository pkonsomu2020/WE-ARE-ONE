const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { pool } = require('../config/database');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Send welcome email to new user
const sendWelcomeEmail = async (userData) => {
  try {
    const welcomeEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .logo h1 { color: #ff6b35; font-size: 28px; margin: 0; }
          .welcome-text { margin-bottom: 20px; }
          .cta-button { display: inline-block; background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .signature { margin-top: 30px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1>We Are One (WAO)</h1>
        </div>
        
        <div class="welcome-text">
          <p>Hello <strong>${userData.full_name}</strong>,</p>
          
          <p>I'm part of the founding team at We Are One (WAO). We built this platform because we believe that mental health support should be accessible, compassionate, and community-driven.</p>
          
          <p>Today, hundreds of individuals trust WAO to provide them with the mental health resources and community support they need. Whether you're seeking your first support group, looking for professional resources, or wanting to connect with others who understand your journey, we've got your back.</p>
          
          <p><strong>👋 Not sure where to start?</strong></p>
          
          <p>Here are some ways to get the most out of your WAO experience:</p>
          
          <p>🌟 <strong>Explore our support categories:</strong> You've indicated interest in ${userData.support_categories ? userData.support_categories.join(', ') : 'mental health support'}. We have dedicated resources and community groups for each area.</p>
          
          <p>💬 <strong>Join our community discussions:</strong> Connect with others who share similar experiences and challenges.</p>
          
          <p>📚 <strong>Access our resource library:</strong> Find helpful articles, guides, and tools for your mental health journey.</p>
          
          <p>You'll hear from us periodically with helpful resources and community updates. In the meantime, don't hesitate to reach out if you need any assistance - we're here to support you.</p>
        </div>
        
        <div class="signature">
          <p>With support and understanding,<br>
          <strong>The We Are One Team</strong></p>
          
          <p><em>P.S. Remember, seeking support is a sign of strength, not weakness. You've taken an important step by joining our community.</em></p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${userData.email} because you recently created an account with We Are One.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userData.email,
      subject: 'Welcome to We Are One - Your Mental Health Support Community',
      html: welcomeEmailContent
    });

    console.log('✅ Welcome email sent successfully to:', userData.email);
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
  }
};

// Send email notification (without password)
const sendEmailNotification = async (userData) => {
  try {
    const supportCategories = userData.support_categories || [];
    const supportCategoriesText = supportCategories.length > 0 
      ? supportCategories.join(', ') 
      : 'None specified';

    const emailContent = `
      <h2>New User Registration</h2>
      <p><strong>Full Name:</strong> ${userData.full_name}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Phone:</strong> ${userData.phone}</p>
      <p><strong>Gender:</strong> ${userData.gender}</p>
      <p><strong>Age:</strong> ${userData.age}</p>
      <p><strong>Location:</strong> ${userData.location}</p>
      <p><strong>Support Categories:</strong> ${supportCategoriesText}</p>
      <p><strong>Personal Statement:</strong> ${userData.personal_statement || 'None provided'}</p>
      <p><strong>Emergency Contact:</strong> ${userData.emergency_contact_name} (${userData.emergency_contact_relationship}) - ${userData.emergency_contact_phone}</p>
      <p><strong>Live Location:</strong> ${userData.live_location || 'Not provided'}</p>
      <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'weareone0624@gmail.com',
      subject: 'New User Registration - We Are One NGO',
      html: emailContent
    });

    console.log('✅ Admin notification email sent successfully');
  } catch (error) {
    console.error('❌ Admin notification email failed:', error.message);
  }
};

// Register user
const register = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      fullName,
      email,
      phone,
      gender,
      age,
      location,
      password,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      liveLocation,
      personalStatement,
      supportCategories,
      otherSupportDetails
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [userResult] = await connection.execute(
      `INSERT INTO users (
        full_name, email, phone, gender, age, location, password_hash,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        live_location, personal_statement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName, email, phone, gender, parseInt(age), location, passwordHash,
        emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
        liveLocation, personalStatement
      ]
    );

    const userId = userResult.insertId;

    // Handle support categories
    if (supportCategories && Array.isArray(supportCategories)) {
      for (const category of supportCategories) {
        // Get category ID
        const [categoryResult] = await connection.execute(
          'SELECT id FROM support_categories WHERE name = ?',
          [category]
        );

        if (categoryResult.length > 0) {
          const categoryId = categoryResult[0].id;
          const otherDetails = category === 'Other' ? otherSupportDetails : null;

          await connection.execute(
            'INSERT INTO user_support_categories (user_id, support_category_id, other_details) VALUES (?, ?, ?)',
            [userId, categoryId, otherDetails]
          );
        }
      }
    }

    await connection.commit();

    // Generate JWT token
    const token = generateToken(userId);

    // Prepare email data
    const emailData = {
      full_name: fullName,
      email,
      phone,
      gender,
      age,
      location,
      support_categories: supportCategories,
      personal_statement: personalStatement,
      emergency_contact_name: emergencyContactName,
      emergency_contact_relationship: emergencyContactRelationship,
      emergency_contact_phone: emergencyContactPhone,
      live_location: liveLocation
    };
    
    // Send welcome email to user (async, don't wait)
    sendWelcomeEmail(emailData).catch(err => 
      console.error('Welcome email error:', err)
    );
    
    // Send admin notification email (async, don't wait)
    sendEmailNotification(emailData).catch(err => 
      console.error('Admin notification error:', err)
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: userId,
          fullName,
          email,
          phone
        },
        token
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      `SELECT 
        u.id, u.full_name, u.email, u.phone, u.gender, u.age, u.location,
        u.emergency_contact_name, u.emergency_contact_phone, u.emergency_contact_relationship,
        u.live_location, u.personal_statement, u.created_at
      FROM users u 
      WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get support categories
    const [supportCategories] = await pool.execute(
      `SELECT sc.name, usc.other_details 
       FROM user_support_categories usc
       JOIN support_categories sc ON usc.support_category_id = sc.id
       WHERE usc.user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        ...user,
        support_categories: supportCategories
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};