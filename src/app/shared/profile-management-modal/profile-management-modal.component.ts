import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  User,
  MessageSquare,
  Settings,
  Shield,
  X,
  Download,
  Trash2,
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  AlertCircle,
  Check,
  ChevronDown,
  Key,
  UserCheck,
  Activity,
  Database,
  Lock,
  EyeOff,
  Eye
} from 'lucide-angular';
import { ToastService } from 'src/app/services/toast.service';
import { ServiceProxy, UserDto, ChangePasswordRequest } from 'src/app/services/api-client';
import { AuthService } from 'src/app/services/auth';
import { ChatManagementService, ChatSession } from 'src/app/services/chat-management.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-profile-management-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile-management-modal.component.html',
  styleUrl: './profile-management-modal.component.css'
})
export class ProfileManagementModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  // Icons
  closeIcon = X;
  userIcon = User;
  messageSquareIcon = MessageSquare;
  settingsIcon = Settings;
  shieldIcon = Shield;
  downloadIcon = Download;
  trashIcon = Trash2;
  searchIcon = Search;
  calendarIcon = Calendar;
  mailIcon = Mail;
  phoneIcon = Phone;
  mapPinIcon = MapPin;
  clockIcon = Clock;
  fileTextIcon = FileText;
  alertCircleIcon = AlertCircle;
  checkIcon = Check;
  chevronDownIcon = ChevronDown;
  keyIcon = Key;
  userCheckIcon = UserCheck;
  activityIcon = Activity;
  databaseIcon = Database;
  lockIcon = Lock;
  eyeIcon = Eye
  eyeOffIcon = EyeOff

  // Tab management
  activeTab = 'profile';
  tabs = [
    { id: 'profile', label: 'Profile', icon: this.userIcon },
    { id: 'chats', label: 'Chat Management', icon: this.messageSquareIcon },
    { id: 'account', label: 'Account Settings', icon: this.settingsIcon },
    { id: 'privacy', label: 'Privacy & Data', icon: this.shieldIcon }
  ];

  // User profile data
  currentUser: any = null;
  userInitials = '';
  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    region: '',
    timezone: 'UTC',
    bio: '',
    joinedDate: new Date(),
    lastLogin: new Date()
  };

  // Original data for comparison
  originalProfileData: any = {};
  hasProfileChanges = false;

  // Chat management
  chatSessions: ChatSession[] = [];
  filteredSessions: ChatSession[] = [];
  searchTerm = '';
  sortBy: 'date' | 'messages' | 'id' = 'date';
  isLoadingChats = false;
  selectedSessionsCount = 0;
  showDeleteConfirm = false;
  sessionToDelete: string | null = null;
  chatStats: {
    totalSessions: number;
    totalMessages: number;
    averageMessages: number;
    oldestSession?: Date;
    newestSession?: Date;
  } = {
    totalSessions: 0,
    totalMessages: 0,
    averageMessages: 0
  };

  // Account settings
  showChangePassword = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordErrors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  isChangingPassword = false;

  // Privacy settings
  privacySettings = {
    dataCollection: true,
    shareAnalytics: false,
    publicProfile: false,
    showActivity: true,
    retainData: '1year',
    exportFormat: 'json'
  };

  // Activity logs
  activityLogs: any[] = [];
  showActivityLogs = false;

  // Loading states
  isSavingProfile = false;
  isExportingData = false;
  isDeletingAccount = false;

  // Regions and timezones
  regions = [
    { value: 'North America', label: 'North America' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Africa', label: 'Africa' },
    { value: 'South America', label: 'South America' },
    { value: 'Oceania', label: 'Oceania' }
  ];

  timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time' },
    { value: 'PST', label: 'Pacific Time' },
    { value: 'GMT', label: 'Greenwich Mean Time' },
    { value: 'CET', label: 'Central European Time' },
    { value: 'JST', label: 'Japan Standard Time' }
  ];

  dataRetentionOptions = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
    { value: 'forever', label: 'Forever' }
  ];


  // Password visibility toggles
  showCurrentPassword = false
  showNewPassword = false
  showConfirmPassword = false





  constructor(
    private toastService: ToastService,
    private apiService: ServiceProxy,
    private authService: AuthService,
    private chatManagementService: ChatManagementService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    if (this.isOpen) {
      this.onModalOpen();
    }
  }

  onModalOpen(): void {
    this.loadUserData();
    if (this.activeTab === 'chats') {
      this.loadChatSessions();
    }
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileData = {
        firstName: this.currentUser.firstName || '',
        lastName: this.currentUser.lastName || '',
        email: this.currentUser.email || '',
        phoneNumber: this.currentUser.phoneNumber || '',
        region: this.currentUser.region || 'North America',
        timezone: this.profileData.timezone || 'UTC',
        bio: this.currentUser.bio || '',
        joinedDate: this.currentUser.createdAt ? new Date(this.currentUser.createdAt) : new Date(),
        lastLogin: this.currentUser.lastLoginAt ? new Date(this.currentUser.lastLoginAt) : new Date()
      };

      // Store original data
      this.originalProfileData = { ...this.profileData };

      // Generate initials
      this.generateInitials();
    }
  }

  generateInitials(): void {
    const firstName = this.profileData.firstName || '';
    const lastName = this.profileData.lastName || '';

    if (firstName && lastName) {
      this.userInitials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
    } else if (firstName) {
      this.userInitials = firstName.substring(0, 2).toUpperCase();
    } else if (this.profileData.email) {
      this.userInitials = this.profileData.email.substring(0, 2).toUpperCase();
    } else {
      this.userInitials = 'U';
    }
  }

  onProfileDataChange(): void {
    this.hasProfileChanges = JSON.stringify(this.profileData) !== JSON.stringify(this.originalProfileData);
    this.generateInitials();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;

    if (tabId === 'chats' && this.chatSessions.length === 0) {
      this.loadChatSessions();
    }
  }

  // Profile Management
  saveProfile(): void {
    if (!this.hasProfileChanges) {
      this.toastService.info('No changes to save', 'Info');
      return;
    }

    this.isSavingProfile = true;

    // Simulate API call - in real implementation, you'd call an update endpoint
    setTimeout(() => {
      // Update auth service with new data
      const updatedUser = {
        ...this.currentUser,
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
        phoneNumber: this.profileData.phoneNumber,
        region: this.profileData.region
      };

      // Save to localStorage (you might want to call an API instead)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      this.originalProfileData = { ...this.profileData };
      this.hasProfileChanges = false;
      this.isSavingProfile = false;

      this.toastService.success('Profile updated successfully', 'Success');
    }, 1000);
  }

  resetProfile(): void {
    this.profileData = { ...this.originalProfileData };
    this.hasProfileChanges = false;
    this.generateInitials();
    this.toastService.info('Profile changes discarded', 'Reset');
  }

  // Chat Management
  loadChatSessions(): void {
    this.isLoadingChats = true;

    this.chatManagementService.getUserChatSessions().subscribe({
      next: (sessions) => {
        this.chatSessions = sessions;
        this.filteredSessions = sessions;
        this.updateChatStats();
        this.sortSessions();
        this.isLoadingChats = false;
      },
      error: (error) => {
        console.error('Error loading chat sessions:', error);
        this.isLoadingChats = false;
      }
    });
  }

  updateChatStats(): void {
    this.chatStats = this.chatManagementService.getSessionStats(this.chatSessions);
  }

  searchSessions(): void {
    this.filteredSessions = this.chatManagementService.searchSessions(
      this.chatSessions,
      this.searchTerm
    );
    this.sortSessions();
  }

  sortSessions(): void {
    this.filteredSessions = this.chatManagementService.sortSessions(
      this.filteredSessions,
      this.sortBy
    );
  }

  toggleSessionSelection(session: ChatSession): void {
    this.chatManagementService.toggleSessionSelection(session.sessionId);
    session.isSelected = !session.isSelected;
    this.updateSelectedCount();
  }

  selectAllSessions(): void {
    this.chatManagementService.selectAllSessions(this.filteredSessions);
    this.filteredSessions.forEach(s => s.isSelected = true);
    this.updateSelectedCount();
  }

  clearSelections(): void {
    this.chatManagementService.clearSelections();
    this.filteredSessions.forEach(s => s.isSelected = false);
    this.updateSelectedCount();
  }

  updateSelectedCount(): void {
    this.selectedSessionsCount = this.chatManagementService.getSelectedSessions().length;
  }

  confirmDeleteSession(sessionId: string): void {
    this.sessionToDelete = sessionId;
    this.showDeleteConfirm = true;
  }

  deleteSession(): void {
    if (!this.sessionToDelete) return;

    this.chatManagementService.deleteSession(this.sessionToDelete).subscribe({
      next: () => {
        this.chatSessions = this.chatSessions.filter(s => s.sessionId !== this.sessionToDelete);
        this.filteredSessions = this.filteredSessions.filter(s => s.sessionId !== this.sessionToDelete);
        this.updateChatStats();
        this.showDeleteConfirm = false;
        this.sessionToDelete = null;
      }
    });
  }

  deleteSelectedSessions(): void {
    const selectedIds = this.chatManagementService.getSelectedSessions();
    if (selectedIds.length === 0) {
      this.toastService.warning('No sessions selected', 'Warning');
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedIds.length} chat sessions?`)) {
      this.chatManagementService.deleteMultipleSessions(selectedIds).subscribe({
        next: () => {
          this.loadChatSessions();
        }
      });
    }
  }

  exportSelectedSessions(): void {
    const selectedIds = this.chatManagementService.getSelectedSessions();
    if (selectedIds.length === 0) {
      this.toastService.warning('No sessions selected for export', 'Warning');
      return;
    }

    const userInfo = {
      email: this.profileData.email,
      name: `${this.profileData.firstName} ${this.profileData.lastName}`.trim()
    };

    this.chatManagementService.exportSessions(selectedIds, userInfo);
  }

  exportAllSessions(): void {
    const allIds = this.chatSessions.map(s => s.sessionId);
    const userInfo = {
      email: this.profileData.email,
      name: `${this.profileData.firstName} ${this.profileData.lastName}`.trim()
    };

    this.chatManagementService.exportSessions(allIds, userInfo);
  }

  // Account Settings
  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    if (!this.showChangePassword) {
      this.resetPasswordForm();
    }
  }

  resetPasswordForm(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }


  validatePassword(field: 'current' | 'new' | 'confirm'): void {
    this.passwordErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    // Validate current password
    if (field === 'current' && !this.passwordData.currentPassword) {
      this.passwordErrors.currentPassword = "Current password is required"
    }

    // Validate new password
    if ((field === 'new' || field === 'confirm') && this.passwordData.newPassword) {
      if (this.passwordData.newPassword.length < 8) {
        this.passwordErrors.newPassword = "Password must be at least 8 characters long"
      } else if (!/(?=.*[a-z])/.test(this.passwordData.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one lowercase letter"
      } else if (!/(?=.*[A-Z])/.test(this.passwordData.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one uppercase letter"
      } else if (!/(?=.*\d)/.test(this.passwordData.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one number"
      } else if (!/(?=.*[@$!%*?&])/.test(this.passwordData.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one special character"
      }
    }

    // Validate confirm password
    if (field === 'confirm' && this.passwordData.confirmPassword) {
      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.passwordErrors.confirmPassword = "Passwords do not match"
      }
    }
  }

  // Password change methods
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword
        break
      case 'new':
        this.showNewPassword = !this.showNewPassword
        break
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword
        break
    }
  }

  getPasswordStrength(): { strength: string; color: string; width: string } {
    const password = this.passwordData.newPassword
    if (!password) {
      return { strength: '', color: '', width: '0%' }
    }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++

    switch (strength) {
      case 0:
      case 1:
        return { strength: 'Weak', color: 'bg-red-500', width: '20%' }
      case 2:
        return { strength: 'Fair', color: 'bg-orange-500', width: '40%' }
      case 3:
        return { strength: 'Good', color: 'bg-yellow-500', width: '60%' }
      case 4:
        return { strength: 'Strong', color: 'bg-green-500', width: '80%' }
      case 5:
        return { strength: 'Very Strong', color: 'bg-green-600', width: '100%' }
      default:
        return { strength: '', color: '', width: '0%' }
    }
  }

  onChangePassword(): void {
    // Validate all fields
    this.validatePassword('current')
    this.validatePassword('new')
    this.validatePassword('confirm')

    // Check if there are any errors
    if (this.passwordErrors.currentPassword ||
      this.passwordErrors.newPassword ||
      this.passwordErrors.confirmPassword) {
      this.toastService.error("Please fix the errors before submitting", "Validation Error")
      return
    }

    // Check if all fields are filled
    if (!this.passwordData.currentPassword ||
      !this.passwordData.newPassword ||
      !this.passwordData.confirmPassword) {
      this.toastService.error("Please fill in all password fields", "Missing Information")
      return
    }

    // Create the request object
    const request = new ChangePasswordRequest()
    request.currentPassword = this.passwordData.currentPassword
    request.newPassword = this.passwordData.newPassword
    request.confirmNewPassword = this.passwordData.confirmPassword

    // Set loading state
    this.isChangingPassword = true

    // Call the API
    this.apiService.changePassword(request)
      .pipe(
        catchError((error) => {
          console.error('Password change error:', error)

          // Handle specific error messages
          if (error.status === 400) {
            if (error.response && error.response.includes('current password')) {
              this.toastService.error("Current password is incorrect", "Authentication Error")
            } else if (error.response && error.response.includes('match')) {
              this.toastService.error("New passwords do not match", "Validation Error")
            } else {
              this.toastService.error("Invalid password change request", "Error")
            }
          } else if (error.status === 401) {
            this.toastService.error("You are not authorized. Please login again.", "Authorization Error")
          } else {
            this.toastService.error("Failed to change password. Please try again.", "Error")
          }

          this.isChangingPassword = false
          return of(null)
        })
      )
      .subscribe((response) => {
        this.isChangingPassword = false

        if (response !== null) {
          // Success
          this.toastService.success("Your password has been changed successfully", "Password Changed")

          // Clear the password fields
          this.passwordData.currentPassword = ""
          this.passwordData.newPassword = ""
          this.passwordData.confirmPassword = ""

          // Reset visibility
          this.showCurrentPassword = false
          this.showNewPassword = false
          this.showConfirmPassword = false

          // Switch to general tab
          this.activeTab = "general"
        }
      })
  }

  // changePassword(): void {
  //   if (!this.validatePassword()) {
  //     return;
  //   }

  //   this.isChangingPassword = true;

  //   const request = new ChangePasswordRequest();
  //   request.currentPassword = this.passwordData.currentPassword;
  //   request.newPassword = this.passwordData.newPassword;
  //   request.confirmNewPassword = this.passwordData.confirmPassword;

  //   this.apiService.changePassword(request)
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Password change error:', error);
  //         this.toastService.error('Failed to change password', 'Error');
  //         this.isChangingPassword = false;
  //         return of(null);
  //       })
  //     )
  //     .subscribe((response) => {
  //       this.isChangingPassword = false;
  //       if (response !== null) {
  //         this.toastService.success('Password changed successfully', 'Success');
  //         this.toggleChangePassword();
  //       }
  //     });
  // }

  exportUserData(): void {
    this.isExportingData = true;

    // Gather all user data
    const exportData = {
      profile: this.profileData,
      accountInfo: {
        createdAt: this.profileData.joinedDate,
        lastLogin: this.profileData.lastLogin
      },
      privacySettings: this.privacySettings,
      exportDate: new Date().toISOString()
    };

    // Create and download JSON file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.isExportingData = false;
    this.toastService.success('User data exported successfully', 'Export Complete');
  }

  requestAccountDeletion(): void {
    const confirmMessage = `Are you sure you want to delete your account? This action cannot be undone.

Type "DELETE" to confirm:`;

    const userInput = prompt(confirmMessage);

    if (userInput === 'DELETE') {
      this.isDeletingAccount = true;

      // In a real implementation, you would call an API endpoint
      setTimeout(() => {
        this.isDeletingAccount = false;
        this.toastService.info('Account deletion request submitted. You will receive a confirmation email.', 'Request Submitted');
      }, 2000);
    }
  }

  // Privacy Settings
  savePrivacySettings(): void {
    // Save privacy settings (would call an API in real implementation)
    localStorage.setItem('privacySettings', JSON.stringify(this.privacySettings));
    this.toastService.success('Privacy settings updated', 'Success');
  }

  toggleActivityLogs(): void {
    this.showActivityLogs = !this.showActivityLogs;
    if (this.showActivityLogs) {
      this.loadActivityLogs();
    }
  }

  loadActivityLogs(): void {
    // Simulate loading activity logs
    this.activityLogs = [
      { date: new Date(), action: 'Login', details: 'Successful login from Chrome browser' },
      { date: new Date(Date.now() - 86400000), action: 'Profile Update', details: 'Updated phone number' },
      { date: new Date(Date.now() - 172800000), action: 'Password Change', details: 'Password changed successfully' },
      { date: new Date(Date.now() - 259200000), action: 'Chat Session', details: 'Started new chat session' }
    ];
  }

  // Modal controls
  onClose(): void {
    if (this.hasProfileChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        this.resetProfile();
        this.closeModal.emit();
      }
    } else {
      this.closeModal.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.onClose();
  }
}
