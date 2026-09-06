export const command = "cat WidgetClock/layout.json";

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 2; /* Au-dessus des photos */
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const render = ({output, error}) => {
  if (error) return null; 
  if (!output) return null;

  let config;
  try {
    config = JSON.parse(output);
  } catch (e) { return null; }

  const now = new Date();
  
  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit', 
    minute: '2-digit'
  });

  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  });

  const containerStyle = {
    position: 'absolute',
    top: config.top,
    left: config.left,
    right: config.right,
    textAlign: config.align || 'center', 
    color: config.color || 'white', 
    transition: 'all 0.5s ease', 
    textShadow: '0 10px 20px rgba(0,0,0,0.15)', 
  };

  const timeStyle = {
    fontSize: config.size || '8rem',
    fontWeight: '700',
    lineHeight: '1',
    letterSpacing: '-0.05em' 
  };

  const dateStyle = {
    fontSize: '1.5rem',
    fontWeight: '500',
    opacity: 0.8,
    marginTop: '10px',
    textTransform: 'capitalize'
  };

  return (
    <div style={containerStyle}>
      <div style={timeStyle}>{time}</div>
      <div style={dateStyle}>{date}</div>
    </div>
  );
};
