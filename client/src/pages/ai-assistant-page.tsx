import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/page-layout";
import { AiAssistant } from "@/components/ai-assistant";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AiAssistantPage() {
  // Set page title
  // State to track D-ID agent loading status - disabled by default
  const [didAgentStatus, setDidAgentStatus] = useState<"loading" | "success" | "error">("error");
  
  useEffect(() => {
    document.title = "S3vn Studies - AI Assistant";
    
    // We're permanently disabling the D-ID agent integration in this component
    // to prevent WebSocket and DOMException errors
    // If needed later, we can re-enable with proper error handling
    
    /* Previous implementation:
    const loadDidAgent = () => {
      try {
        // Check if the script is already loaded
        if (document.querySelector('script[data-name="did-agent"]')) {
          return;
        }
        
        const didAgentScript = document.createElement('script');
        didAgentScript.type = 'module';
        didAgentScript.src = 'https://agent.d-id.com/v1/index.js';
        didAgentScript.setAttribute('data-name', 'did-agent');
        didAgentScript.setAttribute('data-mode', 'fabio');
        didAgentScript.setAttribute('data-client-key', 'Z29vZ2xlLW9hdXRoMnwxMTAzMDI2MDM4OTIzNjM5ODE5NjI6NDZiVnYxSWpRV2ItczAzeWJ4QVkw');
        didAgentScript.setAttribute('data-agent-id', 'agt_-FIQ0vTR');
        didAgentScript.setAttribute('data-monitor', 'true');
        
        // Add error handling
        didAgentScript.onerror = (e) => {
          console.error('D-ID Agent script failed to load:', e);
          setDidAgentStatus("error");
        };
        
        document.body.appendChild(didAgentScript);
        
        // Add event listener for D-ID agent loaded
        window.addEventListener('did-agent:ready', () => {
          console.log('D-ID Agent successfully loaded');
          setDidAgentStatus("success");
        });
      } catch (error) {
        console.error('Error setting up D-ID Agent:', error);
        setDidAgentStatus("error");
      }
    };
    
    // Load with a slight delay to ensure DOM is ready
    const timer = setTimeout(loadDidAgent, 500);
    
    // Clean up function
    return () => {
      clearTimeout(timer);
      const script = document.querySelector('script[data-name="did-agent"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
    */
  }, []);

  return (
    <PageLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Assistant</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our AI assistant can help you find resources, answer questions about membership, 
          and provide guidance on using the S3vn Studies platform.
        </p>
        
        {/* D-ID Agent status messages */}
        {didAgentStatus === "loading" && (
          <div className="flex items-center justify-center p-8 mb-8 bg-secondary/30 rounded-lg">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
            <p>Loading interactive AI assistant...</p>
          </div>
        )}
        
        {didAgentStatus === "error" && (
          <Alert className="mb-8">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Interactive Assistant Temporarily Unavailable</AlertTitle>
            <AlertDescription>
              Our interactive AI assistant is currently undergoing maintenance. 
              In the meantime, you can use our text-based AI assistant below.
            </AlertDescription>
          </Alert>
        )}
        
        {/* D-ID Agent will be injected here by the script */}
        {didAgentStatus === "success" && (
          <div id="d-id-agent-container" className="mb-8"></div>
        )}
        
        {/* Our custom AI assistant implementation */}
        <AiAssistant />
      </div>
    </PageLayout>
  );
}