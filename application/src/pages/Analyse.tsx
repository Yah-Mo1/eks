import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import ResumeUpload from "@/components/ResumeUpload";
import AnalysisResults from "@/components/AnalysisResults";
import DebugPanel from "@/components/DebugPanel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Brain, AlertCircle, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIService, type AnalysisResult } from "@/lib/aiService";
import { isOpenAIConfigured } from "@/config/environment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Analyse = () => {
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();

  // Fixed handler for resume upload that accepts both parameters
  const handleResumeUpload = (content: string, type: "file" | "text") => {
    setResumeContent(content);
    console.log(
      `Resume uploaded via ${type}:`,
      content.substring(0, 100) + "..."
    );
  };

  const handleAnalyse = async () => {
    if (!resumeContent || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide both resume and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalysing(true);
    setError(null);

    try {
      // Use real AI analysis
      const analysis = await AIService.analyseResume(
        resumeContent,
        jobDescription
      );

      setAnalysisData(analysis);
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been successfully analysed with AI.",
      });
    } catch (error) {
      console.error("Analysis error:", error);

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          setError("OpenAI API key not configured. Using demo mode instead.");
          // Fallback to mock analysis
          const mockAnalysis = AIService.getMockAnalysis();
          setAnalysisData(mockAnalysis);
          toast({
            title: "Demo Analysis Complete",
            description:
              "Using sample data. Configure OpenAI API key for real analysis.",
            variant: "default",
          });
        } else {
          setError(error.message);
          toast({
            title: "Analysis Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setError("An unexpected error occurred during analysis.");
        toast({
          title: "Analysis Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleExportPDF = async () => {
    if (!analysisData) return;

    setIsExporting(true);

    try {
      // Dynamic import to avoid bundling issues
      const jsPDF = (await import("jspdf")).default;

      // Create new PDF document
      const doc = new jsPDF();

      // PDF styling
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      let currentY = margin;

      // Helper function to add text with wrapping
      const addText = (text: string, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");

        if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }

        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        doc.text(lines, margin, currentY);
        currentY += lines.length * lineHeight + 5;

        return currentY;
      };

      const addSection = (title: string, content: string[] | string) => {
        // Add some spacing before sections
        currentY += 5;

        // Add title
        addText(title, 14, true);

        // Add content
        if (Array.isArray(content)) {
          content.forEach((item, index) => {
            addText(`${index + 1}. ${item}`, 11);
          });
        } else {
          addText(content, 11);
        }

        currentY += 5; // Extra spacing after section
      };

      // Title
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, pageWidth, 30, "F");
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Resume Analysis Report", margin, 20);

      // Reset text color and position
      doc.setTextColor(0, 0, 0);
      currentY = 40;

      // Date
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      addText(`Generated on: ${currentDate}`, 12);
      currentY += 5;

      // Overall Score Section
      doc.setFillColor(248, 250, 252); // Light gray background
      doc.rect(margin - 5, currentY - 5, pageWidth - 2 * margin + 10, 25, "F");
      addText("OVERALL MATCH SCORE", 16, true);
      addText(`${analysisData.matchScore}%`, 24, true);
      currentY += 10;

      // Score Breakdown
      addSection("Score Breakdown", [
        `Resume-Job Fit: ${analysisData.matchScore}%`,
        `ATS Compatibility: ${analysisData.atsScore}%`,
        `Content Readability: ${analysisData.readabilityScore}%`,
      ]);

      // Keywords Analysis
      addSection("Found Keywords", analysisData.foundKeywords.join(", "));
      addSection("Missing Keywords", analysisData.missingKeywords.join(", "));

      // Strengths
      addSection("Strengths", analysisData.strengths);

      // Areas for Improvement
      addSection("Areas for Improvement", analysisData.weaknesses);

      // AI Recommendations
      addSection("AI Recommendations", analysisData.suggestions);

      // Footer
      if (currentY < pageHeight - 30) {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          "Generated by Resume Analyser - AI-Powered Resume Analysis",
          margin,
          pageHeight - 15
        );
      }

      // Save the PDF
      const fileName = `resume-analysis-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Generated Successfully!",
        description: `Your analysis report has been downloaded as ${fileName}`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Export Failed",
        description:
          "There was an error generating the PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setError(null);
  };

  // Check if API key is configured
  const isApiKeyConfigured = isOpenAIConfigured();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Resume Analyser
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              {showDebug ? "Hide" : "Show"} Debug
            </Button>
          </div>
          <p className="text-muted-foreground">
            Upload your resume and job description for AI-powered analysis
          </p>

          {/* API Configuration Alert */}
          {!isApiKeyConfigured && (
            <Alert className="mt-6 max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                OpenAI API key not configured. The app will use sample analysis
                data. To enable real AI analysis, create a <code>.env</code>{" "}
                file with your <code>VITE_OPENAI_API_KEY</code>. See{" "}
                <code>src/config/environment.ts</code> for detailed setup
                instructions.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Debug Panel */}
        {showDebug && <DebugPanel />}

        {!analysisData ? (
          <div className="space-y-8">
            <ResumeUpload
              onResumeUpload={handleResumeUpload}
              onJobDescriptionChange={setJobDescription}
              resumeContent={resumeContent}
              jobDescription={jobDescription}
              isLoading={isAnalysing}
            />

            {resumeContent && jobDescription && (
              <div className="text-center">
                <Button
                  onClick={handleAnalyse}
                  disabled={isAnalysing}
                  variant="hero"
                  size="xl"
                  className="w-full md:w-auto"
                >
                  {isAnalysing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      {isApiKeyConfigured
                        ? "Analysing with AI..."
                        : "Generating Demo Analysis..."}
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      {isApiKeyConfigured
                        ? "Analyse with AI"
                        : "Generate Demo Analysis"}
                    </>
                  )}
                </Button>

                {!isApiKeyConfigured && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Demo mode - sample analysis will be generated
                  </p>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>
                  {error}
                  <br />
                  <span className="text-sm mt-2 block">
                    💡 Tip: Open the debug panel above and check the browser
                    console (F12) for more details.
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success/Error Banner */}
            {error && (
              <Alert className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AnalysisResults
              analysisData={analysisData}
              onExportPDF={handleExportPDF}
              isExporting={isExporting}
            />

            <div className="text-center">
              <Button onClick={resetAnalysis} variant="outline" size="lg">
                Analyse Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Analyse;
