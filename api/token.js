import crypto from 'node:crypto';

function base64url(data) {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function createToken(apiKey, apiSecret, room, identity) {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    iss: apiKey,
    sub: identity,
    iat: now,
    exp: now + 3600,
    nbf: now,
    video: {
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true
    }
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(data)
    .digest();

  return `${data}.${base64url(signature)}`;
}

export default function handler(req, res) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        error: 'Variables LiveKit manquantes dans Vercel'
      });
    }

    const room = req.query.room || 'ma-salle';
    const identity = req.query.identity || `user-${Date.now()}`;

    const token = createToken(
      apiKey,
      apiSecret,
      room,
      identity
    );

    return res.status(200).json({
      token: token
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}
