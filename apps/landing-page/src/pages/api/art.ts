import { postMedia } from '../../lib/instagram';
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

  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const { creationId } = await postMedia(message);
      res.status(200).json({ creationId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }

    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
};
