
// GadiSewa AI Service - Connecting to Python Backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const aiBackend = {
  async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`AI API Error: ${response.statusText}`);
    return response.json();
  },

  async fetchGlobalPartsList() {
    return this.fetchApi('/ai/parts-catalog');
  },

  async analyzeJobComplaint(complaint: string, vehicleInfo: string) {
    const response = await this.fetchApi('/ai/analyze-complaint', {
      method: 'POST',
      body: JSON.stringify({ complaint, vehicleInfo })
    });

    // The backend returns a raw_response string which is likely JSON
    try {
      return JSON.parse(response.raw_response);
    } catch {
      return {
        possibleCauses: ["Check diagnostics"],
        suggestedSteps: ["Inspect vehicle"],
        estimatedLaborHours: 1
      };
    }
  },

  async generateFinancialInsight(data: any) {
    // This could also be a backend call
    return "Analyzing your financials with GadiSewa AI...";
  }
};
