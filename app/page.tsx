import React from 'react';

const HomePage: React.FC = () => {
  const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;

  return (
    <div className="container">
      <h1>Welcome to the Discord Authenticator</h1>
      <p>Please log in with Discord to verify your role in the server.</p>
      <a href={discordAuthUrl}>
        <button type="button">Login with Discord</button>
      </a>
    </div>
  );
};

export default HomePage;
