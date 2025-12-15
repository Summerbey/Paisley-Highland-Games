# PAISLEY HIGHLAND GAMES - REACT COMPONENT ARCHITECTURE

## Component Structure Overview

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx                 // Navigation bar with logo, menu, user account
│   │   ├── Footer.tsx                 // Contact info, social links, privacy policy
│   │   ├── Sidebar.tsx                // Filter sidebar for listings
│   │   └── Layout.tsx                 // Main layout wrapper
│   │
│   ├── common/
│   │   ├── Button.tsx                 // Reusable button component
│   │   ├── Card.tsx                   // Card container component
│   │   ├── Modal.tsx                  // Modal dialog component
│   │   ├── Input.tsx                  // Form input component
│   │   ├── Select.tsx                 // Dropdown select component
│   │   ├── Badge.tsx                  // Status badge component
│   │   ├── Loader.tsx                 // Loading spinner
│   │   ├── ErrorMessage.tsx           // Error display component
│   │   ├── SuccessMessage.tsx         // Success message component
│   │   └── ConfirmDialog.tsx          // Confirmation dialog
│   │
│   ├── competitions/
│   │   ├── CompetitionCard.tsx        // Competition display card
│   │   ├── CompetitionList.tsx        // List of competitions with filters
│   │   ├── CompetitionDetail.tsx      // Detailed competition view
│   │   ├── CompetitionFilters.tsx     // Filter sidebar component
│   │   └── RegistrationForm.tsx       // Multi-step registration form
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx              // Login form component
│   │   ├── RegisterForm.tsx           // Registration form component
│   │   ├── ProtectedRoute.tsx         // Route guard component
│   │   └── RoleGuard.tsx              // Role-based access control
│   │
│   ├── dashboard/
│   │   ├── UserDashboard.tsx          // Competitor dashboard
│   │   ├── MyRegistrations.tsx        // User's registrations list
│   │   ├── PersonalSchedule.tsx       // User's event schedule
│   │   └── ProfileSettings.tsx        // Profile management
│   │
│   ├── admin/
│   │   ├── AdminDashboard.tsx         // Admin overview
│   │   ├── UserManagement.tsx         // User CRUD interface
│   │   ├── CompetitionManagement.tsx  // Competition CRUD interface
│   │   ├── RegistrationReview.tsx     // Review applications
│   │   ├── VendorManagement.tsx       // Vendor approval interface
│   │   └── Analytics.tsx              // Statistics and charts
│   │
│   ├── results/
│   │   ├── ResultsList.tsx            // Competition results display
│   │   ├── Leaderboard.tsx            // Top performers
│   │   ├── ResultEntry.tsx            // Judge result entry form
│   │   └── RecordsDisplay.tsx         // All-time records
│   │
│   └── vendors/
│       ├── VendorCard.tsx             // Vendor display card
│       ├── VendorDirectory.tsx        // Public vendor listing
│       ├── VendorApplication.tsx      // Vendor application form
│       └── VendorDashboard.tsx        // Vendor management interface
│
├── pages/
│   ├── Home.tsx                       // Landing page
│   ├── Competitions.tsx               // Competitions listing page
│   ├── CompetitionDetail.tsx          // Single competition page
│   ├── Schedule.tsx                   // Event schedule page
│   ├── Results.tsx                    // Results page
│   ├── Login.tsx                      // Login page
│   ├── Register.tsx                   // Registration page
│   ├── Dashboard.tsx                  // User dashboard page
│   ├── Admin.tsx                      // Admin panel page
│   ├── Vendors.tsx                    // Vendor directory page
│   ├── About.tsx                      // About the event page
│   └── NotFound.tsx                   // 404 page
│
├── contexts/
│   ├── AuthContext.tsx                // Authentication state management
│   ├── CompetitionContext.tsx         // Competition data management
│   └── ThemeContext.tsx               // Theme/UI state management
│
├── services/
│   ├── api.ts                         // Axios configuration
│   ├── authService.ts                 // Authentication API calls
│   ├── competitionService.ts          // Competition API calls
│   ├── registrationService.ts         // Registration API calls
│   ├── resultService.ts               // Results API calls
│   ├── vendorService.ts               // Vendor API calls
│   └── userService.ts                 // User management API calls
│
├── hooks/
│   ├── useAuth.ts                     // Authentication hook
│   ├── useCompetitions.ts             // Competitions data hook
│   ├── useRegistrations.ts            // Registrations data hook
│   ├── useForm.ts                     // Form handling hook
│   └── useDebounce.ts                 // Debounce hook for search
│
├── utils/
│   ├── dateFormatter.ts               // Date formatting utilities
│   ├── validation.ts                  // Form validation functions
│   ├── constants.ts                   // App constants
│   └── helpers.ts                     // Helper functions
│
└── types/
    └── index.ts                       // TypeScript type definitions

## Key Components Description

### Layout Components

**Header.tsx**
- Responsive navigation bar
- Logo and brand identity
- Main navigation links (Home, Competitions, Schedule, Results, Vendors)
- User account menu (Login, Profile, Dashboard, Logout)
- Mobile hamburger menu
- Breadcrumb navigation on inner pages

**Footer.tsx**
- Contact information
- Social media links
- Quick links (About, Privacy Policy, Terms of Service)
- Copyright notice
- Accessibility statement link

**Layout.tsx**
- Wrapper component that includes Header and Footer
- Main content area with consistent spacing
- Responsive container
- Props for page-specific settings

### Common Components

**Button.tsx**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Card.tsx**
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
```

**Modal.tsx**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### Competition Components

**CompetitionCard.tsx**
- Competition name and category badge
- Date, time, and location
- Capacity indicator (15/20 registered)
- Brief description
- Status badge (Open, Closed, Full)
- Quick action buttons (View Details, Register)

**CompetitionList.tsx**
- Grid layout of CompetitionCards
- Pagination controls
- Empty state handling
- Loading state
- Integration with filters

**CompetitionFilters.tsx**
- Category checkboxes (Athletic, Dance, Piping, Drumming)
- Date range picker
- Status filter
- Age group filter
- Search input
- Clear filters button
- Apply filters button

**RegistrationForm.tsx**
Multi-step registration process:
1. Personal Information (pre-filled from profile)
2. Emergency Contact
3. Document Uploads (medical certificates, etc.)
4. Review and Consent
- Progress indicator
- Form validation
- File upload with preview
- Navigation between steps
- Error handling

### Dashboard Components

**UserDashboard.tsx**
- Welcome message with user name
- Statistics cards (Total Registrations, Upcoming Events, Past Results)
- Recent registrations table
- Upcoming schedule
- Quick actions section
- Important announcements

**MyRegistrations.tsx**
- Filterable table of user's registrations
- Status badges (Pending, Approved, Rejected)
- Action buttons (View, Edit, Cancel)
- Confirmation dialogs
- Export functionality

**PersonalSchedule.tsx**
- Timeline view of registered events
- Calendar integration
- Conflict warnings
- Reminder settings
- Print/export options

### Admin Components

**AdminDashboard.tsx**
- Key metrics cards (Total Users, Active Registrations, Pending Applications)
- Recent activity feed
- Charts and visualizations
- Quick action sidebar
- System health indicators

**RegistrationReview.tsx**
- List of pending applications
- Detailed application view
- Document viewer
- Approve/Reject buttons with notes
- Bulk actions
- Email notification preview

## Routing Structure

```typescript
// App.tsx routing
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/competitions" element={<Competitions />} />
  <Route path="/competitions/:id" element={<CompetitionDetail />} />
  <Route path="/schedule" element={<Schedule />} />
  <Route path="/results" element={<Results />} />
  <Route path="/vendors" element={<Vendors />} />
  <Route path="/about" element={<About />} />
  
  {/* Auth Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected Routes */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  
  {/* Admin Routes */}
  <Route path="/admin/*" element={
    <ProtectedRoute requiredRole="admin">
      <Admin />
    </ProtectedRoute>
  } />
  
  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## State Management

### AuthContext
- User authentication state
- Login/logout functions
- Token management
- Current user data
- Role-based permissions

### CompetitionContext
- List of competitions
- Selected competition
- Filter state
- Refresh functions
- Cache management

## API Service Layer

All API calls go through service modules that:
1. Handle HTTP requests using Axios
2. Manage authentication tokens
3. Transform data as needed
4. Handle errors consistently
5. Provide TypeScript types

Example service pattern:
```typescript
// competitionService.ts
export const competitionService = {
  getAll: (filters?: CompetitionFilters) => 
    api.get<PaginatedResponse<Competition>>('/competitions', { params: filters }),
  
  getById: (id: string) => 
    api.get<ApiResponse<Competition>>(`/competitions/${id}`),
  
  create: (data: Partial<Competition>) => 
    api.post<ApiResponse<Competition>>('/competitions', data),
  
  update: (id: string, data: Partial<Competition>) => 
    api.put<ApiResponse<Competition>>(`/competitions/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/competitions/${id}`),
};
```

## Custom Hooks

### useAuth
```typescript
const { user, login, logout, register, isAuthenticated, hasRole } = useAuth();
```

### useCompetitions
```typescript
const { 
  competitions, 
  loading, 
  error, 
  filters, 
  setFilters, 
  refresh 
} = useCompetitions();
```

## Styling Approach

- Tailwind CSS utility classes for layout and spacing
- Custom theme colors defined in tailwind.config.js
- Responsive design mobile-first
- Dark mode support (future enhancement)
- Accessibility-first approach (ARIA labels, keyboard navigation)

## Performance Optimizations

1. **Code Splitting**: React.lazy() for route-based code splitting
2. **Memoization**: React.memo() for expensive components
3. **Virtualization**: For long lists (react-window)
4. **Image Optimization**: Lazy loading, responsive images
5. **Caching**: React Query for server state management (future)

## Testing Strategy

- Unit tests: Jest + React Testing Library
- Integration tests: Testing user flows
- E2E tests: Playwright (future)
- Accessibility tests: axe-core

## Development Workflow

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. Access application at `http://localhost:3000`
4. Backend API expected at `http://localhost:5000`

## Build and Deployment

1. Run `npm run build` to create production build
2. Output in `dist/` directory
3. Deploy to Vercel using GitHub integration
4. Environment variables managed in Vercel dashboard
