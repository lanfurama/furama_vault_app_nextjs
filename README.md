# Furama Vault - Professional Guest Management System

A modern, enterprise-grade guest management system built with Next.js 14, TypeScript, and Tailwind CSS. Designed for hospitality businesses with advanced analytics, reporting, and data management capabilities.

## ✨ Features

### 🎨 Modern UI/UX
- **Professional Design**: Clean, modern interface optimized for business use
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Micro-interactions and transitions for better UX

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Live guest counts, email coverage, country distribution
- **Interactive Charts**: Monthly trends, country analysis with Chart.js
- **Performance Metrics**: Growth rates, registration patterns
- **Visual Insights**: Easy-to-understand data visualization

### 👥 Guest Management
- **Advanced Data Table**: Sortable, filterable, searchable guest list
- **Bulk Operations**: Select multiple guests for batch actions
- **Export Functionality**: Excel export with XLSX
- **Real-time Search**: Instant filtering by name, email, country

### 🔧 System Features
- **API Integration**: Configurable backend API connection
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading indicators and skeleton screens
- **Performance Optimized**: Lazy loading, efficient rendering

### 📈 Reporting & Analytics
- **Multiple Report Types**: Guest lists, email lists, country analysis
- **Date Range Filtering**: Custom date range selection
- **Export Options**: Various export formats and configurations
- **Report History**: Track and download previous reports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API (optional, can use mock data)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furama_vault_app_nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Configuration

1. **API Setup**: Go to Settings page and configure your backend API URL
2. **Theme**: Toggle between light and dark mode using the sidebar
3. **Data**: The system will automatically fetch guest data from your API

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Charts**: Chart.js with react-chartjs-2
- **Data Export**: XLSX library

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── analytics/         # Analytics dashboard
│   ├── reports/           # Reports generation
│   ├── settings/          # System settings
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── AnimatedCard.tsx   # Animated card component
│   ├── Chart.tsx          # Chart wrapper
│   ├── DataTable.tsx       # Advanced data table
│   ├── ErrorBoundary.tsx  # Error handling
│   ├── Header.tsx         # Top navigation
│   ├── Modal.tsx          # Modal dialogs
│   ├── Sidebar.tsx        # Side navigation
│   ├── StatsCard.tsx      # Statistics cards
│   └── Toast.tsx          # Notifications
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # API management
│   └── useTheme.ts        # Theme management
└── utils/                 # Utility functions
    └── exportUtils.ts     # Data export helpers
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for neutral elements  
- **Success**: Green for positive actions
- **Warning**: Orange for caution
- **Danger**: Red for errors/destructive actions

### Components
- **Cards**: Elevated containers with hover effects
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Consistent input styling with focus states
- **Tables**: Sortable, filterable data tables
- **Modals**: Accessible modal dialogs
- **Toasts**: Non-intrusive notifications

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Large Screens**: Maximum content width with proper spacing (1280px+)

## 🔧 Customization

### Theme Customization
Edit `tailwind.config.js` to modify:
- Color schemes
- Typography
- Spacing
- Animations
- Component styles

### Component Customization
All components are built with Tailwind classes and can be easily customized by:
- Modifying className props
- Extending component props
- Creating new variants

## 📊 API Integration

### Expected API Structure
```typescript
interface Guest {
  id: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  country?: string
  created_at?: string
  updated_at?: string
}
```

### API Endpoints
- `GET /api/guests` - Fetch all guests
- `GET /api/test-connection` - Test API connection

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **AWS**: Use AWS Amplify or custom server setup
- **Docker**: Create Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering options
- [ ] Guest profile management
- [ ] Email marketing integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Data backup/restore
- [ ] User authentication
- [ ] Role-based access control

---

Built with ❤️ for the hospitality industry