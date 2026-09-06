export const command = "cat WidgetPhoto10/layout.json"; 

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 1; pointer-events: none;
`;

export const render = ({output, error}) => {
  if (error || !output) return null;

  let config;
  try { config = JSON.parse(output); } catch (e) { return null; }

  const fileName = config.filename || "current.png";
  const imagePath = `${config.folder}/${fileName}`;
  
  const cacheBuster = config.timestamp || "";

  const dynamicStyle = {
    position: 'absolute',
    top: config.top,
    left: config.left,
    right: config.right,
    width: config.width,
    height: config.height || 'auto',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    pointerEvents: 'auto',
    transition: 'all 0.5s ease',
    display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
  };

  return (
    <div style={dynamicStyle}>
      <img 
        src={`${imagePath}?t=${cacheBuster}`} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
    </div>
  );
};