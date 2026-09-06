export const command = "cat WidgetStrip/layout.json";

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 0;
  font-family: -apple-system, sans-serif;
`;

export const render = ({output}) => {
  if (!output) return null;
  let config;
  try { config = JSON.parse(output); } catch(e) { return null; }

  const containerStyle = {
    position: 'absolute',
    top: config.top || '0',
    left: config.left, 
    right: config.right,
    width: config.width || '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.bgcolor || 'transparent',
    borderLeft: config.borderLeft || 'none',
    borderRight: config.borderRight || 'none',
    opacity: config.opacity || 0.8
  };

  const textStyle = {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    color: config.color || '#fff',
    fontSize: config.fontSize || '0.7rem',
    fontWeight: 'bold',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  };

  return (
    <div style={containerStyle}>
      <div style={textStyle}>{config.text}</div>
    </div>
  );
};