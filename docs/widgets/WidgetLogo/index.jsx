export const command = "cat WidgetLogo/layout.json";

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 1; pointer-events: none;
`;

export const render = ({output, error}) => {
  if (!output || error) return null;

  let config;
  try { config = JSON.parse(output); } catch(e) { return null; }

  const containerStyle = {
    position: 'absolute',
    top: config.top,
    left: config.left,
    right: config.right,
    width: config.width || 'auto',
    textAlign: config.align || 'center',
    transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  const textStyle = {
    fontFamily: '"Bodoni Moda", serif',
    fontWeight: '900',
    color: config.color || '#9A1C1F',
    fontSize: config.size || '6rem',
    lineHeight: '0.8',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transform: 'scaleX(0.55)',
    transformOrigin: config.align === 'right' ? 'right' : (config.align === 'left' ? 'left' : 'center'),
    letterSpacing: '-4px',
    textShadow: '0 20px 40px rgba(0,0,0,0.2)',
  };

  return (
    <div style={containerStyle}>
      {/* On charge la police ICI pour éviter l'erreur Promise Rejection */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@900&display=swap');`}
      </style>
      
      <div style={textStyle}>SABRINA<br/>CARPENTER</div>
    </div>
  );
};