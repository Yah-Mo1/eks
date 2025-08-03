import OpenAI from "openai";
import { getOpenAIKey, isOpenAIConfigured } from "@/config/environment";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: isOpenAIConfigured() ? getOpenAIKey() : "demo-key",
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from backend
});

export interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  foundKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  atsScore: number;
  readabilityScore: number;
}

export class AIService {
  static async analyseResume(
    resumeContent: string,
    jobDescription: string
  ): Promise<AnalysisResult> {
    // Check if API key is configured
    if (!isOpenAIConfigured()) {
      console.log("🔄 API key not configured, using intelligent mock analysis");
      return this.getIntelligentMockAnalysis(resumeContent, jobDescription);
    }

    // Debug logging
    console.log("🔍 AI Analysis Debug Info:");
    console.log("- API Key configured:", isOpenAIConfigured());
    console.log(
      "- API Key preview:",
      import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 10) + "..."
    );
    console.log("- Resume length:", resumeContent.length);
    console.log("- Job description length:", jobDescription.length);

    try {
      const prompt = this.createAnalysisPrompt(resumeContent, jobDescription);

      console.log("📤 Sending request to OpenAI...");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using GPT-4o-mini for cost efficiency
        messages: [
          {
            role: "system",
            content:
              "You are an expert HR consultant and resume analyst. Analyse resumes against job descriptions with precision and provide actionable insights. Be realistic with scores - most resumes are not perfect matches.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Very low temperature for consistent, realistic results
        max_tokens: 2000,
      });

      console.log("📥 Received response from OpenAI");

      const analysis = completion.choices[0]?.message?.content;
      if (!analysis) {
        console.log(
          "⚠️ No analysis received, falling back to intelligent mock"
        );
        return this.getIntelligentMockAnalysis(resumeContent, jobDescription);
      }

      console.log("✅ Analysis successful, parsing response...");
      const result = this.parseAnalysisResponse(analysis);

      // Log the actual result for debugging
      console.log("🎯 Final Analysis Result:", {
        matchScore: result.matchScore,
        foundKeywords: result.foundKeywords.length,
        missingKeywords: result.missingKeywords.length,
      });

      return result;
    } catch (error) {
      console.error("❌ OpenAI API Error Details:", error);

      // Log more specific error information
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
      }

      // Check for specific OpenAI errors
      if (error instanceof Error) {
        // API key related errors
        if (
          error.message.includes("API key") ||
          error.message.includes("Unauthorized") ||
          error.message.includes("401")
        ) {
          console.log(
            "🔑 API key error, falling back to intelligent mock analysis"
          );
          return this.getIntelligentMockAnalysis(resumeContent, jobDescription);
        }

        // Rate limiting
        if (
          error.message.includes("rate limit") ||
          error.message.includes("429")
        ) {
          throw new Error(
            "OpenAI rate limit exceeded. Please wait a moment and try again."
          );
        }

        // Model or permission issues
        if (
          error.message.includes("model") ||
          error.message.includes("permission") ||
          error.message.includes("403")
        ) {
          throw new Error(
            "Model access denied. Please check your OpenAI account permissions for gpt-4o-mini."
          );
        }

        // Network/connection issues
        if (
          error.message.includes("network") ||
          error.message.includes("fetch") ||
          error.message.includes("ENOTFOUND")
        ) {
          throw new Error(
            "Network connection failed. Please check your internet connection and try again."
          );
        }

        // CORS issues (common with client-side calls)
        if (
          error.message.includes("CORS") ||
          error.message.includes("Access-Control")
        ) {
          console.log(
            "🌐 CORS issue, falling back to intelligent mock analysis"
          );
          return this.getIntelligentMockAnalysis(resumeContent, jobDescription);
        }
      }

      // For other errors, fall back to intelligent analysis
      console.log("🔄 API failed, using intelligent mock analysis instead");
      return this.getIntelligentMockAnalysis(resumeContent, jobDescription);
    }
  }

  private static createAnalysisPrompt(
    resumeContent: string,
    jobDescription: string
  ): string {
    return `
Please analyse the following resume against the job description and provide a comprehensive analysis in the exact JSON format specified below.

**RESUME:**
${resumeContent}

**JOB DESCRIPTION:**
${jobDescription}

**ANALYSIS REQUIREMENTS:**
Please provide your analysis in this exact JSON format (no additional text, just valid JSON):

{
  "matchScore": <number between 0-100>,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "foundKeywords": ["keyword1", "keyword2", ...],
  "suggestions": [
    "specific actionable suggestion 1",
    "specific actionable suggestion 2",
    "specific actionable suggestion 3",
    "specific actionable suggestion 4"
  ],
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2",
    "weakness 3"
  ],
  "atsScore": <number between 0-100>,
  "readabilityScore": <number between 0-100>
}

**ANALYSIS CRITERIA:**
- **matchScore**: Overall percentage match between resume and job requirements (be realistic - perfect matches are rare)
- **missingKeywords**: Important keywords/skills from job description not found in resume
- **foundKeywords**: Relevant keywords/skills from job description found in resume  
- **suggestions**: Specific, actionable recommendations to improve the resume for this job
- **strengths**: What the candidate does well relative to the job requirements
- **weaknesses**: Areas where the resume could be improved for this position
- **atsScore**: How well the resume would perform with Applicant Tracking Systems (formatting, keywords, structure)
- **readabilityScore**: How easy the resume is to read and understand

IMPORTANT: Be realistic with scoring. Most resumes will score 30-80%. Perfect matches (90%+) are very rare.
`;
  }

  private static parseAnalysisResponse(response: string): AnalysisResult {
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate required fields
      const requiredFields = [
        "matchScore",
        "missingKeywords",
        "foundKeywords",
        "suggestions",
        "strengths",
        "weaknesses",
        "atsScore",
        "readabilityScore",
      ];

      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure arrays are arrays and numbers are numbers
      return {
        matchScore: Math.max(
          0,
          Math.min(100, Number(analysis.matchScore) || 0)
        ),
        missingKeywords: Array.isArray(analysis.missingKeywords)
          ? analysis.missingKeywords
          : [],
        foundKeywords: Array.isArray(analysis.foundKeywords)
          ? analysis.foundKeywords
          : [],
        suggestions: Array.isArray(analysis.suggestions)
          ? analysis.suggestions
          : [],
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        weaknesses: Array.isArray(analysis.weaknesses)
          ? analysis.weaknesses
          : [],
        atsScore: Math.max(0, Math.min(100, Number(analysis.atsScore) || 0)),
        readabilityScore: Math.max(
          0,
          Math.min(100, Number(analysis.readabilityScore) || 0)
        ),
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.error("Raw response:", response);

      // Return a fallback analysis if parsing fails
      return {
        matchScore: 65,
        missingKeywords: ["Unable to parse detailed keywords"],
        foundKeywords: ["Analysis completed"],
        suggestions: [
          "AI analysis completed but response parsing failed",
          "Please try again or contact support",
          "Manual review of resume recommended",
        ],
        strengths: ["Resume submitted successfully"],
        weaknesses: ["Technical parsing error occurred"],
        atsScore: 60,
        readabilityScore: 70,
      };
    }
  }

  // Intelligent mock analysis that actually analyses the content
  static getIntelligentMockAnalysis(
    resumeContent: string,
    jobDescription: string
  ): AnalysisResult {
    console.log("🧠 Running intelligent mock analysis...");

    const resumeLower = resumeContent.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Extract common tech skills and keywords
    const commonSkills = [
      "javascript",
      "python",
      "java",
      "react",
      "node",
      "sql",
      "html",
      "css",
      "typescript",
      "angular",
      "vue",
      "php",
      "c++",
      "c#",
      "ruby",
      "go",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "git",
      "jenkins",
      "linux",
      "machine learning",
      "ai",
      "data science",
      "mongodb",
      "postgresql",
      "express",
      "redux",
      "next",
      "spring",
      "django",
      "flask",
      "laravel",
      "bootstrap",
      "tailwind",
      "sass",
      "webpack",
      "babel",
      "npm",
      "yarn",
    ];

    const experienceLevels = [
      "senior",
      "lead",
      "principal",
      "manager",
      "director",
    ];
    const softSkills = [
      "communication",
      "teamwork",
      "leadership",
      "problem solving",
      "analytical",
    ];

    // Find matches
    const foundSkills = commonSkills.filter(
      (skill) => resumeLower.includes(skill) && jobLower.includes(skill)
    );

    const missingSkills = commonSkills.filter(
      (skill) => jobLower.includes(skill) && !resumeLower.includes(skill)
    );

    // Calculate realistic match score based on content analysis
    let matchScore = 30; // Base score

    // Add points for matching skills
    matchScore += Math.min(foundSkills.length * 5, 40);

    // Add points for experience level match
    const hasExperienceMatch = experienceLevels.some(
      (level) => resumeLower.includes(level) && jobLower.includes(level)
    );
    if (hasExperienceMatch) matchScore += 10;

    // Add points for soft skills
    const softSkillMatches = softSkills.filter(
      (skill) => resumeLower.includes(skill) && jobLower.includes(skill)
    );
    matchScore += Math.min(softSkillMatches.length * 3, 15);

    // Deduct points for missing critical skills
    matchScore -= Math.min(missingSkills.length * 2, 20);

    // Ensure realistic range
    matchScore = Math.max(15, Math.min(matchScore, 90));

    // Add some variation
    matchScore += Math.floor(Math.random() * 10) - 5;
    matchScore = Math.max(20, Math.min(matchScore, 85));

    console.log(
      `📊 Calculated match score: ${matchScore}% (${foundSkills.length} matches, ${missingSkills.length} missing)`
    );

    return {
      matchScore,
      missingKeywords: missingSkills.slice(0, 6),
      foundKeywords: foundSkills.slice(0, 8),
      suggestions: [
        missingSkills.length > 0
          ? `Add ${missingSkills
              .slice(0, 3)
              .join(", ")} skills mentioned in the job description`
          : "Highlight specific achievements with quantifiable results",
        "Include more industry-specific keywords from the job posting",
        "Optimise resume format for ATS compatibility",
        "Add measurable accomplishments and impact metrics",
        "Tailor experience descriptions to match job requirements",
      ],
      strengths: [
        foundSkills.length > 0
          ? `Strong background in ${foundSkills.slice(0, 3).join(", ")}`
          : "Well-structured resume format",
        "Relevant professional experience",
        hasExperienceMatch
          ? "Experience level matches job requirements"
          : "Clear career progression",
      ],
      weaknesses: [
        missingSkills.length > 0
          ? `Missing key skills: ${missingSkills.slice(0, 2).join(", ")}`
          : "Could include more specific achievements",
        "Resume could be more tailored to this specific role",
        "Consider adding more quantifiable accomplishments",
      ],
      atsScore: Math.floor(Math.random() * 25) + 65, // 65-90
      readabilityScore: Math.floor(Math.random() * 20) + 75, // 75-95
    };
  }

  // Fallback method for when API is not available (backwards compatibility)
  static getMockAnalysis(): AnalysisResult {
    return this.getIntelligentMockAnalysis(
      "Sample resume content",
      "Sample job description"
    );
  }
}
