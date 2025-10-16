import { ENV } from '@/config/env';

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

export async function predictFromUrl(imageUrl: string): Promise<CvPrediction[]> {
  const res = await fetch(ENV.CUSTOM_VISION_BASE_URL, {
    method: 'POST',
    headers: {
      'Prediction-Key': ENV.PREDICTION_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Url: imageUrl }),
  });

  await ensureOk(res);
  const json = await res.json();
  return (json?.predictions ?? []) as CvPrediction[];
}

export async function predictFromFile(fileUri: string): Promise<CvPrediction[]> {
  const blob = await (await fetch(fileUri)).blob();

  const res = await fetch(ENV.CUSTOM_VISION_BASE_IMAGE, {
    method: 'POST',
    headers: {
      'Prediction-Key': ENV.PREDICTION_KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: blob,
  });
  
  await ensureOk(res);
  const json = await res.json();
  return (json?.predictions ?? []) as CvPrediction[];
}
