import { useState, useEffect } from 'react';
import { feedbackAPI, FeedbackMessage, AdminProfile, FeedbackReply } from '@/lib/feedbackApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Reply,
  Clock,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Send,
  Eye,
  MoreVertical
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'complaint' | 'suggestion' | 'announcement';
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'resolved';
  subject: string;
  message: string;
  submittedAt: string;
  submittedBy: string;
  assignedTo?: string;
  replies: number;
}

const FeedbackCenterPage = () => {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [newMessage, setNewMessage] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'suggestion' as 'complaint' | 'suggestion' | 'announcement',
    priority: 'medium' as 'low' | 'medium' | 'high',
    subject: '',
    message: ''
  });
  const [messageDetailOpen, setMessageDetailOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<FeedbackMessage | null>(null);
  const [selectedReplies, setSelectedReplies] = useState<FeedbackReply[]>([]);
  const [loadingMessage, setLoadingMessage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load admin profile for auto-prefilling
      const profileResponse = await feedbackAPI.getAdminProfile();
      setAdminProfile(profileResponse);
      
      setNewMessage(prev => ({
        ...prev,
        name: profileResponse.fullName || '',
        email: profileResponse.email || '',
        phone: profileResponse.phone || profileResponse.phoneNumber || ''
      }));

      // Load messages
      const messagesResponse = await feedbackAPI.getMessages();
      if (messagesResponse.success) {
        setMessages(messagesResponse.data.messages);
      }
    } catch (error) {
      console.error('Failed to load feedback data:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Use API utility methods for colors
  const getTypeColor = (type: string) => feedbackAPI.getTypeColor(type);
  const getPriorityColor = (priority: string) => feedbackAPI.getPriorityColor(priority);
  const getStatusColor = (status: string) => feedbackAPI.getStatusColor(status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || message.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || message.priority === selectedPriority;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feedbackAPI.createMessage(newMessage);
      
      // Add notification
      addNotification({
        title: 'Feedback Submitted',
        message: `New ${newMessage.type}: "${newMessage.subject}" has been submitted`,
        type: 'success',
        source: 'feedback',
        actionUrl: '/admin/feedback'
      });
      
      // Reset form but keep admin data pre-filled
      setNewMessage({
        name: adminProfile?.fullName || '',
        email: adminProfile?.email || '',
        phone: adminProfile?.phone || adminProfile?.phoneNumber || '',
        type: 'suggestion',
        priority: 'medium',
        subject: '',
        message: ''
      });
      setShowNewMessageForm(false);
      
      // Reload messages
      await loadData();
    } catch (error) {
      console.error('Failed to submit message:', error);
      alert('Failed to submit message. Please try again.');
    }
  };

  const handleViewMessage = async (messageId: number) => {
    try {
      setLoadingMessage(true);
      const response = await feedbackAPI.getMessage(messageId);
      if (response.success) {
        setSelectedMessage(response.data.message);
        setSelectedReplies(response.data.replies);
        setMessageDetailOpen(true);
      }
    } catch (error) {
      console.error('Failed to view message:', error);
      alert('Failed to load message details');
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleDetailDialogChange = (open: boolean) => {
    setMessageDetailOpen(open);
    if (!open) {
      setSelectedMessage(null);
      setSelectedReplies([]);
    }
  };

  const formatDate = (dateString: string) => feedbackAPI.formatDate(dateString);
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback Center</h1>
          <p className="text-gray-600">Manage complaints, suggestions, and internal communications</p>
        </div>
        <Dialog open={showNewMessageForm} onOpenChange={setShowNewMessageForm}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit New Message</DialogTitle>
              <DialogDescription>
                Create a new complaint, suggestion, or announcement. Your admin details are automatically filled.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMessage.name}
                    onChange={(e) => setNewMessage({...newMessage, name: e.target.value})}
                    placeholder="Auto-filled from your profile"
                    required
                    className="bg-blue-50"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMessage.email}
                    onChange={(e) => setNewMessage({...newMessage, email: e.target.value})}
                    placeholder="Auto-filled from your profile"
                    required
                    className="bg-blue-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newMessage.phone}
                    onChange={(e) => setNewMessage({...newMessage, phone: e.target.value})}
                    placeholder="Auto-filled from your profile"
                    required
                    className="bg-blue-50"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Message Type</Label>
                  <Select value={newMessage.type} onValueChange={(value) => setNewMessage({...newMessage, type: value as 'complaint' | 'suggestion' | 'announcement'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={newMessage.priority} onValueChange={(value) => setNewMessage({...newMessage, priority: value as 'low' | 'medium' | 'high'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Brief subject line"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                  placeholder="Describe your complaint, suggestion, or announcement in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowNewMessageForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Message
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-blue-600">
                  {messages.filter(m => m.status === 'new').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {messages.filter(m => m.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {messages.filter(m => m.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Messages & Communications</CardTitle>
          <CardDescription>View and manage all complaints, suggestions, and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="complaint">Complaints</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`text-xs ${getTypeColor(message.type)}`}>
                          {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                          {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)} Priority
                        </Badge>
                        <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          {message.status.replace('_', ' ').charAt(0).toUpperCase() + message.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
                      <p className="text-gray-700 mb-3 line-clamp-2">{message.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {message.name}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {message.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {message.phone}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(message.created_at)}
                        </div>
                      </div>

                      {(message.replies_count || 0) > 0 && (
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Reply className="w-4 h-4 mr-1" />
                          {message.replies_count} {message.replies_count === 1 ? 'reply' : 'replies'}
                          {message.last_reply_by && (
                            <span className="ml-2">
                              • Last reply by {message.last_reply_by}
                              {message.last_reply_at && (
                                <span className="ml-1 text-xs text-gray-400">
                                  ({formatDateTime(message.last_reply_at)})
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {message.assigned_to && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Assigned to: {message.assigned_to}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewMessage(message.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={async () => {
                          const replyText = prompt('Enter your reply:');
                          if (replyText && replyText.trim()) {
                            try {
                              await feedbackAPI.addReply(message.id, replyText);
                              alert('Reply sent successfully!');
                              await loadData();
                            } catch (error) {
                              console.error('Failed to send reply:', error);
                              alert('Failed to send reply');
                            }
                          }
                        }}
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await feedbackAPI.updateMessageStatus(message.id, 'resolved');
                                alert('Message marked as resolved');
                                await loadData();
                              } catch (error) {
                                console.error('Failed to update status:', error);
                                alert('Failed to update status');
                              }
                            }}
                          >
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              const assignTo = prompt('Assign to (enter name):');
                              if (assignTo && assignTo.trim()) {
                                try {
                                  await feedbackAPI.updateMessageStatus(message.id, 'in_progress', assignTo);
                                  alert(`Message assigned to ${assignTo}`);
                                  await loadData();
                                } catch (error) {
                                  console.error('Failed to assign:', error);
                                  alert('Failed to assign message');
                                }
                              }
                            }}
                          >
                            Assign to Team
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              const newPriority = prompt('Enter new priority (low, medium, high):', message.priority);
                              if (newPriority && ['low', 'medium', 'high'].includes(newPriority.toLowerCase())) {
                                try {
                                  await feedbackAPI.updateMessagePriority(message.id, newPriority.toLowerCase() as 'low' | 'medium' | 'high');
                                  alert(`Priority changed to ${newPriority}`);
                                  await loadData();
                                } catch (error) {
                                  console.error('Failed to update priority:', error);
                                  alert('Failed to update priority');
                                }
                              } else if (newPriority) {
                                alert('Invalid priority. Please enter: low, medium, or high');
                              }
                            }}
                          >
                            Change Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete "${message.subject}"?`)) {
                                try {
                                  await feedbackAPI.deleteMessage(message.id);
                                  alert('Message deleted successfully');
                                  await loadData();
                                } catch (error) {
                                  console.error('Failed to delete message:', error);
                                  alert('Failed to delete message');
                                }
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedType !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No messages have been submitted yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={messageDetailOpen} onOpenChange={handleDetailDialogChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || 'Message Details'}</DialogTitle>
            {selectedMessage && (
              <DialogDescription>
                Submitted by {selectedMessage.name} on {formatDateTime(selectedMessage.created_at)}
              </DialogDescription>
            )}
          </DialogHeader>

          {loadingMessage ? (
            <p className="text-sm text-gray-500">Loading message...</p>
          ) : selectedMessage ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Message Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800">Sender</p>
                      <p>{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p>{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p>{selectedMessage.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Status</p>
                      <p className="capitalize">{selectedMessage.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Message</p>
                    <p className="whitespace-pre-wrap text-gray-700">{selectedMessage.message}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Responses</CardTitle>
                  <CardDescription>
                    {selectedReplies.length > 0
                      ? `${selectedReplies.length} response${selectedReplies.length === 1 ? '' : 's'} from admins`
                      : 'No responses yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedReplies.length > 0 ? (
                    selectedReplies.map(reply => (
                      <div key={reply.id} className="rounded-md border border-gray-200 p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {reply.responder_name || reply.admin_name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {reply.responder_email || 'Email not available'}
                              {reply.responder_role && ` • ${reply.responder_role}`}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(reply.created_at)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{reply.reply_text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No responses yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a message to view details.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackCenterPage;