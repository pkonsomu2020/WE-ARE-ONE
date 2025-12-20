const activityLogService = require('../services/activityLogService');

/**
 * Activity Logger Middleware Factory
 * Creates middleware that logs admin actions after successful responses
 * 
 * @param {string} actionType - Type of action being logged (e.g., 'document_upload', 'feedback_response')
 * @param {Function} descriptionGenerator - Optional function to generate custom description from request
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.post('/upload', 
 *   enhancedAdminAuth, 
 *   activityLogger('document_upload'), 
 *   uploadController.upload
 * );
 * 
 * @example
 * router.post('/events', 
 *   enhancedAdminAuth, 
 *   activityLogger('event_created', (req) => `Created event: ${req.body.title}`), 
 *   eventController.create
 * );
 */
const activityLogger = (actionType, descriptionGenerator = null) => {
  return (req, res, next) => {
    // Store original res.json method
    const originalJson = res.json.bind(res);

    // Override res.json to log activity after successful response
    res.json = function(data) {
      // Only log if admin is authenticated and response is successful
      if (req.admin && res.statusCode >= 200 && res.statusCode < 400) {
        // Generate description
        let description = '';
        
        if (descriptionGenerator && typeof descriptionGenerator === 'function') {
          try {
            description = descriptionGenerator(req, data);
          } catch (error) {
            console.warn('⚠️ Description generator failed:', error.message);
            description = generateDefaultDescription(req, actionType);
          }
        } else {
          description = generateDefaultDescription(req, actionType);
        }

        // Get IP address (handle proxy scenarios)
        const ipAddress = req.ip || 
                         req.headers['x-forwarded-for']?.split(',')[0] || 
                         req.connection?.remoteAddress || 
                         'unknown';

        // Get user agent
        const userAgent = req.headers['user-agent'] || 'unknown';

        // Log activity asynchronously (non-blocking)
        activityLogService.logActivity({
          adminProfileId: req.admin.profileId,
          action: actionType,
          description: description,
          ipAddress: ipAddress,
          userAgent: userAgent
        }).catch(error => {
          // Log error but don't fail the request
          console.error('❌ Activity logging failed:', error.message);
          console.error('   Action:', actionType);
          console.error('   Admin:', req.admin.fullName);
        });
      }

      // Call original json method to send response
      return originalJson(data);
    };

    next();
  };
};

/**
 * Generate default description based on request and action type
 * @param {Object} req - Express request object
 * @param {string} actionType - Type of action
 * @returns {string} - Generated description
 */
function generateDefaultDescription(req, actionType) {
  const method = req.method;
  const path = req.path;
  const adminName = req.admin?.fullName || 'Admin';

  // Action-specific descriptions
  switch (actionType) {
    case 'document_upload':
      return `${adminName} uploaded a document`;
    
    case 'document_download':
      return `${adminName} downloaded a document`;
    
    case 'feedback_response':
      return `${adminName} responded to feedback`;
    
    case 'event_created':
      return `${adminName} created an event`;
    
    case 'event_updated':
      return `${adminName} updated an event`;
    
    case 'event_deleted':
      return `${adminName} deleted an event`;
    
    case 'admin_login':
      return `${adminName} logged in`;
    
    case 'admin_logout':
      return `${adminName} logged out`;
    
    default:
      return `${adminName} performed ${actionType} on ${method} ${path}`;
  }
}

/**
 * Helper function to create custom description generators
 */
const descriptionGenerators = {
  /**
   * Document upload description with filename
   */
  documentUpload: (req, data) => {
    const filename = req.file?.originalname || req.body?.filename || 'unknown file';
    return `${req.admin.fullName} uploaded document: ${filename}`;
  },

  /**
   * Document download description with filename
   */
  documentDownload: (req, data) => {
    const filename = data?.filename || req.params?.filename || 'unknown file';
    return `${req.admin.fullName} downloaded document: ${filename}`;
  },

  /**
   * Feedback response description with feedback ID
   */
  feedbackResponse: (req, data) => {
    const feedbackId = req.params?.id || req.body?.feedbackId || 'unknown';
    return `${req.admin.fullName} responded to feedback #${feedbackId}`;
  },

  /**
   * Event creation description with event title
   */
  eventCreated: (req, data) => {
    const title = req.body?.title || data?.title || 'Untitled Event';
    return `${req.admin.fullName} created event: ${title}`;
  },

  /**
   * Event update description with event title
   */
  eventUpdated: (req, data) => {
    const eventId = req.params?.id || 'unknown';
    const title = req.body?.title || data?.title || `Event #${eventId}`;
    return `${req.admin.fullName} updated event: ${title}`;
  },

  /**
   * Event deletion description
   */
  eventDeleted: (req, data) => {
    const eventId = req.params?.id || 'unknown';
    return `${req.admin.fullName} deleted event #${eventId}`;
  }
};

module.exports = activityLogger;
module.exports.descriptionGenerators = descriptionGenerators;
