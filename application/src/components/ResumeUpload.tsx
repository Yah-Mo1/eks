import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Info,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeUploadProps {
  onResumeUpload: (content: string, type: "file" | "text") => void;
  onJobDescriptionChange: (description: string) => void;
  resumeContent: string;
  jobDescription: string;
  isLoading?: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onResumeUpload,
  onJobDescriptionChange,
  resumeContent,
  jobDescription,
  isLoading = false,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [inputMethod, setInputMethod] = useState<"file" | "text">("file");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle manual file selection
  const handleFileSelect = () => {
    console.log("📁 Manual file selection triggered");
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("📄 File selected:", file.name, file.type, file.size);
      processFile(file);
    }
  };

  // Process uploaded file
  const processFile = async (file: File) => {
    console.log("🔄 Processing file:", file.name);
    setIsProcessing(true);

    try {
      // Check file type and size
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      if (file.type === "application/pdf") {
        // Handle PDF files
        console.log("📑 Processing PDF file...");
        toast({
          title: "PDF File Uploaded",
          description:
            "PDF text extraction is limited. For best results, copy and paste your resume text.",
          variant: "default",
        });

        // Try to read as text (won't work well for most PDFs)
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          console.log("PDF content extracted:", content.length, "characters");

          if (content && content.trim().length > 50) {
            setUploadedFile(file);
            onResumeUpload(content, "file");
            toast({
              title: "Resume processed!",
              description: `${file.name} content extracted. Consider using "Paste Text" for better accuracy.`,
            });
          } else {
            toast({
              title: "Limited PDF support",
              description:
                "This PDF couldn't be processed. Please copy and paste your resume text instead.",
              variant: "destructive",
            });
            // Suggest switching to text mode
            setInputMethod("text");
          }
        };

        reader.onerror = () => {
          console.error("PDF reading failed");
          toast({
            title: "PDF processing failed",
            description: "Please copy and paste your resume text instead.",
            variant: "destructive",
          });
          setInputMethod("text");
        };

        reader.readAsText(file);
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        // Handle text files
        console.log("📝 Processing text file...");
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result as string;
          console.log("Text file content:", content.length, "characters");

          if (content && content.trim()) {
            setUploadedFile(file);
            onResumeUpload(content, "file");
            toast({
              title: "Resume uploaded successfully!",
              description: `${file.name} processed successfully.`,
            });
          } else {
            toast({
              title: "Empty file",
              description:
                "The file appears to be empty. Please try another file.",
              variant: "destructive",
            });
          }
        };

        reader.onerror = () => {
          console.error("Text file reading failed");
          toast({
            title: "File reading error",
            description:
              "Could not read the file. Please try again or paste the text manually.",
            variant: "destructive",
          });
        };

        reader.readAsText(file);
      } else if (file.name.match(/\.(doc|docx)$/i)) {
        // Handle Word documents
        console.log("📄 Word document detected");
        toast({
          title: "Word document detected",
          description:
            "Word documents can't be processed in browsers. Please copy and paste your resume text.",
          variant: "destructive",
        });
        setInputMethod("text");
      } else {
        // Unsupported file type
        console.log("❌ Unsupported file type:", file.type);
        toast({
          title: "Unsupported file type",
          description:
            "Please upload a TXT file or use the 'Paste Text' option for best results.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: "File processing error",
        description:
          "Something went wrong. Please try copying and pasting your resume text instead.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Dropzone callback
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("📂 Dropzone: Files dropped", acceptedFiles.length);
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    disabled: isLoading || isProcessing,
    noClick: true, // Disable click on dropzone
  });

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      console.log("📝 Processing pasted text:", textInput.length, "characters");
      onResumeUpload(textInput, "text");
      toast({
        title: "Resume text processed!",
        description: "Your resume content has been analysed.",
      });
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setTextInput("");
    onResumeUpload("", inputMethod);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Upload Section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Upload Your Resume
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={inputMethod === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    console.log("🔄 Switched to file upload mode");
                    setInputMethod("file");
                  }}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  variant={inputMethod === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    console.log("🔄 Switched to text input mode");
                    setInputMethod("text");
                  }}
                  disabled={isLoading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Paste Text
                </Button>
              </div>
            </div>

            {/* File Upload Method */}
            {inputMethod === "file" ? (
              <div>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* File format info */}
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Best results:</strong> Upload .txt files or use
                    "Paste Text" option. PDF support is limited in browsers.
                  </AlertDescription>
                </Alert>

                {!uploadedFile ? (
                  <div className="space-y-4">
                    {/* Drag and drop area */}
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary hover:bg-muted/50"
                      } ${
                        isLoading || isProcessing
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {isProcessing ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                          <h4 className="text-lg font-medium text-foreground mb-2">
                            Processing file...
                          </h4>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-foreground mb-2">
                            {isDragActive
                              ? "Drop your resume here"
                              : "Drag & drop your resume here"}
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            Supports TXT, PDF, DOC, and DOCX files
                          </p>
                          <div className="flex justify-center gap-2">
                            <Badge variant="secondary">TXT (Best)</Badge>
                            <Badge variant="outline">PDF (Limited)</Badge>
                            <Badge variant="outline">DOC/DOCX</Badge>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Manual upload button */}
                    <div className="text-center">
                      <Button
                        onClick={handleFileSelect}
                        disabled={isLoading || isProcessing}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Or click to browse files
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-foreground">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB •{" "}
                          {uploadedFile.type || "Unknown type"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearUpload}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Text Input Method */
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommended method:</strong> Copy and paste your
                    resume text for the most accurate analysis.
                  </AlertDescription>
                </Alert>

                <Textarea
                  placeholder="Paste your resume content here...

Example:
John Doe
Software Engineer

Experience:
• Senior Frontend Developer at TechCorp (2020-2023)
  - Developed React applications serving 100k+ users
  - Led team of 4 developers
  - Improved performance by 40%

Skills:
JavaScript, React, TypeScript, Node.js, AWS..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm"
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {textInput.length} characters •{" "}
                    {
                      textInput.split(/\s+/).filter((word) => word.length > 0)
                        .length
                    }{" "}
                    words
                  </p>
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim() || isLoading}
                    variant="default"
                    size="sm"
                  >
                    Process Resume Text
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Description Section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Job Description
            </h3>
            <Textarea
              placeholder="Paste the job description you want to match against...

Example:
Senior Frontend Developer

We are looking for a Senior Frontend Developer to join our team.

Required Skills:
• 5+ years React experience
• TypeScript proficiency
• Node.js backend knowledge
• AWS cloud experience

Responsibilities:
• Lead frontend development
• Mentor junior developers
• Collaborate with design team..."
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              className="min-h-[200px] resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {jobDescription.length} characters •{" "}
                {
                  jobDescription.split(/\s+/).filter((word) => word.length > 0)
                    .length
                }{" "}
                words
              </p>
              {jobDescription.length > 0 && (
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Ready for analysis
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {resumeContent && jobDescription && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">
                  Ready for Analysis
                </p>
                <p className="text-sm text-muted-foreground">
                  Both resume ({resumeContent.length} chars) and job description
                  ({jobDescription.length} chars) are loaded. Click "Analyse" to
                  proceed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeUpload;
