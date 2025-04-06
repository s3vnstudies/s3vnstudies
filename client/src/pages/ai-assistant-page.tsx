import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import { AiAssistant } from "@/components/ai-assistant";

export default function AiAssistantPage() {
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - AI Assistant";
    
    // Load the D-ID Agent script
    const didAgentScript = document.createElement('script');
    didAgentScript.type = 'module';
    didAgentScript.src = 'https://agent.d-id.com/v1/index.js';
    didAgentScript.setAttribute('data-name', 'did-agent');
    didAgentScript.setAttribute('data-mode', 'fabio');
    didAgentScript.setAttribute('data-client-key', 'Z29vZ2xlLW9hdXRoMnwxMTAzMDI2MDM4OTIzNjM5ODE5NjI6NDZiVnYxSWpRV2ItczAzeWJ4QVkw');
    didAgentScript.setAttribute('data-agent-id', 'agt_-FIQ0vTR');
    didAgentScript.setAttribute('data-monitor', 'true');
    
    document.body.appendChild(didAgentScript);
    
    // Clean up function
    return () => {
      document.body.removeChild(didAgentScript);
    };
  }, []);

  return (
    <PageLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Assistant</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our AI assistant can help you find resources, answer questions about membership, 
          and provide guidance on using the S3vn Studies platform.
        </p>
        
        {/* D-ID Agent will be injected here by the script */}
        <div id="d-id-agent-container" className="mb-8"></div>
        
        {/* Our custom AI assistant implementation */}
        <AiAssistant />
      </div>
    </PageLayout>
  );
}