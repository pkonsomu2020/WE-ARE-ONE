const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { pool, supabase } = require('../config/database');

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

// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken, resetUrl) => {
  try {
    const resetEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .logo h1 { color: #ff6b35; font-size: 28px; margin: 0; }
          .reset-text { margin-bottom: 20px; }
          .cta-button { display: inline-block; background-color: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .signature { margin-top: 30px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1>We Are One (WAO)</h1>
        </div>
        
        <div class="reset-text">
          <p>Hello,</p>
          
          <p>We received a request to reset your password for your We Are One account. If you didn't make this request, you can safely ignore this email.</p>
          
          <p>To reset your password, click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="cta-button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        </div>
        
        <div class="signature">
          <p>With support and understanding,<br>
          <strong>The We Are One Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${userEmail} because you requested a password reset for your We Are One account.</p>
          <p>If you didn't request this reset, please ignore this email or contact us if you have concerns.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Reset Your Password - We Are One',
      html: resetEmailContent
    });

    console.log('✅ Password reset email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Password reset email failed:', error.message);
    return false;
  }
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

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id, full_name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token in database
    await pool.execute(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, resetToken, expiresAt]
    );

    // Create reset URL - prefer env, fall back to production domain in prod
    const frontendUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://weareone.co.ke'
        : 'http://localhost:8080');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    // Enhanced debug logging
    console.log('🔍 DEBUG INFO:');
    console.log('🌐 process.env.FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('🌐 process.env.NODE_ENV:', process.env.NODE_ENV);
    console.log('🌐 frontendUrl variable:', frontendUrl);
    console.log('🔗 Generated reset URL:', resetUrl);
    console.log('📧 Sending reset email to:', user.email);
    console.log('📅 Token expires at:', expiresAt);

    // Send reset email
    const emailSent = await sendPasswordResetEmail(user.email, resetToken, resetUrl);

    if (emailSent) {
      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request. Please try again.'
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find valid reset token
    const [tokens] = await pool.execute(
      'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const resetToken = tokens[0];

    // Hash new password with optimized rounds
    const saltRounds = 10; // Reduced from 12 to 10 for better performance
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, resetToken.user_id]
    );

    // Delete used reset token
    await pool.execute(
      'DELETE FROM password_reset_tokens WHERE token = ?',
      [token]
    );

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.'
    });
  }
};

// Register user
const register = async (req, res) => {
  try {
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

    console.log('📝 Registration attempt for:', email);

    // Check if user already exists using direct Supabase query for better performance
    const { data: emailCheck, error: emailError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    const { data: phoneCheck, error: phoneError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .limit(1);

    if (emailError || phoneError) {
      console.error('❌ Error checking existing users:', emailError?.message || phoneError?.message);
      return res.status(500).json({
        success: false,
        message: 'Registration failed due to database error'
      });
    }

    if (emailCheck.length > 0 || phoneCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Hash password with optimized rounds for better performance
    const saltRounds = 10; // Reduced from 12 to 10 for better performance while maintaining security
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user with Supabase (sequence is now fixed)
    const { data: userResult, error: userError } = await supabase
      .from('users')
      .insert({
        full_name: fullName,
        email: email,
        phone: phone,
        gender: gender,
        age: parseInt(age),
        location: location,
        password_hash: passwordHash,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        emergency_contact_relationship: emergencyContactRelationship,
        live_location: liveLocation,
        personal_statement: personalStatement
      })
      .select();

    if (userError) {
      console.error('❌ User insert error:', userError.message);
      
      // Handle specific database errors
      if (userError.message.includes('duplicate key')) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or phone already exists'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }

    const userId = userResult[0].id;
    console.log('✅ User created with ID:', userId);

    // Handle support categories
    if (supportCategories && Array.isArray(supportCategories)) {
      for (const category of supportCategories) {
        try {
          // Get category ID
          const { data: categoryResult, error: catError } = await supabase
            .from('support_categories')
            .select('id')
            .eq('name', category)
            .limit(1);

          if (catError) {
            console.error('❌ Category lookup error:', catError.message);
            continue; // Skip this category but don't fail the registration
          }

          if (categoryResult.length > 0) {
            const categoryId = categoryResult[0].id;
            const otherDetails = category === 'Other' ? otherSupportDetails : null;

            const { error: relError } = await supabase
              .from('user_support_categories')
              .insert({
                user_id: userId,
                support_category_id: categoryId,
                other_details: otherDetails
              });

            if (relError) {
              console.error('❌ Support category relationship error:', relError.message);
              // Don't fail registration for this
            }
          }
        } catch (error) {
          console.error('❌ Support category processing error:', error.message);
          // Continue with registration even if support categories fail
        }
      }
    }

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

    console.log('✅ Registration successful for user ID:', userId);

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
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
  getProfile,
  forgotPassword,
  resetPassword
};