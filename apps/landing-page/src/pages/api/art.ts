import { publishArt } from '../../lib/instagram';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.API_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Get x-api-key from request header and compare it to the API_KEY
   */
  if (req.headers['x-api-key'] !== API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  /**
   * If not POST, return 405
   */
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { message } = req.body;

  try {
    const published = await publishArt(message);
    res.status(200).json(published);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
