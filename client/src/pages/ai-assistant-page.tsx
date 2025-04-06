import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import { AiAssistant } from "@/components/ai-assistant";

export default function AiAssistantPage() {
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - AI Assistant";
  }, []);

  return (
    <PageLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Assistant</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our AI assistant can help you find resources, answer questions about membership, 
          and provide guidance on using the S3vn Studies platform.
        </p>
        <AiAssistant />
      </div>
    </PageLayout>
  );
}