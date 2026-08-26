import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req, res) {
  try {
    const room = req.query.room || 'ma-salle';
    const identity = req.query.identity || `user-${Date.now()}`;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        error: 'Clés LiveKit manquantes'
      });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: identity,
      ttl: '1h'
    });

    token.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true
    });

    const jwt = await token.toJwt();

    return res.status(200).json({
      token: jwt
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}