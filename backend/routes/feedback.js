const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// Get current admin profile info (simplified - no database queries)
router.get('/admin-profile', authenticateAdmin, async (req, res) => {
  try {
    // Return admin info from environment or JWT
    const profileData = {
      id: req.admin?.id || 1,
      fullName: process.env.ADMIN_DEFAULT_NAME || 'WAO Admin',
      email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@weareone.co.ke',
      phone: '+254712345678',
      role: 'Super Admin',
      status: 'active'
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile'
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

    // Build query with reply information
    let query = supabase
      .from('feedback_messages')
      .select(`
        *,
        feedback_replies (
          id,
          created_at,
          admin_profile_id,
          admin_profiles (
            full_name,
            email,
            role
          )
        )
      `);

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

    const { data: messages, error, count } = await query;

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

    // Format messages with replies information
    const formattedMessages = (messages || []).map(message => {
      const replies = message.feedback_replies || [];
      const repliesCount = replies.length;
      
      // Get the latest reply
      const latestReply = replies.length > 0 
        ? replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;

      return {
        ...message,
        replies_count: repliesCount,
        last_reply_by: latestReply?.admin_profiles?.full_name || null,
        last_reply_at: latestReply?.created_at || null
      };
    });

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
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    // Get admin profile information for the reply
    let adminProfileId = null;
    let responderName = 'Admin';
    let responderEmail = '';
    let responderRole = 'Admin';

    // Try to get admin profile from token or admin key
    if (req.admin && req.admin.id) {
      adminProfileId = req.admin.id;
      
      // Get admin profile details
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('id, full_name, email, role')
        .eq('id', req.admin.id)
        .single();

      if (!profileError && adminProfile) {
        responderName = adminProfile.full_name || 'Admin';
        responderEmail = adminProfile.email || '';
        responderRole = adminProfile.role || 'Admin';
      }
    }

    const { data, error } = await supabase
      .from('feedback_replies')
      .insert({
        message_id: messageId,
        admin_profile_id: adminProfileId,
        reply_text: replyText
      })
      .select();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: { 
        id: data[0].id,
        responder_name: responderName,
        responder_email: responderEmail,
        responder_role: responderRole
      }
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ success: false, message: 'Failed to add reply' });
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

    // Get replies for this message with admin profile information
    const { data: replies, error: repliesError } = await supabase
      .from('feedback_replies')
      .select(`
        *,
        admin_profiles (
          id,
          full_name,
          email,
          role
        )
      `)
      .eq('message_id', messageId)
      .order('created_at', { ascending: true });

    if (repliesError) {
      throw repliesError;
    }

    // Format replies with admin profile information
    const formattedReplies = (replies || []).map(reply => ({
      ...reply,
      responder_name: reply.admin_profiles?.full_name || 'Admin',
      responder_email: reply.admin_profiles?.email || '',
      responder_role: reply.admin_profiles?.role || 'Admin',
      admin_name: reply.admin_profiles?.full_name || 'Admin'
    }));

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
