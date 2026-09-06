export const command = "cat WidgetBarcode/layout.json";

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 0;
  font-family: -apple-system, monospace;
`;

export const render = ({output}) => {
  if (!output) return null;
  let config;
  try { config = JSON.parse(output); } catch(e) { return null; }

  if (config.theme !== 'sabrina') {
      return null;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

  if (config.theme === 'sabrina') {
      const ticketStyle = {
        position: 'absolute',
        top: config.top, bottom: config.bottom, left: config.left, right: config.right,
        width: '300px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.4), rgba(26, 58, 94, 0.6))', 
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        display: 'flex',
        overflow: 'hidden',
        color: '#A0D2EB',
        transform: config.rotate ? `rotate(${config.rotate})` : 'none',
      };

      const mainPartStyle = {
          flex: '1',
          padding: '15px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: '2px dashed rgba(255,255,255,0.3)'
      };

      const stubStyle = {
          width: '80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.1)'
      };

      return (
        <div style={ticketStyle}>
            <div style={mainPartStyle}>
                <div style={{fontSize: '0.6rem', letterSpacing: '2px', color: '#FFC0CB'}}>ADMIT ONE</div>
<               div style={{fontSize: '1.2rem', fontWeight: '900', margin: '5px 0', textShadow: '0 0 4px rgba(255, 105, 180, 0.6)', letterSpacing: '1px'}}>SHORT N' SWEET</div>
                <div style={{fontSize: '0.7rem', opacity: 0.8}}>📍 WORLD TOUR • {dateStr}</div>
            </div>
            <div style={stubStyle}>
                <div style={{fontSize: '1.5rem'}}>VIP</div>
                {/* Petit code barres simulé en CSS */}
                <div style={{
                    marginTop: '5px', width: '80%', height: '20px', 
                    background: 'repeating-linear-gradient(90deg, #A0D2EB 0px, #A0D2EB 2px, transparent 2px, transparent 4px)'
                }}></div>
            </div>
        </div>
      );
  }

  const barcodeContainerStyle = {
    position: 'absolute',
    top: config.top, bottom: config.bottom, left: config.left, right: config.right,
    width: '60px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    opacity: config.opacity || 0.6,
  };

  const barcodeLinesStyle = {
    width: '100%',
    height: config.height || '250px',
    background: `
        linear-gradient(to bottom, 
            transparent 5%, 
            ${config.color} 5%, ${config.color} 10%, 
            transparent 10%, transparent 12%,
            ${config.color} 12%, ${config.color} 25%,
            transparent 25%, transparent 27%,
            ${config.color} 27%, ${config.color} 30%,
            transparent 30%, transparent 35%,
            ${config.color} 35%, ${config.color} 60%,
            transparent 60%, transparent 62%,
            ${config.color} 62%, ${config.color} 70%,
            transparent 70%, transparent 75%,
            ${config.color} 75%, ${config.color} 85%,
            transparent 85%, transparent 88%,
            ${config.color} 88%, ${config.color} 100%
        )
    `
  };

  return (
    <div style={barcodeContainerStyle}>
        <div style={{fontSize: '0.6rem', letterSpacing: '3px', marginBottom: '5px', writingMode: 'vertical-rl', textOrientation: 'mixed', color: config.color}}>
            SYSTEM ID
        </div>
        <div style={barcodeLinesStyle}></div>
        <div style={{fontSize: '0.7rem', fontWeight: 'bold', marginTop: '5px', letterSpacing: '1px', color: config.color}}>
            2026
        </div>
    </div>
  );
};