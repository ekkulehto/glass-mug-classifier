import { getRefreshedTokens } from "@/lib/auth";

const FUNCTION_APP_URL = "https://glass-mug-classifier-function-app-h9eadrh8ebdcc6dn.northeurope-01.azurewebsites.net/api";

export type CvPrediction = { 
  tagName: string; 
  probability: number
};

async function ensureOk(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Prediction ${res.status}: ${text || res.statusText}`);
  }
}

async function getAuthHeaders() {
  const tokens = await getRefreshedTokens();
  if (!tokens?.accessToken) {
    throw new Error("User is not authenticated. Please sign in again.");
  }
  return {
    'Authorization': `Bearer ${tokens.accessToken}`
  };
}

export async function predictFromUrl(imageUrl: string): Promise<CvPrediction[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${FUNCTION_APP_URL}/predict/url`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: imageUrl }),
  });

  await ensureOk(res);
  const json = await res.json();
  return (json?.predictions ?? []) as CvPrediction[];
}

export async function predictFromFile(fileUri: string): Promise<CvPrediction[]> {
  const authHeaders = await getAuthHeaders();
  const blob = await (await fetch(fileUri)).blob();

  const res = await fetch(`${FUNCTION_APP_URL}/predict/image`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/octet-stream',
    },
    body: blob,
  });
  
  await ensureOk(res);
  const json = await res.json();
  return (json?.predictions ?? []) as CvPrediction[];
}