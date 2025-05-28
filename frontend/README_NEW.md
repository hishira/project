# Sports Activity Diary - Frontend

A comprehensive Angular frontend application for tracking and visualizing sports activities with beautiful Material Design UI and interactive charts.

## 🚀 Features

- **Authentication System**: Secure login/register with JWT token management
- **Activity Management**: CRUD operations for sports activities with filtering and search
- **Statistics Dashboard**: Interactive charts and analytics with Chart.js
- **Responsive Design**: Mobile-first design with Angular Material
- **Modern Angular**: Built with Angular 19 and standalone components
- **Real-time Updates**: Automatic token refresh and error handling

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API server running on `http://localhost:3001`

## 🛠️ Installation

1. **Clone the repository and navigate to frontend**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Update `src/environments/environment.ts` if needed
   - Default API URL is set to `http://localhost:3001/api`

## 🚦 Development

**Start the development server**:
```bash
npm start
```

The application will be available at `http://localhost:4200`

**Build for production**:
```bash
npm run build
```

**Run tests**:
```bash
npm test
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                     # Core services and guards
│   │   ├── services/
│   │   │   ├── auth.service.ts   # Authentication service
│   │   │   ├── activity.service.ts # Activity CRUD operations
│   │   │   └── statistics.service.ts # Statistics and charts
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # Route protection
│   │   └── interceptors/
│   │       └── auth.interceptor.ts # HTTP interceptor
│   ├── shared/
│   │   └── models/               # TypeScript interfaces
│   │       ├── user.model.ts
│   │       ├── activity.model.ts
│   │       ├── statistics.model.ts
│   │       ├── auth.model.ts
│   │       └── common.model.ts
│   ├── features/                 # Feature modules
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/            # Main dashboard
│   │   ├── activities/           # Activity management
│   │   │   ├── activity-list/
│   │   │   ├── activity-form/
│   │   │   └── activity-detail/
│   │   └── statistics/           # Statistics and charts
│   │       └── statistics-dashboard/
│   ├── app.component.ts
│   ├── app.config.ts            # App configuration
│   └── app.routes.ts            # Routing configuration
├── environments/                 # Environment configs
└── styles.scss                  # Global styles and theming
```

## 🎨 UI Components

### Authentication
- **Login Page**: Email/password login with validation
- **Register Page**: User registration with form validation
- **Auth Guard**: Protects authenticated routes

### Dashboard
- **Overview Cards**: Quick stats and metrics
- **Recent Activities**: Latest activity cards
- **Quick Actions**: Fast navigation to key features

### Activities
- **Activity List**: Paginated grid with filtering and search
- **Activity Form**: Create/edit activities with validation
- **Activity Detail**: Detailed view with statistics

### Statistics
- **Overview Metrics**: Total activities, duration, calories
- **Activity Distribution**: Pie charts for types and intensity
- **Trends**: Line charts showing activity patterns over time
- **Goals**: Progress tracking with circular progress indicators

## 🔧 Key Technologies

- **Angular 19**: Latest stable version with standalone components
- **Angular Material**: Complete UI component library
- **Chart.js + ng2-charts**: Interactive charts and visualizations
- **RxJS**: Reactive programming for data streams
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with variables and mixins

## 🎯 API Integration

The frontend integrates with the NestJS backend API:

- **Base URL**: `http://localhost:3001/api`
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Global error interceptor
- **Loading States**: Comprehensive loading indicators

### Available Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /activities` - List activities with pagination
- `POST /activities` - Create new activity
- `GET /activities/:id` - Get activity details
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity
- `GET /user-statistics` - Get user statistics

## 🎨 Theming

The application uses a custom Angular Material theme with:

- **Primary Color**: Indigo palette (#3f51b5)
- **Accent Color**: Pink palette (#e91e63)
- **Typography**: Roboto font family
- **Custom Components**: Rounded cards and buttons
- **Responsive Design**: Mobile-first approach

## 📱 Responsive Features

- **Mobile Navigation**: Collapsible sidebar on mobile
- **Adaptive Charts**: Charts resize based on screen size
- **Touch-Friendly**: Large touch targets for mobile devices
- **Progressive Enhancement**: Works on all device sizes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Seamless session management
- **Route Guards**: Protected routes for authenticated users
- **CSRF Protection**: Built-in Angular protections
- **Input Validation**: Client-side and server-side validation

## 🚀 Performance Optimizations

- **Lazy Loading**: Feature modules loaded on demand
- **OnPush Strategy**: Optimized change detection
- **Standalone Components**: Reduced bundle size
- **Tree Shaking**: Unused code elimination
- **Preloading**: Strategic module preloading

## 🧪 Testing

The application includes comprehensive testing setup:

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e

# Generate test coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Ensure backend server is running on port 3001
   - Check CORS configuration in backend
   - Verify API endpoints in environment files

2. **Authentication Problems**:
   - Clear browser localStorage
   - Check token expiration
   - Verify JWT secret configuration

3. **Chart Display Issues**:
   - Ensure Chart.js is properly imported
   - Check canvas element dimensions
   - Verify chart data format

### Debug Mode

Enable debug mode in environment files:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  debug: true
};
```

## 📝 Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Write unit tests for new features
4. Follow commit message conventions
5. Update documentation for API changes

## 📄 License

This project is licensed under the MIT License.
