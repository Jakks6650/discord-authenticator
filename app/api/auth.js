import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenResponse.data;

    // Fetch the user's guilds
    const guildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const guild = guildsResponse.data.find(guild => guild.id === '1237219812091101324');

    if (!guild) {
      return res.redirect('https://YOUR_HOME_URL'); // Redirect to home URL if the user is not in the server
    }

    // Fetch the user's roles in the server
    const memberResponse = await axios.get(`https://discord.com/api/v10/guilds/${guild.id}/members/@me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const hasRequiredRole = memberResponse.data.roles.includes('1237219812300816475');

    if (hasRequiredRole) {
      return res.redirect('https://YOUR_VERIFIED_URL'); // Redirect to verified URL
    } else {
      return res.redirect('https://YOUR_HOME_URL'); // Redirect to home URL
    }
  } catch (error) {
    console.error('Error during Discord OAuth2 flow:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
