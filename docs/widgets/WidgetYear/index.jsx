export const command = "cat WidgetYear/layout.json";

export const refreshFrequency = 1000;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 1;
  font-family: -apple-system, monospace;
`;

export const render = ({output}) => {
  if (!output) return null;
  
  let config;
  try { config = JSON.parse(output); } catch(e) { return null; }

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  const percentRaw = (now - start) / (end - start) * 100;
  const percent = percentRaw.toFixed(1);

  if (config.theme !== 'sabrina') {
    const containerStyle = {
        position: 'absolute',
        top: config.top, bottom: config.bottom, left: config.left, right: config.right,
        width: config.width || '250px',
        color: config.color || '#2C2C2C',
        display: 'flex', flexDirection: 'column', gap: '5px',
        opacity: 0.9, transition: 'all 0.5s ease',
    };
    return (
        <div style={containerStyle}>
            <div style={{fontSize: '0.8rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between'}}>
                <span>{now.getFullYear()} Progress</span>
                <span>{percent}%</span>
            </div>
            <div style={{width: '100%', height: '4px', backgroundColor: 'rgba(200,200,200,0.5)', borderRadius: '10px', overflow: 'hidden'}}>
                <div style={{width: `${percent}%`, height: '100%', backgroundColor: config.color, borderRadius: '10px'}}></div>
            </div>
        </div>
    );
  }

  const size = parseInt(config.width) || 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const vinylContainerStyle = {
      position: 'absolute',
      top: config.top, bottom: config.bottom, left: config.left, right: config.right,
      width: `${size}px`, height: `${size}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.5s ease',
  };

  return (
    <div style={vinylContainerStyle}>
        {/* Le Disque Noir (Fond) */}
        <div style={{
            position: 'absolute', width: '85%', height: '85%', 
            borderRadius: '50%', backgroundColor: '#111',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            border: '2px solid #333',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {/* Le Label Central */}
            <div style={{
                width: '40%', height: '40%', borderRadius: '50%', 
                backgroundColor: '#F5A9B8',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#1A3A5E', fontSize: '0.7rem', fontWeight: 'bold'
            }}>
                <span>{percent}%</span>
                <span style={{fontSize: '0.5rem'}}>2026</span>
            </div>
        </div>

        {/* L'Anneau de Progression (SVG) */}
        <svg height={size} width={size} style={{position: 'absolute', transform: 'rotate(-90deg)'}}>
            {/* Fond de la jauge */}
            <circle stroke="rgba(255,255,255,0.2)" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size/2} cy={size/2} />
            {/* Jauge de remplissage (Bleu Aura) */}
            <circle 
                stroke={config.color || '#1A3A5E'} 
                strokeWidth={strokeWidth} 
                strokeDasharray={`${circumference} ${circumference}`} 
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent" 
                r={radius} cx={size/2} cy={size/2} 
                style={{transition: 'stroke-dashoffset 1s ease'}}
            />
        </svg>
    </div>
  );
};