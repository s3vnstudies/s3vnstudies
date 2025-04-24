import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import { AiAssistant } from "@/components/ai-assistant";

export default function AiAssistantPage() {
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - AI Assistant";
    
    // Load the D-ID Agent script with error handling
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
        };
        
        // Create container element if it doesn't exist
        const container = document.getElementById('d-id-agent-container');
        if (!container) {
          const newContainer = document.createElement('div');
          newContainer.id = 'd-id-agent-container';
          newContainer.style.width = '100%';
          newContainer.style.marginBottom = '2rem';
          document.querySelector('.container')?.prepend(newContainer);
        }
        
        document.body.appendChild(didAgentScript);
        
        // Add event listener for D-ID agent loaded
        window.addEventListener('did-agent:ready', () => {
          console.log('D-ID Agent successfully loaded');
        });
      } catch (error) {
        console.error('Error setting up D-ID Agent:', error);
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