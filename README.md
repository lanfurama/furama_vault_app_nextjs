# Furama Studio – Hospitality Add-on Workspace

Furama Studio is the digital atelier for Furama Resort: a unified interface that threads together core property operations, storytelling tools, and upcoming guest experience add-ons. Built with Next.js 14, TypeScript, and Tailwind CSS, Studio embraces Furama’s refreshed visual language: deep sea teal `#066055`, artisan sand `#F2EEE8`, and charcoal `#313131`.

## ✨ Features

### 🎨 Modern UI/UX
- **Professional Design**: Clean, modern interface optimized for business use
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Micro-interactions and transitions for better UX

### 🧭 Studio Overview
- **Add-on Control Centre**: Discover, launch, and manage Furama PMS and AI Lab with room to grow
- **Roadmap Highlights**: Surface upcoming modules like Experience Marketplace, Analytics Studio, and Campaign Orchestrator
- **Brand-coherent UI**: Consistent typography, color system, and motion aligned with Furama Studio

### 🧪 AI Lab
- **AI Writer Copilot**: Gemini-powered editorial assistant for campaigns and guest communications
- **Innovation Runway**: Incubating Experience Insights and Concierge Copilot add-ons
- **Lab Navigation**: Central hub to explore current and upcoming AI modules
- **Production & Beta Modes**: Separate status badges for live vs. incubating copilots

### 🏨 Furama PMS
- **Guest Intelligence**: Advanced table views with filters, search, exports, and quick actions
- **Operational Dashboards**: Analytics and reporting tuned for hospitality KPIs
- **Dark Mode Ready**: Sand and charcoal palette keeps content legible day or night
- **Module Navigator**: Property, Guest, Room, Rate, Reservation, Service, Payment, Staff, Front Office, Reporting & Analytics
- **In-Module Settings**: Configure PMS API connectivity directly from the Guest Management module

### ✍️ AI Writer (via AI Lab)
- **Gemini 2.5 Deep Dive**: Generate narrative-rich articles ready for editing and export
- **Deep Dive Mode**: Multi-phase reasoning for publication-ready drafts
- **Inline Editing**: Switch between live preview and markdown editing without leaving Studio

### 🔧 Platform Foundation
- **Modular Architecture**: Next.js App Router with add-on isolation
- **API Gateway**: Secure proxy layer for PMS data sources
- **Design System**: Tailwind + @tailwindcss/typography with bespoke buttons, inputs, and layout primitives

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

1. **API Setup**: Open Furama PMS and use the in-module settings button to configure the backend API endpoint
2. **AI Lab / AI Writer**: Add `GOOGLE_GENAI_API_KEY` to `.env.local` for Gemini access
3. **Theme**: Toggle between light and dark mode directly from the sidebar footer
4. **Data**: PMS modules automatically hydrate from your configured API

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
│   ├── analytics/         # PMS analytics dashboards
│   ├── reports/           # PMS reporting suite
│   ├── ai-lab/            # AI Lab overview
│   ├── ai-writer/         # AI Content Studio
│   ├── guests/            # Furama PMS guest operations
│   ├── settings/          # Studio configuration
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── AnimatedCard.tsx   # Animated card component
│   ├── Chart.tsx          # Chart wrapper
│   ├── DataTable.tsx       # Advanced data table
│   ├── ErrorBoundary.tsx  # Error handling
│   ├── Header.tsx         # Top navigation
│   ├── Modal.tsx          # Modal dialogs
│   ├── Sidebar.tsx        # Studio navigation + add-on switcher
│   ├── StatsCard.tsx      # Statistics cards
│   └── Toast.tsx          # Notifications
├── components/ai-writer/  # AI Writer focused components
├── services/              # Fetch helpers
│   ├── guestService.ts    # Guest API helper
│   └── aiWriterService.ts # AI writer API helper
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # API management
│   └── useTheme.ts        # Theme management
└── utils/                 # Utility functions
    └── exportUtils.ts     # Data export helpers
```

## 🎨 Design System

### Color Palette
- **Primary (Teal)**: `#066055` with extended seafoam scale for actions and highlights
- **Secondary (Sand)**: `#F2EEE8` driven neutrals for surfaces and cards
- **Charcoal**: `#313131` typographic anchor for high-contrast text
- **Accent**: Complementary aquamarine highlights for interactive states

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

## 🔮 Studio Roadmap

- [ ] Experience Marketplace add-on
- [ ] Campaign Orchestrator automation suite
- [ ] Native email + push journeys
- [ ] Multilingual guest communications
- [ ] Deep analytics with predictive layers
- [ ] Role-based access across add-ons

---

Built with ❤️ for the hospitality industry