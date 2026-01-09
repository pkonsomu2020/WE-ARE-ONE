const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const crypto = require('crypto');
const { pool, supabase, ensureWarmConnection } = require('../config/database');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Test Resend connection on startup
const testResendConnection = async () => {
  try {
    console.log('🔍 Testing Resend email service...');
    // Resend doesn't have a direct test method, but we can check if API key is set
    if (process.env.RESEND_API_KEY) {
      console.log('✅ Resend API key configured');
      return true;
    } else {
      console.error('❌ Resend API key not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Resend service error:', error.message);
    return false;
  }
};

// Test connection immediately
testResendConnection();

// Optimized bcrypt with worker threads for better performance
const bcryptConfig = {
  saltRounds: 10, // Balanced security vs performance
  maxConcurrent: 2 // Limit concurrent bcrypt operations
};

let activeBcryptOperations = 0;

// Enhanced bcrypt with concurrency control
const hashPasswordAsync = async (password) => {
  // Wait if too many concurrent operations
  while (activeBcryptOperations >= bcryptConfig.maxConcurrent) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  activeBcryptOperations++;
  try {
    const hash = await bcrypt.hash(password, bcryptConfig.saltRounds);
    return hash;
  } finally {
    activeBcryptOperations--;
  }
};

const comparePasswordAsync = async (password, hash) => {
  // Wait if too many concurrent operations
  while (activeBcryptOperations >= bcryptConfig.maxConcurrent) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  activeBcryptOperations++;
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } finally {
    activeBcryptOperations--;
  }
};

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

// Send password reset email using Resend
const sendPasswordResetEmail = async (userEmail, resetToken, resetUrl) => {
  try {
    // TEMPORARY: Route all emails to verified address due to Resend testing restrictions
    const originalRecipient = userEmail;
    const actualRecipient = 'weareone0624@gmail.com'; // Only verified address that works
    
    console.log('📧 Preparing to send reset email via Resend to:', actualRecipient);
    console.log('⚠️ Original recipient:', originalRecipient, '(redirected due to testing mode)');
    
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
          .testing-notice { background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="testing-notice">
          <strong>🔧 TESTING MODE:</strong> This password reset email was intended for <strong>${originalRecipient}</strong> but redirected here due to email testing restrictions.
        </div>
        
        <div class="logo">
          <h1>We Are One (WAO)</h1>
        </div>
        
        <div class="reset-text">
          <p>Hello,</p>
          
          <p>We received a request to reset the password for the account: <strong>${originalRecipient}</strong></p>
          
          <p>To reset the password, click the button below:</p>
          
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
          <p>This email was intended for ${originalRecipient} for their We Are One account password reset.</p>
          <p>In testing mode, all emails are redirected to this verified address.</p>
        </div>
      </body>
      </html>
    `;

    console.log('📤 Sending email via Resend...');
    const startTime = Date.now();
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'We Are One Support <onboarding@resend.dev>',
      to: [actualRecipient],
      subject: `Password Reset for ${originalRecipient} - We Are One`,
      html: resetEmailContent,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return false;
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Password reset email sent successfully via Resend to: ${userEmail} (${duration}ms)`);
    console.log('📧 Email ID:', data.id);
    
    return true;
  } catch (error) {
    console.error('❌ Password reset email failed:', error.message);
    console.error('❌ Error details:', error);
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

    // Send welcome email using Resend (TEMPORARY: Route to verified address)
    const originalRecipient = userData.email;
    const actualRecipient = 'weareone0624@gmail.com';
    
    const { data, error } = await resend.emails.send({
      from: 'We Are One Support <onboarding@resend.dev>',
      to: [actualRecipient],
      subject: `Welcome Email for ${originalRecipient} - We Are One`,
      html: `
        <div style="background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>🔧 TESTING MODE:</strong> This welcome email was intended for <strong>${originalRecipient}</strong> but redirected here due to email testing restrictions.
        </div>
        ${welcomeEmailContent}
      `,
    });

    if (error) {
      console.error('❌ Welcome email failed:', error);
    } else {
      console.log('✅ Welcome email sent successfully to:', userData.email);
      console.log('📧 Email ID:', data.id);
    }
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

    // Send admin notification using Resend
    const { data, error } = await resend.emails.send({
      from: 'We Are One Support <onboarding@resend.dev>',
      to: ['weareone0624@gmail.com'],
      subject: 'New User Registration - We Are One NGO',
      html: emailContent,
    });

    if (error) {
      console.error('❌ Admin notification email failed:', error);
    } else {
      console.log('✅ Admin notification email sent successfully');
      console.log('📧 Email ID:', data.id);
    }
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

    console.log('🔍 Forgot password request for:', email);

    // Check if user exists using the existing pool wrapper
    const [users] = await pool.execute(
      'SELECT id, full_name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('⚠️ User not found for email:', email);
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const user = users[0];
    console.log('✅ User found:', user.id);

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour from now

    console.log('🔑 Generated reset token for user:', user.id);
    console.log('📅 Token expires at:', expiresAt.toISOString());

    // Store reset token in database using pool wrapper
    try {
      await pool.execute(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, resetToken, expiresAt]
      );
      console.log('✅ Reset token stored in database');
    } catch (dbError) {
      console.error('❌ Database error storing token:', dbError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to process request. Please try again.'
      });
    }

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://weareone.co.ke';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    console.log('🔗 Generated reset URL:', resetUrl);

    // Send reset email using Resend (much faster than SMTP)
    try {
      console.log('📧 Attempting to send reset email via Resend...');
      
      // Create a promise that will timeout after 3 seconds (Resend is fast)
      const emailPromise = sendPasswordResetEmail(user.email, resetToken, resetUrl);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout after 3 seconds')), 3000)
      );
      
      // Race between email sending and timeout
      const emailSent = await Promise.race([emailPromise, timeoutPromise]);
      
      if (emailSent) {
        console.log('✅ Reset email sent successfully via Resend');
      } else {
        console.log('❌ Email sending failed but continuing...');
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError.message);
      
      // FALLBACK: Log the reset URL for manual access (temporary solution)
      console.log('🔗 FALLBACK - Reset URL for manual access:', resetUrl);
      console.log('📧 Email that would have received the reset:', user.email);
      
      // Continue anyway - don't fail the request due to email issues
    }

    // Always return success - the reset token is stored in database
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
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

    console.log('🔍 Reset password attempt with token');

    // Find valid reset token using pool wrapper
    const [tokens] = await pool.execute(
      'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      console.log('❌ Invalid or expired reset token');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const resetToken = tokens[0];
    console.log('✅ Valid reset token found for user:', resetToken.user_id);

    // Hash new password with optimized bcrypt
    const passwordHash = await hashPasswordAsync(newPassword);

    // Update user password using pool wrapper
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, resetToken.user_id]
    );

    console.log('✅ Password updated successfully for user:', resetToken.user_id);

    // Delete used reset token
    await pool.execute(
      'DELETE FROM password_reset_tokens WHERE token = ?',
      [token]
    );

    console.log('✅ Reset token deleted');

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
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

    // Hash password with optimized bcrypt
    const passwordHash = await hashPasswordAsync(password);

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

// Login user with performance optimizations
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('🔐 Login attempt for:', email);
    const startTime = Date.now();

    // Ensure database connection is warm
    await ensureWarmConnection();

    // Find user by email with optimized query
    const [users] = await pool.execute(
      'SELECT id, full_name, email, phone, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];
    console.log('✅ User found, verifying password...');

    // Verify password with optimized bcrypt
    const isValidPassword = await comparePasswordAsync(password, user.password_hash);

    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    const duration = Date.now() - startTime;
    console.log(`✅ Login successful for ${email} in ${duration}ms`);

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
    console.error('❌ Login error:', error);
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

// Get reset token for testing (temporary endpoint)
const getResetToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists using pool wrapper
    const [users] = await pool.execute(
      'SELECT id, full_name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get the most recent valid reset token for this user using pool wrapper
    const [tokens] = await pool.execute(
      'SELECT token, expires_at FROM password_reset_tokens WHERE user_id = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (tokens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No valid reset token found. Please request a new password reset.'
      });
    }

    const resetToken = tokens[0];
    const frontendUrl = process.env.FRONTEND_URL || 'https://weareone.co.ke';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken.token}`;

    res.json({
      success: true,
      data: {
        resetUrl: resetUrl,
        expiresAt: resetToken.expires_at
      }
    });

  } catch (error) {
    console.error('Get reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reset token'
    });
  }
};

// Test email endpoint using Resend
const testEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log('🧪 Testing Resend email service to:', email);

    const testEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .logo h1 { color: #ff6b35; font-size: 28px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1>We Are One (WAO)</h1>
        </div>
        <h2>Email Service Test</h2>
        <p>This is a test email to verify that the Resend email service is working correctly.</p>
        <p>If you received this email, the email service is functioning properly!</p>
        <p>Time sent: ${new Date().toISOString()}</p>
        <p>Service: Resend</p>
      </body>
      </html>
    `;

    const startTime = Date.now();
    
    // Send test email using Resend
    const { data, error } = await resend.emails.send({
      from: 'We Are One Support <onboarding@resend.dev>',
      to: [email],
      subject: 'Email Service Test - We Are One',
      html: testEmailContent,
    });

    if (error) {
      console.error('❌ Resend test email error:', error);
      return res.status(500).json({
        success: false,
        message: 'Test email failed',
        error: error.message
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Test email sent successfully via Resend to: ${email} (${duration}ms)`);
    console.log('📧 Email ID:', data.id);

    res.json({
      success: true,
      message: 'Test email sent successfully via Resend',
      data: {
        emailId: data.id,
        duration: `${duration}ms`
      }
    });

  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  getResetToken,
  testEmail
};