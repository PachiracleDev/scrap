import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  db: {
    uri: process.env.DB_URI,
  },
  jwt: {
    accessSecret: process.env.ACCESS_SECRET,
  },
  chatgpt: {
    apiKey: process.env.CHATGPT_API_KEY,
  },
}));
