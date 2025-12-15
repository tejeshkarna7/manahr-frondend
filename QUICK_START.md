# 🚀 ManaHR Frontend - Quick Start Guide

## ✅ Prerequisites

Before you begin, ensure you have:
- **Node.js** 20.x or higher installed
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:5000`
- **Git** (optional, for version control)

---

## 📦 Installation Steps

### 1. Navigate to Project Directory
```bash
cd c:\Users\HemanthKarna\Documents\Node\manahr-frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- TanStack React Query
- Axios
- Zustand
- React Hook Form + Zod
- Lucide Icons
- And more...

### 3. Configure Environment Variables
The `.env.local` file has already been created. Verify it contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ManaHR
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_JWT_EXPIRE=24h
NEXT_PUBLIC_JWT_REFRESH_EXPIRE=7d
```

**Important:** Make sure your backend API is running on `http://localhost:5000`

### 4. Run Development Server
```bash
npm run dev
```

The application will start on: **http://localhost:3000**

---

## 🎯 First Time Setup

### Step 1: Register Your Organization
1. Open browser to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Click **"Create one now"** to go to registration
4. Fill in the form:
   - Full Name: `Your Name`
   - Email: `admin@yourcompany.com`
   - Phone: `1234567890`
   - Organization Name: `Your Company`
   - Organization Code: `COMPANY01` (unique, uppercase)
   - Password: `password123` (min 6 chars)
5. Click **"Create Account"**

### Step 2: You're In!
After successful registration:
- You'll be automatically logged in
- Redirected to `/dashboard`
- Your auth token is stored securely
- You can navigate through the sidebar

---

## 🧪 Testing the Application

### Test Authentication
1. **Login**: Go to `/login`
   - Use the email and password you registered with
   - Click "Sign In"
   - Should redirect to dashboard

2. **Logout**: 
   - Click profile dropdown in topbar
   - Click "Logout"
   - Should redirect to login page

3. **Forgot Password**:
   - Go to `/forgot-password`
   - Enter your email
   - (Backend should send reset email)

### Test Dashboard
1. Navigate to `/dashboard`
2. You should see:
   - KPI cards (Employees, Attendance, Leaves, Payroll)
   - Attendance overview chart
   - Recent activities feed
   - Department distribution

### Test API Integration
Open browser DevTools (F12) → Network tab:
- Login should call `POST /api/auth/login`
- Dashboard should call `GET /api/dashboard/data`
- All requests should have `Authorization: Bearer <token>` header

---

## 🔧 Development Workflow

### Running the App
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run TypeScript type checking
npm run type-check

# Run linting
npm run lint
```

### File Structure Overview
```
manahr-frontend/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Root page (redirects to login)
│   │   ├── providers.tsx     # React Query provider
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   └── layout/           # Sidebar, Topbar
│   ├── lib/
│   │   ├── api/              # API client
│   │   └── utils.ts          # Utility functions
│   ├── services/             # API service modules
│   ├── store/                # Zustand stores
│   ├── types/                # TypeScript types
│   ├── hooks/                # Custom React hooks
│   ├── config/               # App configuration
│   └── middleware.ts         # Route protection
├── public/                    # Static assets
├── .env.local                # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
└── next.config.js            # Next.js config
```

---

## 📝 Available Pages

### ✅ Implemented Pages
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request
- `/dashboard` - Main dashboard (KPIs, charts, activities)

### 🚧 To Be Implemented
- `/employees` - Employee list
- `/employees/create` - Create employee
- `/employees/[id]` - Employee details
- `/employees/[id]/edit` - Edit employee
- `/attendance` - Attendance management
- `/leaves` - Leave management
- `/payroll` - Payroll management
- `/documents` - Document management
- `/roles` - Roles & permissions
- `/settings` - Application settings
- `/profile` - User profile

---

## 🎨 UI Components Available

All components are in `src/components/ui/`:

```typescript
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner, PageLoader } from '@/components/ui/LoadingSpinner';
import { EmptyState, NoResults } from '@/components/ui/EmptyState';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
```

### Example Usage:
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Input 
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>

<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

---

## 🔌 API Services Available

All services are in `src/services/`:

```typescript
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { attendanceService } from '@/services/attendance.service';
import { leaveService } from '@/services/leave.service';
import { roleService, permissionService } from '@/services/role.service';
import { dashboardService } from '@/services/dashboard.service';
```

### Example: Fetching Data with React Query
```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export default function EmployeesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['employees', { page: 1 }],
    queryFn: () => userService.getEmployees({ page: 1, limit: 10 }),
  });

  if (isLoading) return <PageLoader />;
  if (error) return <Alert type="error" message="Failed to load" />;

  return <div>{/* Render data */}</div>;
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Issue: CORS errors in browser console
**Solution:**
- Ensure backend has CORS enabled for `http://localhost:3000`
- Check backend CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: "401 Unauthorized" on dashboard
**Solution:**
- Check if token is stored: DevTools → Application → Local Storage
- Try logging out and logging in again
- Ensure backend JWT_SECRET matches

### Issue: Styles not loading
**Solution:**
```bash
npm run dev
# Hard refresh browser: Ctrl+Shift+R
```

### Issue: TypeScript errors
**Solution:**
```bash
npm run type-check
# Fix any reported errors
```

---

## 📚 Next Steps

### Implement Employee Module (Example)
1. Create employee list page:
   ```bash
   src/app/(dashboard)/employees/page.tsx
   ```

2. Use the pattern:
   ```tsx
   'use client';
   
   import { useState } from 'react';
   import { useQuery } from '@tanstack/react-query';
   import { userService } from '@/services/user.service';
   import { DataTable } from '@/components/ui/DataTable';
   import { Button } from '@/components/ui/Button';
   
   export default function EmployeesPage() {
     const [page, setPage] = useState(1);
     
     const { data, isLoading } = useQuery({
       queryKey: ['employees', page],
       queryFn: () => userService.getEmployees({ page, limit: 10 }),
     });
   
     const columns = [
       { key: 'employeeCode', header: 'Employee ID', sortable: true },
       { key: 'fullName', header: 'Name', sortable: true },
       { key: 'department', header: 'Department', sortable: true },
       { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
     ];
   
     return (
       <div>
         <div className="flex justify-between mb-6">
           <h1 className="text-2xl font-bold">Employees</h1>
           <Button href="/employees/create">Add Employee</Button>
         </div>
         <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />
       </div>
     );
   }
   ```

### Add More Services
If you need additional services (e.g., PayrollService, DocumentService), follow the pattern in existing services:

```typescript
// src/services/payroll.service.ts
import { api } from '@/lib/api/client';
import { Payroll, PayrollFilters } from '@/types';

class PayrollService {
  async getPayrolls(filters?: PayrollFilters) {
    return await api.get('/payroll', { params: filters });
  }
  
  async generatePayroll(data: any) {
    return await api.post('/payroll/generate', data);
  }
}

export const payrollService = new PayrollService();
```

---

## 🎓 Learning Resources

- **Next.js 14**: https://nextjs.org/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

## 🤝 Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify backend is running
4. Ensure environment variables are correct
5. Review `IMPLEMENTATION_STATUS.md` for implementation details

---

## ✅ Verification Checklist

Before proceeding with development, verify:
- [ ] Dependencies installed (`node_modules` exists)
- [ ] Environment variables configured (`.env.local`)
- [ ] Backend API is running and accessible
- [ ] Development server starts without errors
- [ ] Can access login page at `http://localhost:3000/login`
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] No CORS errors in browser console
- [ ] Token is stored in localStorage
- [ ] Logout works correctly

---

## 🎉 You're All Set!

Your ManaHR frontend is now ready for development. The foundation is complete with:
- ✅ Complete type system
- ✅ API client with auth
- ✅ Authentication flow
- ✅ Dashboard layout
- ✅ Reusable components
- ✅ Working dashboard

Start building your feature modules! 🚀
