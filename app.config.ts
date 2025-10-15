import 'dotenv/config'
import appJson from './app.json'

export default {
    ...(appJson as any).expo,
    extra: {
        ...(appJson as any).expo?.extra,
        PREDICTION_KEY: process.env.PREDICTION_KEY,
        CUSTOM_VISION_BASE_URL: process.env.CUSTOM_VISION_BASE_URL,
        CUSTOM_VISION_BASE_IMAGE: process.env.CUSTOM_VISION_BASE_IMAGE,
    }
}