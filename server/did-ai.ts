import { Request, Response } from "express";

// Define interfaces for D-ID API responses
interface DidResponse {
  id?: string;
  status?: string;
  result_url?: string;
  error?: {
    message?: string;
    type?: string;
  };
}

// Create a talk request to D-ID API
export async function createTalkRequest(req: Request, res: Response) {
  try {
    // Validate that D-ID API key is set
    if (!process.env.D_ID_API_KEY) {
      return res.status(500).json({ error: "D-ID API key is not configured" });
    }

    // Validate input
    const { text, presenter_id } = req.body;
    if (!text || !presenter_id) {
      return res.status(400).json({ error: "Missing required fields: text or presenter_id" });
    }

    // Make request to D-ID API
    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${process.env.D_ID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: {
          type: "text",
          input: text,
        },
        presenter_id,
        driver_id: "basic",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("D-ID API error:", errorData);
      return res.status(response.status).json({
        error: errorData.error || "Failed to create talk request",
      });
    }

    const data: DidResponse = await response.json();
    return res.status(201).json({
      id: data.id,
      status: data.status,
    });
  } catch (error: any) {
    console.error("Error creating talk request:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}

// Get status of a talk request
export async function getTalkStatus(req: Request, res: Response) {
  try {
    // Validate that D-ID API key is set
    if (!process.env.D_ID_API_KEY) {
      return res.status(500).json({ error: "D-ID API key is not configured" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing talk ID" });
    }

    // Make request to D-ID API
    const response = await fetch(`https://api.d-id.com/talks/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${process.env.D_ID_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("D-ID API error:", errorData);
      return res.status(response.status).json({
        error: errorData.error || "Failed to get talk status",
      });
    }

    const data: DidResponse = await response.json();
    
    // Normalize the response
    const result = {
      id: data.id,
      status: data.status === "done" ? "done" : data.status === "failed" ? "failed" : "processing",
      result_url: data.result_url,
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error getting talk status:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}

// Get available presenters
export async function getAvailablePresenters(req: Request, res: Response) {
  try {
    // Validate that D-ID API key is set
    if (!process.env.D_ID_API_KEY) {
      return res.status(500).json({ error: "D-ID API key is not configured" });
    }

    // Make request to D-ID API
    const response = await fetch("https://api.d-id.com/presenters", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${process.env.D_ID_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("D-ID API error:", errorData);
      return res.status(response.status).json({
        error: errorData.error || "Failed to get presenters",
      });
    }

    const data = await response.json();
    return res.status(200).json(data.presenters || []);
  } catch (error: any) {
    console.error("Error getting presenters:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}

// Get available voices
export async function getAvailableVoices(req: Request, res: Response) {
  try {
    // Validate that D-ID API key is set
    if (!process.env.D_ID_API_KEY) {
      return res.status(500).json({ error: "D-ID API key is not configured" });
    }

    // Make request to D-ID API
    const response = await fetch("https://api.d-id.com/tts/voices", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${process.env.D_ID_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("D-ID API error:", errorData);
      return res.status(response.status).json({
        error: errorData.error || "Failed to get voices",
      });
    }

    const data = await response.json();
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error("Error getting voices:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}