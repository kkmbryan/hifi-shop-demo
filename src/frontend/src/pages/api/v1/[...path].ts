import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8080';

  const pathSegments = req.query.path;
  const subPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments || '';
  
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'path') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined) {
        searchParams.append(key, value);
      }
    }
  }

  const queryStr = searchParams.toString();
  const targetUrl = `${backendUrl}/api/v1/${subPath}${queryStr ? '?' + queryStr : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Error proxying API request to backend:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
