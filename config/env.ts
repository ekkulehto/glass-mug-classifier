import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

type Extra = {
  PREDICTION_KEY?: string;
  CUSTOM_VISION_BASE_URL?: string;
  CUSTOM_VISION_BASE_IMAGE?: string;
};

const fromExpo = (Constants.expoConfig?.extra ?? {}) as Extra;
const fromManifest = ((Updates as any).manifest?.extra ?? {}) as Extra;
const extra: Extra = { ...fromExpo, ...fromManifest };

function need<K extends keyof Extra>(k: K): string {
  const v = extra[k];
  if (!v) throw new Error(`Missing env: ${String(k)}`);
  return v;
}

export const ENV = {
  PREDICTION_KEY: need('PREDICTION_KEY'),
  CUSTOM_VISION_BASE_URL: need('CUSTOM_VISION_BASE_URL'),
  CUSTOM_VISION_BASE_IMAGE: need('CUSTOM_VISION_BASE_IMAGE'),
};