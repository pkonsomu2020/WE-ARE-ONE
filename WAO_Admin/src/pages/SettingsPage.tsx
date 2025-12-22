import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Save,
  Eye,
  EyeOff,
  Mail,
  Globe,
  Download,
  Upload,
  Trash2,
  Key,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const SettingsPage = () => {
  const { addNotification } = useNotifications();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@weareone.co.ke',
    phone: '+254712345678',
    role: 'Super Admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'We Are One Admin Portal',
    siteUrl: 'https://admin.weareone.co.ke',
    mainWebsiteUrl: 'https://weareone.co.ke',
    organizationEmail: 'admin@weareone.co.ke',
    supportEmail: 'support@weareone.co.ke',
    darkMode: false,
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newOrderAlerts: true,
    paymentVerificationAlerts: true,
    systemMaintenanceAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    reminderEmails: true,
    securityAlerts: true,
    soundNotifications: false,
    desktopNotifications: true,
    mobileNotifications: true
  });

  const [dataSettings, setDataSettings] = useState({
    dataRetentionDays: 365,
    backupFrequency: 'weekly',
    autoBackup: true,
    exportFormat: 'json',
    lastBackup: '2024-10-20T10:30:00',
    storageUsed: '2.4 GB',
    storageLimit: '10 GB'
  });

  const [systemStats, setSystemStats] = useState(null);

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      setLoading(true);
      
      // Load all settings in parallel
      const [profileRes, systemRes, notificationRes, storageRes, statsRes] = await Promise.all([
        api.settings.getProfile(),
        api.settings.getSystemSettings(),
        api.settings.getNotificationSettings(),
        api.settings.getStorageInfo(),
        api.settings.getStats()
      ]);

      if (profileRes.success) {
        setProfileData(prev => ({
          ...prev,
          fullName: profileRes.data.fullName,
          email: profileRes.data.email,
          phone: profileRes.data.phone,
          role: profileRes.data.role
        }));
      }

      if (systemRes.success) {
        setSystemSettings(systemRes.data);
      }

      if (notificationRes.success) {
        setNotificationSettings(notificationRes.data.settings);
      }

      if (storageRes.success) {
        setDataSettings(prev => ({
          ...prev,
          storageUsed: storageRes.data.used,
          storageLimit: storageRes.data.limit,
          lastBackup: storageRes.data.lastBackup,
          backupFrequency: storageRes.data.backupFrequency,
          autoBackup: storageRes.data.autoBackup,
          dataRetentionDays: storageRes.data.retentionDays
        }));
      }

      if (statsRes.success) {
        setSystemStats(statsRes.data);
      }

    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await api.settings.updateProfile({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone
      });

      if (response.success) {
        toast.success('Profile updated successfully');
        
        // Add notification
        addNotification({
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated',
          type: 'success',
          source: 'settings',
          actionUrl: '/admin/settings'
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const response = await api.settings.changePassword({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
        confirmPassword: profileData.confirmPassword
      });

      if (response.success) {
        toast.success('Password changed successfully');
        
        // Add notification
        addNotification({
          title: 'Password Changed',
          message: 'Your account password has been successfully updated',
          type: 'success',
          source: 'settings',
          actionUrl: '/admin/settings'
        });
        
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleSystemSave = async () => {
    try {
      setSaving(true);
      const response = await api.settings.updateSystemSettings(systemSettings);

      if (response.success) {
        toast.success('System settings updated successfully');
        
        // Add notification
        addNotification({
          title: 'System Settings Updated',
          message: 'System configuration has been successfully updated',
          type: 'success',
          source: 'settings',
          actionUrl: '/admin/settings'
        });
        
        // Reload settings to show changes
        await loadAllSettings();
      }
    } catch (error) {
      console.error('Failed to update system settings:', error);
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setSaving(true);
      const response = await api.settings.updateNotificationSettings(notificationSettings);

      if (response.success) {
        toast.success('Notification settings updated successfully');
        
        // Add notification
        addNotification({
          title: 'Notification Settings Updated',
          message: 'Your notification preferences have been successfully updated',
          type: 'success',
          source: 'settings',
          actionUrl: '/admin/settings'
        });
        
        // Reload settings to show changes
        await loadAllSettings();
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDataExport = async (type: string) => {
    try {
      setSaving(true);
      const response = await api.settings.exportData({
        type: type,
        format: dataSettings.exportFormat
      });

      if (response.success) {
        toast.success(`${type} data exported successfully`);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data');
    } finally {
      setSaving(false);
    }
  };

  const handleDataBackup = async () => {
    try {
      setSaving(true);
      const response = await api.settings.createBackup();

      if (response.success) {
        toast.success('Backup created successfully');
        // Reload storage info
        const storageRes = await api.settings.getStorageInfo();
        if (storageRes.success) {
          setDataSettings(prev => ({
            ...prev,
            lastBackup: storageRes.data.lastBackup
          }));
        }
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestNotification = async () => {
    try {
      setSaving(true);
      const response = await api.settings.sendTestNotification({
        type: 'settings_test',
        recipient: profileData.email
      });

      if (response.success) {
        toast.success('Test notification sent successfully');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-2">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure system preferences and admin settings</p>
        </div>
        {systemStats && (
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {systemStats.totalUsers} Users
            </div>
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-1" />
              {systemStats.totalOrders} Orders
            </div>
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-1" />
              {systemStats.environment}
            </div>
          </div>
        )}
      </div>
      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-orange-600" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password for security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-orange-600" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure basic system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                    placeholder="Enter site name"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Admin Portal URL</Label>
                  <Input
                    id="siteUrl"
                    value={systemSettings.siteUrl}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteUrl: e.target.value })}
                    placeholder="Enter admin portal URL"
                  />
                </div>
                <div>
                  <Label htmlFor="mainWebsiteUrl">Main Website URL</Label>
                  <Input
                    id="mainWebsiteUrl"
                    value={systemSettings.mainWebsiteUrl}
                    onChange={(e) => setSystemSettings({ ...systemSettings, mainWebsiteUrl: e.target.value })}
                    placeholder="Enter main website URL"
                  />
                </div>
                <div>
                  <Label htmlFor="organizationEmail">Organization Email</Label>
                  <Input
                    id="organizationEmail"
                    type="email"
                    value={systemSettings.organizationEmail}
                    onChange={(e) => setSystemSettings({ ...systemSettings, organizationEmail: e.target.value })}
                    placeholder="Enter organization email"
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={systemSettings.supportEmail}
                    onChange={(e) => setSystemSettings({ ...systemSettings, supportEmail: e.target.value })}
                    placeholder="Enter support email"
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-orange-600" />
                  System Preferences
                </CardTitle>
                <CardDescription>
                  Configure system behavior and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Enable dark theme for the admin interface</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {systemSettings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <Switch
                      checked={systemSettings.darkMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, darkMode: checked })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">User Registration</Label>
                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, registrationEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Verification</Label>
                    <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    checked={systemSettings.emailVerificationRequired}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, emailVerificationRequired: checked })}
                  />
                </div>

                <Button onClick={handleSystemSave} className="w-full bg-orange-600 hover:bg-orange-700" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save System Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-orange-600" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Order Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified of new orders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newOrderAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newOrderAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Payment Verification</Label>
                    <p className="text-sm text-gray-500">Alerts for payment verifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentVerificationAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, paymentVerificationAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Maintenance</Label>
                    <p className="text-sm text-gray-500">Maintenance and update alerts</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemMaintenanceAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemMaintenanceAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Monthly Reports</Label>
                    <p className="text-sm text-gray-500">Receive monthly analytics reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, monthlyReports: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Device Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-orange-600" />
                  Device Notifications
                </CardTitle>
                <CardDescription>
                  Configure device-specific notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound Notifications</Label>
                    <p className="text-sm text-gray-500">Play sounds for notifications</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notificationSettings.soundNotifications ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <Switch
                      checked={notificationSettings.soundNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, soundNotifications: checked })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Desktop Notifications</Label>
                    <p className="text-sm text-gray-500">Show desktop notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.desktopNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, desktopNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Mobile Notifications</Label>
                    <p className="text-sm text-gray-500">Push notifications to mobile devices</p>
                  </div>
                  <Switch
                    checked={notificationSettings.mobileNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, mobileNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-gray-500">Important security notifications</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Required
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Reminder Emails</Label>
                    <p className="text-sm text-gray-500">Task and deadline reminders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.reminderEmails}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, reminderEmails: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Button onClick={handleNotificationSave} className="w-full bg-orange-600 hover:bg-orange-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSendTestNotification} 
                    variant="outline" 
                    className="w-full"
                    disabled={saving}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2 text-orange-600" />
                  Data Export
                </CardTitle>
                <CardDescription>
                  Export system data and generate reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select value={dataSettings.exportFormat} onValueChange={(value) => setDataSettings({ ...dataSettings, exportFormat: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleDataExport('orders')}
                    variant="outline"
                    className="w-full justify-start"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Orders Data
                  </Button>
                  <Button
                    onClick={() => handleDataExport('users')}
                    variant="outline"
                    className="w-full justify-start"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Users Data
                  </Button>
                  <Button
                    onClick={() => handleDataExport('feedback')}
                    variant="outline"
                    className="w-full justify-start"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Feedback Data
                  </Button>
                  <Button
                    onClick={() => handleDataExport('analytics')}
                    variant="outline"
                    className="w-full justify-start"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Analytics Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Backup & Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-orange-600" />
                  Backup & Storage
                </CardTitle>
                <CardDescription>
                  Manage data backups and storage settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Storage Used</Label>
                    <p className="text-2xl font-bold text-orange-600">{dataSettings.storageUsed}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Storage Limit</Label>
                    <p className="text-2xl font-bold text-gray-600">{dataSettings.storageLimit}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={dataSettings.backupFrequency} onValueChange={(value) => setDataSettings({ ...dataSettings, backupFrequency: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataRetention">Data Retention (Days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={dataSettings.dataRetentionDays}
                    onChange={(e) => setDataSettings({ ...dataSettings, dataRetentionDays: parseInt(e.target.value) })}
                    placeholder="Enter retention period"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Backup</Label>
                    <p className="text-sm text-gray-500">Automatically create backups</p>
                  </div>
                  <Switch
                    checked={dataSettings.autoBackup}
                    onCheckedChange={(checked) => setDataSettings({ ...dataSettings, autoBackup: checked })}
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Last backup: {new Date(dataSettings.lastBackup).toLocaleString()}
                  </p>
                  <Button onClick={handleDataBackup} className="w-full bg-orange-600 hover:bg-orange-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Create Backup Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>


          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;