# The Flex - Property Management Dashboard

A comprehensive property management dashboard built with Next.js, React, and TypeScript. This application provides tools for managing properties, reviews, and analytics for property managers.

## Documentation
 https://docs.google.com/document/d/1CQVAYaGpL29SC5jjLWi867dvtUdKlLmt4iTkHiof3xQ/edit?usp=sharing

## Website
 https://admin-portal-flex.onrender.com/

## Features

- **Dashboard Overview**: Comprehensive property management dashboard with analytics
- **Review Management**: Moderate and approve guest reviews
- **Analytics**: Detailed performance metrics and insights
- **API Integration**: Fetch and display reviews from Kayak API

## Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-flex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development
```bash
# Start development server
npm run dev

# Start development server with specific port
npm run dev -- -p 3001
```

### Building
```bash
# Build for production
npm run build

# Build and analyze bundle
npm run build && npm run analyze
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests for specific file
npm test -- --testPathPattern=components
```

### Linting & Formatting
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format

# Check formatting
npm run format:check
```

### Production
```bash
# Start production server
npm start

# Build and start production server
npm run build && npm start
```

## Project Structure

```
the-flex/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── reviews/          # Reviews management
├── components/           # Reusable components
│   ├── ui/              # UI components (shadcn/ui)
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── styles/              # Global styles
```

## Key Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks

## API Integration

### Kayak Reviews API
The application integrates with Kayak's review API to fetch and display external reviews:

```typescript
// Example usage
const kayakReviews = await fetchReviews({
  objectId: '12222',
  amount: 10,
  reviewSources: 'BOOKING,AGODA,PRICELINE,HOTELSCOMBINED,KAYAK'
});
```

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  // Define props with TypeScript
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### State Management
- Use React hooks for local state
- Use context for global state when needed
- Keep state as close to where it's used as possible

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
```bash
# Build the application
npm run build

# The build output will be in the .next directory
# Deploy the .next directory to your hosting platform
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL for API calls | No |
| `KAYAK_API_KEY` | Kayak API key (if using) | No |

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

3. **Dependency Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   npm run build
   npm run analyze
   ```

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize images before adding to public folder

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@theflex.com or create an issue in the repository.

## Changelog

### v1.0.0
- Initial release
- Dashboard with property management
- Review management system
- Kayak API integration
- Responsive design

---
