
function getCurrentURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://127.0.0.1:5500";
}

const SPOTIFY_CONFIG = {
  CLIENT_ID: "139e5acd405943059e900e6560401ce7",

  CLIENT_SECRET: "60fd4688c9da4daea97988a52a2a3a91",

  get REDIRECT_URI() {
    return getCurrentURL();
  },
};

console.log(`
🎵 SPORTIFY WEB PLAYER
📝 Cấu hình:
- Client ID: ${SPOTIFY_CONFIG.CLIENT_ID ? "✅" : "❌"}
- Client Secret: ${SPOTIFY_CONFIG.CLIENT_SECRET ? "✅" : "❌"}
- Redirect URI: ${SPOTIFY_CONFIG.REDIRECT_URI}
`);
