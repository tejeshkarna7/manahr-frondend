# 🏗️ ManaHR Frontend - Architecture Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [State Management Strategy](#state-management-strategy)
6. [API Integration](#api-integration)
7. [Authentication Flow](#authentication-flow)
8. [Routing & Navigation](#routing--navigation)
9. [Component Architecture](#component-architecture)
10. [Type Safety](#type-safety)
11. [Performance Optimizations](#performance-optimizations)
12. [Security Measures](#security-measures)

---

## Overview

ManaHR Frontend is a production-grade, enterprise-level HRMS dashboard built with modern web technologies. It follows industry best practices for scalability, maintainability, and performance.

**Key Characteristics:**
- **Server-First**: Leverages Next.js 14 App Router with Server Components
- **Type-Safe**: 100% TypeScript with strict mode
- **API-Driven**: RESTful API integration with proper error handling
- **Modular**: Feature-based folder structure
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessible**: WCAG 2.1 Level AA compliance goals

---

## Tech Stack

### Core Framework
- **Next.js 14.2.0** - React framework with App Router
- **React 18.3.0** - UI library
- **TypeScript 5.4.0** - Type safety

### State Management
- **TanStack Query 5.28.0** - Server state management
- **Zustand 4.5.2** - Client state management (auth, UI)

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **PostCSS** - CSS processing

### Forms & Validation
- **React Hook Form 7.51.0** - Form management
- **Zod 3.22.4** - Schema validation
- **@hookform/resolvers 3.3.4** - Zod integration

### HTTP Client
- **Axios 1.6.8** - HTTP requests with interceptors

### UI Components & Icons
- **Lucide React 0.363.0** - Icon library
- **React Hot Toast 2.4.1** - Notifications

### Charts & Visualization
- **Recharts 2.12.2** - Chart library

### Utilities
- **date-fns 3.6.0** - Date manipulation
- **clsx 2.1.0** - Conditional classes
- **tailwind-merge 2.2.2** - Tailwind class merging
- **class-variance-authority 0.7.0** - Component variants

---

## Project Structure

```
manahr-frontend/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                 # Route group for auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx          # Auth layout (split-screen)
│   │   ├── (dashboard)/            # Route group for protected pages
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── employees/          # Employee management
│   │   │   ├── attendance/         # Attendance management
│   │   │   ├── leaves/             # Leave management
│   │   │   ├── payroll/            # Payroll management
│   │   │   ├── documents/          # Document management
│   │   │   ├── roles/              # Roles & permissions
│   │   │   ├── settings/           # Settings
│   │   │   └── layout.tsx          # Dashboard layout (sidebar + topbar)
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Root page (redirects)
│   │   ├── providers.tsx           # React Query & Toast providers
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── Breadcrumbs.tsx (TBD)
│   │   └── features/               # Feature-specific components (TBD)
│   │       ├── employees/
│   │       ├── attendance/
│   │       └── leaves/
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts           # Axios instance & interceptors
│   │   └── utils.ts                # Utility functions
│   ├── services/                   # API service modules
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── attendance.service.ts
│   │   ├── leave.service.ts
│   │   ├── role.service.ts
│   │   └── dashboard.service.ts
│   ├── store/                      # Zustand stores
│   │   └── auth.store.ts           # Authentication state
│   ├── types/                      # TypeScript type definitions
│   │   └── index.ts                # All type definitions
│   ├── hooks/                      # Custom React hooks (TBD)
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   └── useDebounce.ts
│   ├── config/
│   │   └── index.ts                # App configuration
│   └── middleware.ts               # Next.js middleware (route protection)
├── .env.local                      # Environment variables
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind configuration
├── next.config.js                  # Next.js configuration
├── postcss.config.js               # PostCSS configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # Project overview
├── QUICK_START.md                  # Quick start guide
├── IMPLEMENTATION_STATUS.md        # Implementation status
└── ARCHITECTURE.md                 # This file
```

---

## Architecture Patterns

### 1. **Route Groups Pattern**
We use Next.js route groups to organize pages with different layouts:

- `(auth)` - Authentication pages with split-screen layout
- `(dashboard)` - Protected pages with sidebar + topbar layout

Benefits:
- Shared layouts without affecting URL structure
- Clear separation of concerns
- Easy to add new layout groups

### 2. **Service Layer Pattern**
All API calls are abstracted into service modules:

```typescript
// service/user.service.ts
class UserService {
  async getUsers(filters) {
    return await api.get('/users', { params: filters });
  }
}
```

Benefits:
- Centralized API logic
- Easy to mock for testing
- Type-safe API calls
- Reusable across components

### 3. **Composition Pattern**
UI components are composed from smaller, reusable pieces:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

Benefits:
- Flexible and reusable
- Consistent styling
- Easy to extend

### 4. **Container/Presenter Pattern**
Separate data fetching (containers) from presentation (components):

```typescript
// Container (page.tsx)
const { data, isLoading } = useQuery({...});
return <EmployeeList data={data} />;

// Presenter (EmployeeList.tsx)
export function EmployeeList({ data }) {
  return <div>{/* Render data */}</div>;
}
```

---

## State Management Strategy

### Server State (TanStack Query)
Used for:
- API data caching
- Background refetching
- Optimistic updates
- Loading states

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => userService.getUsers(filters),
  staleTime: 60 * 1000, // 1 minute
});
```

### Client State (Zustand)
Used for:
- Authentication state
- User information
- Permissions
- UI state (modals, sidebars)

```typescript
const { user, login, logout, hasPermission } = useAuthStore();
```

### Why This Split?
- **TanStack Query**: Handles server data complexity (caching, refetching, sync)
- **Zustand**: Lightweight for simple client state
- **No Redux**: Avoids boilerplate for this use case

---

## API Integration

### HTTP Client Setup
Located in `src/lib/api/client.ts`:

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Request interceptor - add token
apiClient.interceptors.request.use((config) => {
  const token = TokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token refresh logic
    if (error.response?.status === 401) {
      // Refresh token and retry
    }
    return Promise.reject(error);
  }
);
```

### Service Pattern
Each domain has its own service:

```typescript
class UserService {
  private baseUrl = '/users';

  async getUsers(filters?: UserFilters) {
    return await api.get(this.baseUrl, { params: filters });
  }

  async createUser(data: UserFormData) {
    return await api.post(this.baseUrl, data);
  }
}

export const userService = new UserService();
```

### Error Handling
Errors are caught and transformed into user-friendly messages:

```typescript
private handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
  throw error;
}
```

---

## Authentication Flow

### Registration
1. User fills registration form
2. Form validated with Zod schema
3. API call to `/auth/register`
4. Backend creates user and organization
5. Returns user + tokens
6. Frontend stores tokens in localStorage
7. Stores user in Zustand
8. Redirects to dashboard

### Login
1. User enters credentials
2. Form validated
3. API call to `/auth/login`
4. Backend validates credentials
5. Returns user + tokens
6. Frontend stores tokens
7. Stores user in Zustand
8. Redirects to dashboard

### Token Refresh
1. API call returns 401 Unauthorized
2. Interceptor catches error
3. Calls `/auth/refresh-token` with refresh token
4. Backend validates refresh token
5. Returns new access token
6. Interceptor updates tokens
7. Retries original request
8. If refresh fails, logout user

### Logout
1. User clicks logout
2. API call to `/auth/logout`
3. Backend invalidates tokens
4. Frontend clears localStorage
5. Clears Zustand store
6. Redirects to login

### Protected Routes
Middleware checks authentication:

```typescript
// middleware.ts
export function middleware(request) {
  const token = request.cookies.get('access_token');
  
  if (!token && !isPublicPath) {
    return redirect('/login');
  }
  
  if (token && isAuthPath) {
    return redirect('/dashboard');
  }
}
```

---

## Routing & Navigation

### File-Based Routing
Next.js App Router uses file system for routing:

```
app/
├── (dashboard)/
│   ├── dashboard/page.tsx    → /dashboard
│   ├── employees/page.tsx    → /employees
│   └── employees/[id]/page.tsx → /employees/123
```

### Dynamic Routes
```typescript
// app/employees/[id]/page.tsx
export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: employee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => userService.getUserById(id),
  });
  
  return <div>{employee.fullName}</div>;
}
```

### Navigation Methods
```typescript
// Declarative
<Link href="/employees">Employees</Link>

// Programmatic
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/employees');
router.back();
```

---

## Component Architecture

### Component Hierarchy
```
App
├── RootLayout (providers)
│   ├── AuthLayout (split-screen)
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   └── ForgotPasswordPage
│   └── DashboardLayout (sidebar + topbar)
│       ├── Sidebar (navigation)
│       ├── Topbar (search, notifications, profile)
│       └── Pages
│           ├── DashboardPage
│           ├── EmployeesPage
│           └── ...
```

### Component Types

#### 1. UI Components (`components/ui/`)
Pure, reusable, generic components:
- No business logic
- Accept props for configuration
- Styled with Tailwind
- Fully typed with TypeScript

Example:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant, size, onClick, children }: ButtonProps) {
  return <button className={cn(...)}>{children}</button>;
}
```

#### 2. Layout Components (`components/layout/`)
App shell components:
- Sidebar
- Topbar
- Breadcrumbs
- Page headers

#### 3. Feature Components (`components/features/`)
Domain-specific components:
- EmployeeCard
- AttendanceCalendar
- LeaveApprovalWidget
- PayslipViewer

#### 4. Page Components (`app/(dashboard)/*/page.tsx`)
Route-level components:
- Data fetching with React Query
- Compose UI and feature components
- Handle loading and error states

---

## Type Safety

### Type Definition Strategy
All types mirror backend schemas exactly:

```typescript
// Backend Schema
const UserSchema = {
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive', 'suspended'] },
  // ...
};

// Frontend Type
export interface User {
  fullName: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  // ...
}
```

### Type Exports
```typescript
// Centralized in src/types/index.ts
export type { User, UserStatus, UserFilters };
export type { Role, Permission, DataAccessLevel };
export type { Attendance, AttendanceStatus };
// ...
```

### Form Validation with Zod
```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const { register, handleSubmit } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

### API Type Safety
```typescript
// Service returns typed data
async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
  return await api.get<PaginatedResponse<User>>('/users', { params: filters });
}

// Component receives typed data
const { data } = useQuery<PaginatedResponse<User>>({
  queryKey: ['users'],
  queryFn: () => userService.getUsers(),
});
```

---

## Performance Optimizations

### 1. **Server Components by Default**
Next.js 14 renders components on server by default:
- Faster initial load
- Better SEO
- Reduced JavaScript bundle

Use `'use client'` only when needed:
- useState, useEffect hooks
- Event handlers
- Browser APIs

### 2. **Code Splitting**
Next.js automatically code-splits by route:
```
dashboard.js       # Only for /dashboard
employees.js       # Only for /employees
attendance.js      # Only for /attendance
```

### 3. **Image Optimization**
Use Next.js Image component:
```typescript
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  loading="lazy"
/>
```

### 4. **React Query Caching**
Automatic caching reduces API calls:
```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 60 * 1000,     // Cache for 1 minute
  cacheTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
});
```

### 5. **Debounced Search**
Reduce API calls on user input:
```typescript
const debouncedSearch = useDebounce(searchTerm, 500);

useQuery({
  queryKey: ['users', debouncedSearch],
  queryFn: () => userService.getUsers({ search: debouncedSearch }),
  enabled: debouncedSearch.length > 2,
});
```

### 6. **Lazy Loading**
Load components on demand:
```typescript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Don't render on server
});
```

---

## Security Measures

### 1. **XSS Protection**
React escapes output by default:
```typescript
<div>{user.name}</div> // Automatically escaped
```

For HTML, use sanitization:
```typescript
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### 2. **CSRF Protection**
- Backend should validate origin headers
- Use SameSite cookies
- Include CSRF tokens in forms

### 3. **Secure Token Storage**
```typescript
// ✅ Good: localStorage (for web apps)
localStorage.setItem('access_token', token);

// ❌ Bad: Plain cookies (vulnerable to XSS)
document.cookie = `token=${token}`;

// ✅ Better: httpOnly cookies (set by backend)
```

### 4. **Input Validation**
All inputs validated with Zod:
```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(100),
});
```

### 5. **Permission-Based UI**
Hide/disable features based on permissions:
```typescript
{hasPermission('users:delete') && (
  <Button onClick={deleteUser} variant="danger">
    Delete
  </Button>
)}
```

### 6. **Environment Variables**
Never commit secrets:
```env
# .env.local (not in git)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
JWT_SECRET=super-secret-key-here
```

---

## Best Practices Followed

1. ✅ **TypeScript Strict Mode** - Maximum type safety
2. ✅ **ESLint** - Code quality rules
3. ✅ **Prettier** - Consistent formatting
4. ✅ **Component Composition** - Reusable building blocks
5. ✅ **Single Responsibility** - One component, one job
6. ✅ **DRY Principle** - Don't repeat yourself
7. ✅ **Error Boundaries** - Graceful error handling
8. ✅ **Loading States** - Better UX during async operations
9. ✅ **Empty States** - Helpful when no data
10. ✅ **Responsive Design** - Mobile-first approach
11. ✅ **Accessibility** - ARIA labels, keyboard navigation
12. ✅ **Performance** - Code splitting, lazy loading, caching

---

## Future Enhancements

### Planned Features
- [ ] Internationalization (i18n) with next-intl
- [ ] Dark mode support
- [ ] PWA capabilities
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Bulk operations UI
- [ ] Export to PDF/Excel
- [ ] Email templates
- [ ] Notification center
- [ ] Activity logs viewer

### Technical Improvements
- [ ] Unit tests with Jest + React Testing Library
- [ ] E2E tests with Playwright
- [ ] Storybook for component documentation
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Docker containerization
- [ ] Performance monitoring with Vercel Analytics
- [ ] Error tracking with Sentry

---

## Conclusion

This architecture provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear structure and patterns
- **Performance**: Optimized for speed
- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Modern tools and workflows
- **User Experience**: Fast, responsive, intuitive

The foundation is solid. Build upon it! 🚀
