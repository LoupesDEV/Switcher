export const command = `cat WidgetLyrics/layout.json`;

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const LYRICS_SABRINA = [
  "That's that me espresso ☕️",                           // Espresso
  "I'm working late 'cause I'm a singer 🎤",              // Espresso
  "Heartbreak is one thing, my ego's another 💔",         // Please Please Please
  "I feel so much lighter like a feather 🪶",             // Feather
  "You'll just have to taste me when he's kissin' you 💋",// Taste
  "Lookin' at you got me thinkin' nonsense 🤪",           // Nonsense
  "I might let you make me Juno 🤰",                      // Juno
  "Because I liked a boy... 🎸"                           // because i liked a boy
];

export const render = ({output}) => {
  if (!output) return null;

  let config;
  try { config = JSON.parse(output); } catch(e) { return null; }

  if (config.theme !== 'sabrina') {
      return null;
  }

  const list = config.theme === 'sabrina' ? LYRICS_SABRINA : QUOTES_NORMAL;
  const index = Math.floor(Date.now() / 60000) % list.length;
  const text = list[index];

  const style = {
    position: 'absolute',
    top: config.top || 'auto',
    bottom: config.bottom || 'auto',
    left: config.left || 'auto',
    right: config.right || 'auto',
    width: config.width || 'auto',
    textAlign: config.align || 'center',
    
    color: config.color || '#fff',
    fontSize: config.fontSize || '1.2rem',
    fontWeight: config.fontWeight || '400',
    fontStyle: config.fontStyle || 'normal',
    textShadow: config.shadow || 'none',
    opacity: 0.9,
    transition: 'all 0.5s ease',
  };

  return <div style={style}>{text}</div>;
};