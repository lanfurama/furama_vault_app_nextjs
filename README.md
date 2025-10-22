# Furama Vault - Guest Management App

A modern Next.js application for managing guest information, built for Furama Resort.

## Features

- 📋 **Guest List Display**: View all guests with pagination
- 🔍 **Search Functionality**: Search guests by name, email, or phone
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Optimized for speed and user experience
- 🎨 **Modern UI**: Clean and intuitive interface

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8001`

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

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update the API URL in `.env.local`:
```
API_BASE_URL=http://localhost:8001
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The app connects to your backend API at:
- **Endpoint**: `GET /api/v1/guest/?skip=0&limit=20`
- **Expected Response Format**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "skip": 0,
  "limit": 20
}
```

## Deployment on Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `API_BASE_URL`: Your production backend URL
4. Deploy!

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables:
```bash
vercel env add API_BASE_URL
```

### Environment Variables for Production

In your Vercel dashboard, set:
- `API_BASE_URL`: Your production backend URL (e.g., `https://your-api-domain.com`)

## Project Structure

```
├── app/
│   ├── api/guests/route.ts    # API route for fetching guests
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── GuestCard.tsx          # Guest card component
│   └── LoadingSpinner.tsx     # Loading spinner
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment configuration
```

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Component styles are in individual component files

### API Integration
- Update `app/api/guests/route.ts` for different API endpoints
- Modify data fetching logic in `app/page.tsx`

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend is running on correct port
   - Verify `API_BASE_URL` environment variable
   - Check CORS settings on backend

2. **Build Errors**
   - Run `npm run lint` to check for linting issues
   - Ensure all dependencies are installed
   - Check TypeScript errors

3. **Deployment Issues**
   - Verify environment variables in Vercel
   - Check build logs in Vercel dashboard
   - Ensure API_BASE_URL points to accessible URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
