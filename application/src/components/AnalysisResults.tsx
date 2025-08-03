import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  Brain,
  Lightbulb,
} from "lucide-react";

interface AnalysisData {
  matchScore: number;
  missingKeywords: string[];
  foundKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  atsScore: number;
  readabilityScore: number;
}

interface AnalysisResultsProps {
  analysisData: AnalysisData;
  onExportPDF: () => void;
  isExporting?: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisData,
  onExportPDF,
  isExporting = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success/10 border-success/20";
    if (score >= 60) return "bg-warning/10 border-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  return (
    <div className="space-y-6">
      {/* Header with overall score */}
      <Card className={`${getScoreBg(analysisData.matchScore)} border-2`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Analysis Complete
              </h2>
              <p className="text-muted-foreground">
                Your resume has been analysed against the job description
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  analysisData.matchScore
                )}`}
              >
                {analysisData.matchScore}%
              </div>
              <Badge variant="secondary">Overall Match Score</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Match Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resume-Job Fit</span>
                <span className={getScoreColor(analysisData.matchScore)}>
                  {analysisData.matchScore}%
                </span>
              </div>
              <Progress value={analysisData.matchScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              ATS Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>System Compatibility</span>
                <span className={getScoreColor(analysisData.atsScore)}>
                  {analysisData.atsScore}%
                </span>
              </div>
              <Progress value={analysisData.atsScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Readability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Content Quality</span>
                <span className={getScoreColor(analysisData.readabilityScore)}>
                  {analysisData.readabilityScore}%
                </span>
              </div>
              <Progress value={analysisData.readabilityScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-success" />
              Found Keywords
              <Badge variant="secondary" className="ml-2">
                {analysisData.foundKeywords.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysisData.foundKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="bg-success/10 text-success border-success/20"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Missing Keywords
              <Badge variant="destructive" className="ml-2">
                {analysisData.missingKeywords.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysisData.missingKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="bg-destructive/10"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-success" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysisData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingDown className="h-5 w-5 mr-2 text-destructive" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysisData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Improvement suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Lightbulb className="h-5 w-5 mr-2 text-accent" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-accent/5 border border-accent/10 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Export Your Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Download a comprehensive PDF report of your resume analysis
              </p>
            </div>
            <Button
              onClick={onExportPDF}
              disabled={isExporting}
              variant="gradient"
              size="lg"
              className="w-full md:w-auto"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
