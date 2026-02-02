const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// Get current admin profile info with real phone numbers
router.get('/admin-profile', authenticateAdmin, async (req, res) => {
  try {
    const adminId = req.adminId || req.admin?.id;
    
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID not found'
      });
    }

    // Get admin profile from admin_profiles table using Supabase
    const { data: adminProfiles, error: profileError } = await supabase
      .from('admin_profiles')
      .select('id, full_name, email, phone_number, role, status')
      .eq('user_id', adminId)
      .eq('status', 'active')
      .single();

    if (profileError || !adminProfiles) {
      // Fallback to admin_users table if admin_profiles doesn't have the record
      const { data: adminUsers, error: userError } = await supabase
        .from('admin_users')
        .select('id, full_name, email')
        .eq('id', adminId)
        .single();

      if (userError || !adminUsers) {
        return res.status(404).json({
          success: false,
          message: 'Admin profile not found'
        });
      }

      // Return basic admin info with access control
      const profileData = {
        id: adminUsers.id,
        fullName: adminUsers.full_name,
        email: adminUsers.email,
        phone: adminUsers.email === 'admin@weareone.co.ke' ? '+254745343256' : '+254700000000',
        role: 'Super Admin',
        status: 'active',
        // Orders access control - only allow Peter Onsomu and Eltone Cruzz
        canAccessOrders: adminUsers.full_name === 'Peter Onsomu' || 
                        adminUsers.full_name === 'Eltone Cruzz' ||
                        adminUsers.email === 'admin@weareone.co.ke', // Super Admin always has access
        canAccessSettings: true // All admins can access settings
      };

      return res.json({
        success: true,
        data: profileData
      });
    }

    // Check orders access for specific users from admin_profiles
    const canAccessOrders = adminProfiles.full_name === 'Peter Onsomu' || 
                           adminProfiles.full_name === 'Eltone Cruzz' ||
                           adminProfiles.role === 'Super Admin' ||
                           adminProfiles.email === 'admin@weareone.co.ke';

    // Return full admin profile data with access control
    const profileData = {
      id: adminProfiles.id,
      fullName: adminProfiles.full_name,
      email: adminProfiles.email,
      phone: adminProfiles.phone_number,
      role: adminProfiles.role || 'Admin',
      status: adminProfiles.status,
      canAccessOrders: canAccessOrders,
      canAccessSettings: true // All admins can access settings
    };

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all feedback messages with pagination and filtering
router.get('/messages', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search;

    // Build basic query first
    let query = supabase
      .from('feedback_messages')
      .select('*');

    // Add filters
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    if (search) {
      query = query.or(`subject.ilike.%${search}%,message.ilike.%${search}%,name.ilike.%${search}%`);
    }

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: messages, error } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    let totalQuery = supabase
      .from('feedback_messages')
      .select('*', { count: 'exact', head: true });

    // Apply same filters for count
    if (type && type !== 'all') {
      totalQuery = totalQuery.eq('type', type);
    }
    if (status && status !== 'all') {
      totalQuery = totalQuery.eq('status', status);
    }
    if (priority && priority !== 'all') {
      totalQuery = totalQuery.eq('priority', priority);
    }
    if (search) {
      totalQuery = totalQuery.or(`subject.ilike.%${search}%,message.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { count: total } = await totalQuery;

    // For now, return messages without reply information to avoid complex queries
    // Reply information will be loaded when viewing individual messages
    const formattedMessages = (messages || []).map(message => ({
      ...message,
      replies_count: 0, // Will be populated when needed
      last_reply_by: null,
      last_reply_at: null
    }));

    res.json({
      success: true,
      data: {
        messages: formattedMessages,
        pagination: {
          page,
          limit,
          total: total || 0,
          pages: Math.ceil((total || 0) / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Create new feedback message
router.post('/messages', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, type, priority, subject, message } = req.body;

    console.log('Received feedback message data:', { name, email, phone, type, priority, subject, message });

    // Validate required fields
    if (!name || !email || !phone || !type || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate enum values (based on your schema)
    const validTypes = ['complaint', 'suggestion', 'announcement'];
    const validPriorities = ['low', 'medium', 'high'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid type. Must be: complaint, suggestion, or announcement' 
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid priority. Must be: low, medium, or high' 
      });
    }

    const insertData = {
      name,
      email,
      phone,
      type,
      priority: priority || 'medium',
      subject,
      message
    };

    console.log('Inserting data:', insertData);

    const { data, error } = await supabase
      .from('feedback_messages')
      .insert(insertData)
      .select('id')
      .single();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database error: ' + error.message,
        error: error
      });
    }

    console.log('Feedback message created successfully:', data);

    res.status(201).json({
      success: true,
      message: 'Feedback message created successfully',
      data: { id: data?.id || null }
    });
  } catch (error) {
    console.error('Error creating feedback message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create feedback message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update message status
router.put('/messages/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { status, assignedTo } = req.body;

    // Validate status enum
    const validStatuses = ['new', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be: new, in_progress, or resolved' 
      });
    }

    const { error } = await supabase
      .from('feedback_messages')
      .update({ 
        status, 
        assigned_to: assignedTo || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Message status updated successfully'
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, message: 'Failed to update message status' });
  }
});

// Update message priority
router.put('/messages/:id/priority', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { priority } = req.body;

    // Validate priority enum
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid priority. Must be: low, medium, or high' 
      });
    }

    const { error } = await supabase
      .from('feedback_messages')
      .update({ 
        priority,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Message priority updated successfully'
    });
  } catch (error) {
    console.error('Error updating message priority:', error);
    res.status(500).json({ success: false, message: 'Failed to update message priority' });
  }
});

// Add reply to message
router.post('/messages/:id/replies', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { replyText, message } = req.body;
    
    // Accept both 'replyText' and 'message' for flexibility
    const replyContent = replyText || message;

    if (!replyContent || replyContent.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Reply text is required',
        debug: { receivedBody: req.body, messageId }
      });
    }

    // Get admin profile information for the reply
    const adminId = req.adminId || req.admin?.id;
    let adminInfo = { name: 'Admin', email: '', role: 'Admin' };

    if (adminId) {
      // Try to get admin profile from admin_profiles table
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('full_name, email, role')
        .eq('user_id', adminId)
        .eq('status', 'active')
        .single();

      if (!profileError && adminProfile) {
        adminInfo = {
          name: adminProfile.full_name,
          email: adminProfile.email,
          role: adminProfile.role
        };
      } else {
        // Fallback to admin_users table
        const { data: adminUser, error: userError } = await supabase
          .from('admin_users')
          .select('full_name, email')
          .eq('id', adminId)
          .single();

        if (!userError && adminUser) {
          adminInfo = {
            name: adminUser.full_name,
            email: adminUser.email,
            role: adminUser.email === 'admin@weareone.co.ke' ? 'Super Admin' : 'Admin'
          };
        }
      }
    }

    // Insert reply with admin profile information
    const { data, error } = await supabase
      .from('feedback_replies')
      .insert({
        message_id: parseInt(messageId),
        admin_profile_id: adminId,
        reply_text: replyContent.trim()
      })
      .select();

    if (error) {
      console.error('Supabase error creating reply:', error);
      throw error;
    }

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: { 
        id: data[0].id,
        responder_name: adminInfo.name,
        responder_email: adminInfo.email,
        responder_role: adminInfo.role
      }
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get feedback statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Get all messages for statistics
    const { data: messages, error } = await supabase
      .from('feedback_messages')
      .select('type, status, priority');

    if (error) {
      throw error;
    }

    const totalMessages = messages ? messages.length : 0;

    // Calculate statistics
    const byStatus = ['new', 'in_progress', 'resolved'].map(status => ({
      status,
      count: messages ? messages.filter(m => m.status === status).length : 0
    }));

    const byType = ['complaint', 'suggestion', 'announcement'].map(type => ({
      type,
      count: messages ? messages.filter(m => m.type === type).length : 0
    }));

    const byPriority = ['low', 'medium', 'high'].map(priority => ({
      priority,
      count: messages ? messages.filter(m => m.priority === priority).length : 0
    }));

    res.json({
      success: true,
      data: {
        totalMessages,
        byStatus,
        byType,
        byPriority
      }
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// Get single message with replies
router.get('/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;

    // Get the message
    const { data: message, error: messageError } = await supabase
      .from('feedback_messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError) {
      throw messageError;
    }

    // Get replies for this message (simplified - no joins)
    const { data: replies, error: repliesError } = await supabase
      .from('feedback_replies')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true });

    if (repliesError) {
      throw repliesError;
    }

    // Format replies with real admin info
    const formattedReplies = [];
    
    for (const reply of replies || []) {
      let adminInfo = { name: 'Admin', email: '', role: 'Admin' };
      
      if (reply.admin_profile_id) {
        // Get admin profile information
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('full_name, email, role')
          .eq('user_id', reply.admin_profile_id)
          .eq('status', 'active')
          .single();

        if (!profileError && adminProfile) {
          adminInfo = {
            name: adminProfile.full_name,
            email: adminProfile.email,
            role: adminProfile.role
          };
        } else {
          // Fallback to admin_users table
          const { data: adminUser, error: userError } = await supabase
            .from('admin_users')
            .select('full_name, email')
            .eq('id', reply.admin_profile_id)
            .single();

          if (!userError && adminUser) {
            adminInfo = {
              name: adminUser.full_name,
              email: adminUser.email,
              role: adminUser.email === 'admin@weareone.co.ke' ? 'Super Admin' : 'Admin'
            };
          }
        }
      }
      
      formattedReplies.push({
        ...reply,
        responder_name: adminInfo.name,
        responder_email: adminInfo.email,
        responder_role: adminInfo.role,
        admin_name: adminInfo.name
      });
    }

    res.json({
      success: true,
      data: {
        message,
        replies: formattedReplies
      }
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch message' });
  }
});

// Delete message
router.delete('/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;

    const { error } = await supabase
      .from('feedback_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

module.exports = router;
