# Resume Analyser

An AI-powered web application that analyses resumes against job descriptions to provide optimisation insights and suggestions using OpenAI's GPT models.

## Features

- **AI-Powered Analysis**: Real resume analysis using OpenAI GPT-4o-mini
- **Resume Upload**: Support for PDF and text file uploads
- **Job Description Analysis**: Compare resumes against specific job requirements
- **Match Scoring**: Get AI-generated percentage-based compatibility scores
- **Keyword Analysis**: AI identifies missing and found keywords
- **ATS Optimisation**: Improve resume compatibility with Applicant Tracking Systems
- **Actionable Suggestions**: Receive AI-generated specific recommendations for improvement
- **Export Reports**: Generate PDF reports of analysis results
- **Demo Mode**: Works without API key using sample data

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **AI Integration**: OpenAI GPT-4o-mini API
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- OpenAI API key (optional - app works in demo mode without it)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd resume-analyser
```

2. Install dependencies:

```bash
npm install
```

3. **Configure OpenAI API (Optional but Recommended):**

   Create a `.env` file in the root directory and add your OpenAI API key:

   ```bash
   # .env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

   **To get your OpenAI API key:**

   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key and replace `your_openai_api_key_here` with it

   **Important:**

   - Never commit your API key to version control
   - Add `.env` to your `.gitignore` file
   - The app will work in demo mode if no API key is provided

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## AI Configuration

### OpenAI Setup

The application uses OpenAI's GPT-4o-mini model for cost-effective resume analysis. Here's how to set it up:

1. **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Create `.env` file**:
   ```
   VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
3. **Restart the development server** after adding the environment variable

### Cost Considerations

- GPT-4o-mini is used for cost efficiency
- Typical cost: ~$0.01-0.05 per resume analysis
- Consider implementing usage limits in production

### Demo Mode

If no API key is configured:

- App shows a "Demo Mode" banner
- Uses sample analysis data
- All features work except real AI analysis
- Perfect for development and testing

### Security Notes

⚠️ **Important Security Information:**

- The current implementation makes API calls from the browser (client-side)
- This is for demo purposes only
- **In production**, API calls should be made from a backend server
- Consider implementing:
  - Rate limiting
  - Usage monitoring
  - User authentication
  - API key rotation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx   # Site navigation
│   ├── HeroSection.tsx  # Landing page hero
│   ├── ResumeUpload.tsx # File upload component
│   └── AnalysisResults.tsx # Results display
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Analyse.tsx     # Analysis page
│   ├── HowItWorks.tsx  # How it works page
│   ├── Contact.tsx     # Contact page
│   └── NotFound.tsx    # 404 page
├── lib/                # Utilities and services
│   └── aiService.ts    # OpenAI integration
├── config/             # Configuration
│   └── environment.ts  # Environment variables
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## How It Works

### AI Analysis Process

1. **Input Processing**: User uploads resume and job description
2. **AI Prompt Engineering**: Structured prompt sent to OpenAI
3. **Analysis**: GPT-4o-mini analyses content and generates insights
4. **Response Parsing**: JSON response parsed and validated
5. **Results Display**: Comprehensive analysis shown to user

### Analysis Components

- **Match Score**: Overall compatibility percentage
- **Keywords**: Missing and found keywords from job description
- **Suggestions**: Actionable improvements
- **Strengths/Weaknesses**: Detailed feedback
- **ATS Score**: Applicant Tracking System compatibility
- **Readability Score**: Resume clarity and structure

## Development Notes

### Current Implementation

The application provides:

- Real AI-powered resume analysis using OpenAI
- Fallback to demo mode when API key is not configured
- Comprehensive error handling and user feedback
- Mobile-responsive design
- Professional UI with modern styling

### Future Enhancements

- [ ] Backend API implementation for security
- [ ] User authentication and saved analyses
- [ ] Advanced AI models (GPT-4, Claude, etc.)
- [ ] PDF export functionality
- [ ] Support for multiple resume formats
- [ ] Integration with job board APIs
- [ ] Usage analytics and monitoring
- [ ] Rate limiting and cost controls

## Environment Variables

Create a `.env` file with the following variables:

```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

See `src/config/environment.ts` for detailed setup instructions.

## Troubleshooting

### Common Issues

1. **API Key Not Working**

   - Ensure the key starts with `sk-proj-` or `sk-`
   - Check that the key is active in OpenAI dashboard
   - Restart the development server after adding the key

2. **CORS Errors**

   - This is expected in some browsers due to client-side API calls
   - The app includes `dangerouslyAllowBrowser: true` for demo purposes
   - In production, use a backend proxy

3. **Rate Limiting**
   - OpenAI has rate limits on API usage
   - Consider implementing request queuing for high traffic

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support with:

- **Technical Issues**: Check the console for error messages
- **API Configuration**: See `src/config/environment.ts`
- **OpenAI Issues**: Visit [OpenAI Documentation](https://platform.openai.com/docs)
- **General Questions**: Open an issue on GitHub
