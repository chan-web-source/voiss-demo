# Voiss AI - Audio Playback Demo

A modern audio management and playback application built with Next.js, React, and TypeScript. This demo showcases voice AI capabilities with audio upload, playback, and visualization features.

## Website
 https://voiss-demo.onrender.com/voice

## Features

- **Audio Upload**: Upload MP3 files with 30-second duration limit
- **Audio Playback**: Play uploaded and sample audio files with visual feedback
- **Audio Visualization**: Real-time audio waveform visualization during playback
- **Responsive Design**: Mobile and tablet optimized interface
- **Voice AI Demo**: Showcase voice AI capabilities with audio processing

## Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voiss-demo
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
voiss-demo/
├── app/                    # Next.js app directory
│   ├── voice/             # Voice AI demo pages
│   │   ├── table/         # Audio recordings table component
│   │   └── page.tsx       # Main voice demo page
│   ├── chat/              # Chat interface (coming soon)
│   └── layout.tsx         # App layout
├── components/            # Reusable components
│   ├── voiss-header.tsx   # Application header
│   ├── voiss-panel.tsx    # Navigation sidebar
│   ├── voiss-footer.tsx   # Application footer
│   ├── audio-visualizer.tsx # Audio waveform visualization
│   └── ui/                # UI components (shadcn/ui)
├── hooks/                 # Custom React hooks
│   └── use-toast.ts       # Toast notifications
├── lib/                   # Utility functions
│   └── mock.ts            # Sample audio data
├── public/                # Static assets
│   ├── good-job.mp3       # Sample audio files
│   └── you-missed.mp3
└── styles/                # Global styles
```

## Key Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Audio Processing**: Web Audio API
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Audio Visualization**: Canvas-based waveform rendering

## Audio Features

### Audio Upload & Playback
The application supports MP3 audio file upload and playback with the following features:

```typescript
// Audio upload with duration validation
const handleFileUpload = async (file: File) => {
  const duration = await getAudioDuration(file);
  if (duration > 30) {
    toast({
      title: "Upload failed",
      description: "Audio file cannot exceed 30 seconds"
    });
    return;
  }
  // Process audio file...
};

// Audio playback with visualization
const playAudio = (audioPath: string, audioId: string) => {
  const audio = new Audio(audioPath);
  // Setup audio context for visualization
  // Play audio with visual feedback
};
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

For support, email chan.web.work@gmail.comor create an issue in the repository.

## Changelog

### v1.0.0
- Initial release
- Voice AI audio playback demo
- Audio upload and visualization
- Mobile responsive design
- Real-time audio waveform rendering

---
