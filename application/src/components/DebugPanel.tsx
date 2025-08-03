import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isOpenAIConfigured } from "@/config/environment";
import { CheckCircle, XCircle, Eye, EyeOff, AlertTriangle } from "lucide-react";

const DebugPanel = () => {
  const [showApiKey, setShowApiKey] = useState(false);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const isConfigured = isOpenAIConfigured();

  const formatApiKey = (key: string | undefined) => {
    if (!key) return "Not set";
    if (!showApiKey) {
      return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
    }
    return key;
  };

  const validateApiKey = (key: string | undefined) => {
    if (!key) return { valid: false, message: "API key not set" };
    if (key === "your_openai_api_key_here")
      return { valid: false, message: "Using placeholder key" };
    if (!key.startsWith("sk-"))
      return {
        valid: false,
        message: "Invalid format (should start with sk-)",
      };
    if (key.length < 40) return { valid: false, message: "Key too short" };
    return { valid: true, message: "Format looks valid" };
  };

  const validation = validateApiKey(apiKey);

  return (
    <Card className="mb-6 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Debug Panel
          <Badge variant="secondary">Development Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Environment Status */}
          <div className="space-y-3">
            <h4 className="font-semibold">Environment Configuration</h4>

            <div className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">OpenAI API Key Configured</span>
              <Badge variant={isConfigured ? "default" : "destructive"}>
                {isConfigured ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {validation.valid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">API Key Format</span>
              <Badge variant={validation.valid ? "default" : "destructive"}>
                {validation.message}
              </Badge>
            </div>
          </div>

          {/* API Key Details */}
          <div className="space-y-3">
            <h4 className="font-semibold">API Key Details</h4>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Key Value:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-6"
                >
                  {showApiKey ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>

              <code className="block p-2 bg-muted rounded text-xs font-mono break-all">
                {formatApiKey(apiKey)}
              </code>

              {apiKey && (
                <div className="text-xs text-muted-foreground">
                  Length: {apiKey.length} characters
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!isConfigured && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
              Setup Required
            </h4>
            <ol className="text-sm text-orange-700 dark:text-orange-300 space-y-1 list-decimal list-inside">
              <li>
                Create a <code>.env</code> file in your project root
              </li>
              <li>
                Add: <code>VITE_OPENAI_API_KEY=your_actual_key_here</code>
              </li>
              <li>
                Get your key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  OpenAI Platform
                </a>
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>
        )}

        {/* Browser Limitations Warning */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Browser API Limitations
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This app makes API calls directly from the browser, which can cause
            CORS issues in some browsers. For production use, implement a
            backend API proxy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
