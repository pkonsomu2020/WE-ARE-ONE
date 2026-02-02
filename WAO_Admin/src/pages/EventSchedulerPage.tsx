import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  User,
  MapPin,
  Bell,
  Mail,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CalendarDays,
  CalendarCheck,
  Video,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Helper function to safely format dates
const formatDate = (dateString: any): Date => {
  if (!dateString) return new Date();
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  } catch (error) {
    console.error('Date formatting error:', error);
    return new Date();
  }
};

const formatDateString = (dateString: any): string => {
  const date = formatDate(dateString);
  return date.toLocaleDateString();
};

const formatTimeString = (dateString: any): string => {
  const date = formatDate(dateString);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true // Explicitly enable 12-hour format with AM/PM
  });
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CalendarEvent {
  id: number;
  title: string;
  type: 'meeting' | 'organization_event' | 'reminder';
  start: string;
  end: string;
  description: string;
  location?: string;
  meetingLink?: string;
  attendees: string[];
  attendeeCount: number;
  createdBy: string;
  createdByProfileId?: number;
  createdByName?: string;
  createdByEmail?: string;
  reminderSent: boolean;
  isRecurring: boolean;
  status: string;
}

interface EventStats {
  totalEvents: number;
  thisWeekEvents: number;
  meetingsCount: number;
  pendingReminders: number;
  upcomingEvents: CalendarEvent[];
}

const EventSchedulerPage = () => {
  const { addNotification } = useNotifications();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('all');
  const [creators, setCreators] = useState<string[]>([]);
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting' as 'meeting' | 'organization_event' | 'reminder',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    meetingLink: '',
    attendees: '',
    isRecurring: false,
    recurrencePattern: ''
  });

  useEffect(() => {
    loadEvents();
    loadStats();
  }, []);

  useEffect(() => {
    if (!Array.isArray(events) || events.length === 0) {
      setCreators([]);
      return;
    }
    try {
      const uniqueCreators = Array.from(new Set(
        events
          .filter(event => event && typeof event === 'object')
          .map(event => {
            return event.createdByEmail || event.createdByName || event.createdBy;
          })
          .filter((value): value is string => !!value && typeof value === 'string')
      ));
      setCreators(uniqueCreators);
    } catch (error) {
      console.error('Error processing creators:', error);
      setCreators([]);
    }
  }, [events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.eventScheduler.getEvents();
      if (response?.success && Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.warn('Invalid events response:', response);
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.eventScheduler.getStats();
      if (response?.success && response?.data) {
        setStats(response.data);
      } else {
        console.warn('Invalid stats response:', response);
        setStats({
          totalEvents: 0,
          thisWeekEvents: 0,
          meetingsCount: 0,
          pendingReminders: 0,
          upcomingEvents: []
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({
        totalEvents: 0,
        thisWeekEvents: 0,
        meetingsCount: 0,
        pendingReminders: 0,
        upcomingEvents: []
      });
    }
  };

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) {
      return [];
    }
    
    if (selectedCreator === 'all') {
      return events;
    }
    return events.filter(event => {
      if (!event) return false;
      const creatorKey = event.createdByEmail || event.createdByName || event.createdBy;
      return creatorKey === selectedCreator;
    });
  }, [events, selectedCreator]);

  const upcomingEventsList = useMemo(() => {
    if (!Array.isArray(filteredEvents)) {
      return [];
    }
    
    return filteredEvents
      .filter(event => {
        if (!event || !event.start) return false;
        try {
          // Show all events, not just future ones
          return true;
        } catch (error) {
          console.error('Error filtering event:', event, error);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          return formatDate(a.start).getTime() - formatDate(b.start).getTime();
        } catch (error) {
          console.error('Error sorting events:', a, b, error);
          return 0;
        }
      })
      .slice(0, 10); // Show more events
  }, [filteredEvents]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'organization_event':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'organization_event':
        return <CalendarCheck className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date, eventList: CalendarEvent[] = filteredEvents) => {
    if (!Array.isArray(eventList)) {
      return [];
    }
    
    const dateString = date.toISOString().split('T')[0];
    return eventList.filter(event => {
      if (!event || !event.start) return false;
      try {
        return event.start.split('T')[0] === dateString;
      } catch (error) {
        console.error('Error filtering event by date:', event, error);
        return false;
      }
    });
  };

  const handleDateClick = (date: Date) => {
    // Check if the date is in the past (before today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Cannot schedule events for past dates. Please select today or a future date.');
      return;
    }
    
    const dateString = date.toISOString().split('T')[0];
    setNewEvent({ ...newEvent, date: dateString });
    setShowEventForm(true);
  };

  // Helper function to check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Helper function to get minimum date for date input (today's date)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Form validation function
  const isFormInvalid = () => {
    const startTime = newEvent.startTime;
    const endTime = newEvent.endTime;

    // Check if end time is after start time
    if (startTime && endTime && startTime >= endTime) {
      return true;
    }

    // Check if the selected date is in the past
    if (newEvent.date) {
      const selectedDate = new Date(newEvent.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return true;
      }
    }

    // Check required fields
    if (!newEvent.title || !newEvent.type || !newEvent.date || !startTime || !endTime) {
      return true;
    }

    return false;
  };

  const checkDateAvailability = async (date: string, startTime: string, endTime: string, excludeEventId?: number) => {
    try {
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;

      const response = await api.eventScheduler.checkAvailability({
        startDateTime,
        endDateTime,
        excludeEventId
      });

      return response.available;
    } catch (error) {
      console.error('Failed to check availability:', error);
      return true; // Allow if check fails
    }
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Additional validation before submission
    if (isFormInvalid()) {
      toast.error('Please check all fields and ensure end time is after start time');
      return;
    }

    if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if the selected date is in the past
    const selectedDate = new Date(newEvent.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Cannot schedule events for past dates. Please select today or a future date.');
      return;
    }

    // Check if end time is after start time
    if (newEvent.startTime >= newEvent.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setSubmitting(true);

    try {
      // Check date availability (skip for editing the same event)
      const isAvailable = await checkDateAvailability(
        newEvent.date, 
        newEvent.startTime, 
        newEvent.endTime,
        editingEvent?.id // Exclude current event when editing
      );

      if (!isAvailable) {
        toast.error('This time slot is already booked. Please choose a different time.');
        setSubmitting(false);
        return;
      }

      let response;
      if (editingEvent) {
        // Update existing event
        response = await api.eventScheduler.updateEvent(editingEvent.id, newEvent);
      } else {
        // Create new event
        response = await api.eventScheduler.createEvent(newEvent);
      }

      if (response.success) {
        const action = editingEvent ? 'updated' : 'created';
        const attendeesMessage = editingEvent ? '' : ` Notifications sent to ${response.data?.attendeesNotified || 0} attendees.`;
        toast.success(`Event ${action} successfully!${attendeesMessage}`);

        // Add notification
        addNotification({
          title: editingEvent ? 'Event Updated' : 'Event Scheduled',
          message: `"${newEvent.title}" ${action} for ${formatDateString(newEvent.date)} at ${newEvent.startTime}`,
          type: 'success',
          source: 'event',
          actionUrl: '/admin/events'
        });

        // Reset form
        setNewEvent({
          title: '',
          type: 'meeting',
          date: '',
          startTime: '',
          endTime: '',
          description: '',
          location: '',
          meetingLink: '',
          attendees: '',
          isRecurring: false,
          recurrencePattern: ''
        });

        setEditingEvent(null);
        setShowEventForm(false);

        // Reload events and stats
        await loadEvents();
        await loadStats();
      }
    } catch (error: any) {
      console.error('Failed to submit event:', error);

      if (error.message.includes('conflicts')) {
        toast.error('Time slot conflicts with existing event. Please choose a different time.');
      } else {
        const action = editingEvent ? 'update' : 'create';
        toast.error(`Failed to ${action} event. Please try again.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number, eventTitle: string) => {
    if (!confirm(`Are you sure you want to cancel "${eventTitle}"?`)) {
      return;
    }

    try {
      const response = await api.eventScheduler.deleteEvent(eventId);

      if (response.success) {
        toast.success('Event cancelled successfully');
        await loadEvents();
        await loadStats();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to cancel event');
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    // Convert the event data to form format
    const eventDate = new Date(event.start);
    const startTime = eventDate.toTimeString().slice(0, 5); // HH:MM format
    const endDate = new Date(event.end);
    const endTime = endDate.toTimeString().slice(0, 5); // HH:MM format
    
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      type: event.type,
      description: event.description || '',
      date: eventDate.toISOString().split('T')[0],
      startTime: startTime,
      endTime: endTime,
      location: event.location || '',
      meetingLink: event.meetingLink || '',
      attendees: '', // We don't edit attendees in this simple implementation
      isRecurring: event.isRecurring || false,
      recurrencePattern: ''
    });
    setShowEventForm(true);
  };

  const handleSendReminder = async (eventId: number) => {
    try {
      const response = await api.eventScheduler.sendReminder(eventId);

      if (response.success) {
        toast.success(response.message);
        await loadEvents();
      }
    } catch (error) {
      console.error('Failed to send reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const handleViewEvent = (event: CalendarEvent) => {
    console.log('🔍 Viewing event:', event.title);
    setViewingEvent(event);
    setShowViewDialog(true);
    // Ensure the create form is closed
    setShowEventForm(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Scheduler</h1>
          <p className="text-gray-600">Manage calendar events, meetings, and scheduling</p>
        </div>
        <Dialog open={showEventForm} onOpenChange={(open) => {
          setShowEventForm(open);
          if (!open) {
            // Reset form when dialog closes
            setEditingEvent(null);
            setNewEvent({
              title: '',
              type: 'meeting',
              date: '',
              startTime: '',
              endTime: '',
              description: '',
              location: '',
              meetingLink: '',
              attendees: '',
              isRecurring: false,
              recurrencePattern: ''
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Schedule New Event'}</DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update event details' : 'Create a new meeting, organization event, or reminder'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <form onSubmit={handleSubmitEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={newEvent.type} onValueChange={(value: 'meeting' | 'organization_event' | 'reminder') => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Internal Meeting</SelectItem>
                        <SelectItem value="organization_event">Organization Event</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      min={getMinDate()}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                    {newEvent.date && (() => {
                      const selectedDate = new Date(newEvent.date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      selectedDate.setHours(0, 0, 0, 0);
                      return selectedDate < today;
                    })() && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠️ Cannot schedule events for past dates
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Cannot schedule events for past dates
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      required
                    />
                    {newEvent.startTime && newEvent.endTime && newEvent.startTime >= newEvent.endTime && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠️ End time must be after start time
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Event description and agenda"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Meeting room, address, or virtual link"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                    <Input
                      id="meetingLink"
                      value={newEvent.meetingLink}
                      onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                      placeholder="Zoom, Teams, or other meeting link"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="attendees">External Attendees (Optional)</Label>
                  <Input
                    id="attendees"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                    placeholder="External email addresses (comma-separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    All admin team members will be automatically notified. Add external emails here if needed.
                  </p>
                </div>

                {newEvent.isRecurring && (
                  <div>
                    <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                    <Select value={newEvent.recurrencePattern} onValueChange={(value) => setNewEvent({ ...newEvent, recurrencePattern: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={newEvent.isRecurring}
                    onChange={(e) => setNewEvent({ ...newEvent, isRecurring: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isRecurring">Recurring Event</Label>
                </div>
              </form>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t flex-shrink-0">
              <Button type="button" variant="outline" onClick={() => setShowEventForm(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700" 
                disabled={submitting || isFormInvalid()}
                onClick={handleSubmitEvent}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {editingEvent ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {editingEvent ? 'Update Event' : 'Schedule Event'}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.thisWeekEvents || 0}</p>
              </div>
              <CalendarDays className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meetings</p>
                <p className="text-2xl font-bold text-green-600">{stats?.meetingsCount || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reminders</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pendingReminders || 0}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Click on any available date to schedule a new event. Past dates are disabled.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCreator} onValueChange={setSelectedCreator}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Creators" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Creators</SelectItem>
                  {creators.map(creator => (
                    <SelectItem key={creator} value={creator}>{creator}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-center space-x-6 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
              <span className="text-sm text-gray-600">Available dates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded opacity-60"></div>
              <span className="text-sm text-gray-600">Past dates (disabled)</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => {
              if (!date) {
                return <div key={index} className="h-24 bg-gray-50"></div>;
              }

              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isPast = isPastDate(date);

              return (
                <div
                  key={index}
                  className={`h-24 p-1 border border-gray-200 transition-colors ${
                    isPast 
                      ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                      : 'cursor-pointer hover:bg-gray-50 hover:border-orange-200'
                  } ${
                    isToday ? 'bg-orange-50 border-orange-200' : 'bg-white'
                  }`}
                  onClick={() => !isPast && handleDateClick(date)}
                  title={isPast ? 'Cannot schedule events for past dates' : `Click to schedule an event on ${date.toLocaleDateString()}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday 
                      ? 'text-orange-600' 
                      : isPast 
                        ? 'text-gray-400' 
                        : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate ${
                          isPast ? 'opacity-50' : ''
                        }`}
                        title={event.title}
                      >
                        {formatTimeString(event.start)} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className={`text-xs ${isPast ? 'text-gray-400' : 'text-gray-500'}`}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>All scheduled events and meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
                <p className="text-gray-600 mt-2">Loading events...</p>
              </div>
            ) : (
              <>
                {upcomingEventsList.map(event => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`text-xs flex items-center gap-1 ${getEventTypeColor(event.type)}`}>
                              {getEventTypeIcon(event.type)}
                              {event.type.replace('_', ' ').charAt(0).toUpperCase() + event.type.replace('_', ' ').slice(1)}
                            </Badge>
                            {event.isRecurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                            {event.reminderSent && (
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                Reminder Sent
                              </Badge>
                            )}
                            {(event.createdByName || event.createdBy) && (
                              <Badge
                                variant="outline"
                                className="text-xs flex items-center gap-1"
                                title={event.createdByEmail || ''}
                              >
                                <User className="w-3 h-3" />
                                {event.createdByName || event.createdBy}
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDateString(event.start)} • {formatTimeString(event.start)} - {formatTimeString(event.end)}
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {event.attendeeCount || event.attendees?.length || 0} attendees
                            </div>
                            {(event.createdByName || event.createdBy) && (
                              <div
                                className="flex items-center"
                                title={event.createdByEmail || ''}
                              >
                                <User className="w-4 h-4 mr-1" />
                                Created by {event.createdByName || event.createdBy}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewEvent(event);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendReminder(event.id)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Reminder
                              </DropdownMenuItem>
                              {event.meetingLink && (
                                <DropdownMenuItem onClick={() => window.open(event.meetingLink, '_blank')}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Meeting
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteEvent(event.id, event.title)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {upcomingEventsList.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600">Schedule your first event to get started</p>
                    <Button
                      className="mt-4 bg-orange-600 hover:bg-orange-700"
                      onClick={() => setShowEventForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Event
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingEvent?.title}</DialogTitle>
            <DialogDescription>
              Event details and information
            </DialogDescription>
          </DialogHeader>
          
          {viewingEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Event Type</Label>
                  <div className="mt-1">
                    <Badge className={`${getEventTypeColor(viewingEvent.type)} flex items-center gap-1 w-fit`}>
                      {getEventTypeIcon(viewingEvent.type)}
                      {viewingEvent.type.replace('_', ' ').charAt(0).toUpperCase() + viewingEvent.type.replace('_', ' ').slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {viewingEvent.reminderSent ? (
                        <>
                          <Mail className="w-3 h-3" />
                          Reminder Sent
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <Clock className="w-4 h-4 mr-2" />
                    <div>
                      <div>{formatDateString(viewingEvent.start)}</div>
                      <div className="text-sm text-gray-500">
                        {formatTimeString(viewingEvent.start)} - {formatTimeString(viewingEvent.end)}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Attendees</Label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <Users className="w-4 h-4 mr-2" />
                    {viewingEvent.attendeeCount || viewingEvent.attendees?.length || 0} attendees
                  </div>
                </div>
              </div>

              {viewingEvent.location && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2" />
                    {viewingEvent.location}
                  </div>
                </div>
              )}

              {viewingEvent.meetingLink && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Meeting Link</Label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <Video className="w-4 h-4 mr-2" />
                    <a 
                      href={viewingEvent.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              )}

              {viewingEvent.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <div className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {viewingEvent.description}
                  </div>
                </div>
              )}

              {(viewingEvent.createdByName || viewingEvent.createdBy) && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created By</Label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2" />
                    <div>
                      <div>{viewingEvent.createdByName || viewingEvent.createdBy}</div>
                      {viewingEvent.createdByEmail && (
                        <div className="text-sm text-gray-500">{viewingEvent.createdByEmail}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {viewingEvent.isRecurring && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Recurrence</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <CalendarIcon className="w-3 h-3" />
                      Recurring Event
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowViewDialog(false);
                    handleEditEvent(viewingEvent);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </Button>
                {viewingEvent.meetingLink && (
                  <Button 
                    onClick={() => window.open(viewingEvent.meetingLink, '_blank')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventSchedulerPage;