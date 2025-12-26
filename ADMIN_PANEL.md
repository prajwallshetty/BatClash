# Admin Panel Documentation

## Overview

A secure, production-ready admin panel for managing the Batclash coding platform. Access is restricted to users with the email specified in `ADMIN_EMAIL` environment variable.

## Security

### Access Control
- **Server-side validation**: All API routes validate admin access using `requireAdmin()`
- **Client-side protection**: AdminLayout component checks admin status and redirects non-admins
- **Environment-based**: Admin email is stored in `ADMIN_EMAIL` environment variable
- **Session-based**: Uses NextAuth session to verify admin identity

### Environment Variable
Add to `.env.local`:
```env
ADMIN_EMAIL=your-admin@email.com
```

## Routes

### Admin Pages
- `/admin` - Dashboard with platform statistics
- `/admin/problems` - Problem management (list, create, edit, delete)
- `/admin/categories` - Category management (CRUD)
- `/admin/users` - User management (view, actions)

### API Routes
All API routes are under `/api/admin/*` and require admin authentication:

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/problems` - List problems (with filters)
- `POST /api/admin/problems` - Create new problem
- `GET /api/admin/problems/[id]` - Get problem details
- `PUT /api/admin/problems/[id]` - Update problem
- `DELETE /api/admin/problems/[id]` - Delete problem
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category (prevents if problems exist)
- `GET /api/admin/users` - List users (with search)
- `PUT /api/admin/users/[id]/streak` - Reset user streak
- `PUT /api/admin/users/[id]/xp` - Adjust user XP
- `PUT /api/admin/users/[id]/ban` - Ban/unban user

## Features

### Problem Management
- **List**: View all problems with filtering by category and difficulty
- **Create**: Full form with slug, title, category, topic, difficulty, description, starter code, and test cases
- **Edit**: Update existing problems
- **Delete**: Remove problems (with confirmation)

### Category Management
- **CRUD Operations**: Create, read, update, and delete categories
- **Protection**: Prevents deletion if problems are assigned to the category
- **Slug Generation**: Auto-generates slug from category name

### User Management
- **Search**: Search users by name or email
- **View**: See user stats (XP, streak, rank, solved count)
- **Actions**:
  - Reset streak to 0
  - Adjust XP (add/subtract)
  - Ban/unban users (soft ban)

### Dashboard
- **Statistics**: Total problems, users, categories
- **Distribution**: Problems by category and difficulty
- **Overview**: Quick platform metrics

## Database Changes

### User Model
Added `banned` field:
```typescript
banned: boolean; // Default: false, indexed
```

### Category Model
New model for managing problem categories:
```typescript
{
  name: string;      // Unique
  slug: string;      // Unique, indexed
  description: string;
}
```

## Components

### AdminLayout
- Sidebar navigation with active state
- Admin access check and redirect
- Responsive design
- Back to site link

### Pages
- Clean, minimal UI with black & white theme
- Card-based layouts
- Form validation
- Error handling

## Usage

1. **Set Admin Email**: Add `ADMIN_EMAIL` to `.env.local`
2. **Access Panel**: Navigate to `/admin` (must be logged in with admin email)
3. **Manage Content**: Use sidebar to navigate between sections
4. **API Access**: All operations go through protected API routes

## Security Best Practices

1. **Never expose admin logic to client**: All validation happens server-side
2. **Environment variables**: Admin email is never hardcoded
3. **Session validation**: Every API call validates admin status
4. **Error messages**: Generic errors for unauthorized access
5. **Input validation**: All forms validate input before submission

## Future Enhancements

- Pagination for large datasets
- Bulk operations (bulk delete, bulk update)
- Activity logs
- Export functionality
- Advanced filtering and sorting

