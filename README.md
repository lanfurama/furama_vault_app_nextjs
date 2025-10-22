# Furama Vault - Guest Management App

A modern Next.js application for managing guest information with email marketing features, built for Furama Resort.

## Features

- 📋 **Guest List Display**: View all guests in a clean table format
- 🔍 **Search & Filter**: Search by name/email, filter by email status and country
- 📧 **Email Marketing**: Select guests for email campaigns
- 📁 **Export Functions**: Export selected or all guests to Excel
- ⚙️ **Settings**: Configure API URL easily
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Frontend pagination for smooth experience

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **XLSX** - Excel export functionality
- **date-fns** - Date manipulation utilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (configurable via Settings)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd furama-vault-app-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Go to Settings to configure your API URL.

## API Integration

The app connects to your backend API. Configure the API URL in Settings page.

**Expected API Endpoint**: `GET /api/v1/guest/`

**Expected Response Format**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "first_name": "John",
      "last_name": "Doe", 
      "email": "john@example.com",
      "country": "Vietnam",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Deployment on Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from your project directory**:
```bash
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - What's your project's name? `furama-vault-app`
   - In which directory is your code located? `./`

5. **Set Environment Variables** (if needed):
```bash
vercel env add API_BASE_URL
```

### Method 2: Vercel Dashboard

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import from GitHub** - Select your repository
5. **Configure**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Deploy**

### Environment Variables

Set these in Vercel dashboard or via CLI:

- `API_BASE_URL`: Your production backend URL (optional, can be configured in Settings)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── guests/route.ts           # API route for fetching guests
│   │   └── test-connection/route.ts   # API route for testing connection
│   ├── settings/page.tsx             # Settings page
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── components/
│   └── LoadingSpinner.tsx            # Loading spinner
├── utils/
│   └── exportUtils.ts                # Excel export utilities
├── public/                           # Static assets
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                 # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── vercel.json                       # Vercel deployment configuration
└── .vercelignore                     # Vercel ignore file
```

## Usage

### For Email Marketing

1. **Configure API**: Go to Settings → Enter your API URL → Test Connection → Save
2. **Filter Guests**: Use Email Filter to show only guests with email
3. **Select Recipients**: Check guests you want to include in email campaign
4. **Export**: Click "Export Selected" to download Excel file
5. **Use for Marketing**: Import Excel file into your email marketing tool

### Features

- **Settings Page**: Configure API URL easily
- **Email Filtering**: Filter by email status (All/With Email/Without Email)
- **Country Filtering**: Filter by specific country
- **Search**: Search by name or email
- **Bulk Selection**: Select all or individual guests
- **Export Options**: Export selected guests or all guests
- **Frontend Pagination**: Smooth navigation through large datasets

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check your API URL in Settings
   - Ensure your backend API is running
   - Verify CORS settings on your backend

2. **Build Errors**
   - Run `npm run lint` to check for linting issues
   - Ensure all dependencies are installed
   - Check TypeScript errors

3. **Deployment Issues**
   - Check build logs in Vercel dashboard
   - Ensure all environment variables are set
   - Verify your API is accessible from Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
