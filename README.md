# ManaHR - Frontend Dashboard

Production-grade HRMS application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query + Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Core utilities
│   ├── api/             # API client
│   └── utils/           # Helper functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── services/            # API services
├── store/               # Zustand stores
└── config/              # App configuration
```

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

- JWT-based authentication
- Token refresh mechanism
- Protected routes with middleware
- Role-based access control (RBAC)
- Multi-tenant organization support

## 📚 Key Features

- **Dashboard**: KPIs, charts, analytics
- **User Management**: CRUD, bulk operations
- **Attendance**: Clock in/out, reports
- **Leave Management**: Apply, approve, track balance
- **Payroll**: Generate, view payslips
- **Documents**: Upload, manage, preview
- **Roles & Permissions**: RBAC system
- **Settings**: Company, attendance config
- **ManaBot**: AI HR assistant

## 🏗️ Architecture Decisions

### 1. App Router
Using Next.js 14 App Router for:
- Server components by default
- Better performance
- Route groups for logical separation
- Layout composition

### 2. Feature-Based Structure
Organizing by features rather than technical layers for:
- Better scalability
- Easier maintenance
- Clear boundaries

### 3. API Layer
Centralized API client with:
- Automatic token injection
- Token refresh logic
- Error handling
- Type safety

### 4. State Management
- **TanStack Query**: Server state (API data)
- **Zustand**: Client state (auth, UI)
- Minimal global state, prefer server state

### 5. Type Safety
- Strict TypeScript
- Zod schemas for validation
- Types matching backend exactly
- Type-safe API calls

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

## 🎨 UI/UX Guidelines

- Clean, minimal, professional design
- Desktop-first, mobile-friendly
- Consistent spacing and typography
- Loading states and skeletons
- Error boundaries
- Toast notifications
- Accessible components

## 🔒 Security

- XSS protection
- CSRF prevention
- Secure token storage
- Input sanitization
- Permission-based UI
- API request validation

## 📦 Build & Deploy

```bash
npm run build
npm run start
```

Deploy to Vercel, Netlify, or any Node.js hosting platform.

## 📄 License

Proprietary - ManaHR HRMS
# manahr-frondend
