export const command = "cat WidgetRecord/layout.json";

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

  const isPlatinum = config.theme === 'sabrina';
  
  const frameWidth = parseInt(config.width) || 150;
  const discSize = frameWidth * (isPlatinum ? 0.7 : 0.65); 

  const frameStyle = {
    position: 'absolute',
    top: config.top,
    left: config.left, 
    right: config.right,
    width: config.width || '150px',
    height: config.height || '200px',
    
    backgroundColor: config.bgcolor || (isPlatinum ? 'rgba(16, 32, 48, 0.85)' : '#111'), 
    border: config.border || 'none',
    borderRadius: config.radius || '20px',
    
    backdropFilter: isPlatinum ? 'blur(10px)' : 'none',
    boxShadow: config.shadow || '0 10px 30px rgba(0,0,0,0.2)',
    
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    gap: '15px',
    transition: 'all 0.5s ease',
    transform: config.rotate ? `rotate(${config.rotate})` : 'none',
  };

  const discStyle = {
    width: `${discSize}px`,
    height: `${discSize}px`,
    borderRadius: '50%',
    background: isPlatinum 
        ? 'conic-gradient(from 45deg, silver, #fff, #dcdcdc, #fff, silver, #a9a9a9, silver)'
        : 'radial-gradient(circle, #111 0%, #111 30%, #000 100%)', 
    backgroundImage: isPlatinum 
        ? 'conic-gradient(#e0e0e0 0%, #ffffff 25%, #c0c0c0 50%, #ffffff 75%, #e0e0e0 100%)' 
        : 'repeating-radial-gradient(#111 0, #111 2px, #222 3px, #222 4px)',
    boxShadow: isPlatinum ? '0 0 10px rgba(255,255,255,0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    border: isPlatinum ? '1px solid #fff' : 'none',
    flexShrink: 0
  };

  const labelStyle = {
    width: `${discSize * 0.35}px`,
    height: `${discSize * 0.35}px`,
    borderRadius: '50%',
    backgroundColor: isPlatinum ? '#F5A9B8' : '#fff', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: isPlatinum ? '0.8rem' : '0.4rem', 
    textAlign: 'center', color: '#111', fontWeight: 'bold',
    border: '1px solid rgba(0,0,0,0.1)'
  };

  const plaqueStyle = {
    background: isPlatinum ? 'linear-gradient(to right, #e0e0e0, #ffffff, #e0e0e0)' : 'transparent',
    padding: isPlatinum ? '5px' : '0',
    width: '100%',
    borderRadius: '3px',
    textAlign: 'center',
    display: 'flex', flexDirection: 'column', gap: '2px',
    boxShadow: isPlatinum ? '0 2px 5px rgba(0,0,0,0.3)' : 'none',
    marginTop: isPlatinum ? 'auto' : '0',
  };

  return (
    <div style={frameStyle}>
        {/* Le Disque */}
        <div style={discStyle}>
            <div style={labelStyle}>
                {isPlatinum ? '☕️' : ''} {/* Rien en normal, juste blanc */}
            </div>
        </div>

        {/* Le Texte */}
        <div style={plaqueStyle}>
            {isPlatinum ? (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{fontSize: '0.4rem', fontWeight: 'bold', letterSpacing: '0.5px', color: '#555'}}>PRESENTED TO</div>
                    <div style={{fontSize: '0.7rem', fontWeight: '900', color: '#000', margin: '1px 0', textTransform: 'uppercase'}}>SABRINA CARPENTER</div>
                    <div style={{fontSize: '0.35rem', color: '#666'}}>TO COMMEMORATE PLATINUM SALES OF</div>
                    <div style={{fontSize: '0.6rem', fontStyle: 'italic', fontWeight: 'bold', color: '#1A3A5E', marginTop: '1px'}}>"ESPRESSO"</div>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {/* Texte adaptable via la config (Noir pour fond blanc) */}
                    <div style={{fontSize: '0.9rem', fontWeight: '900', color: config.textColor || '#000', textTransform: 'uppercase', letterSpacing: '-0.5px'}}>NOW SPINNING</div>
                    <div style={{fontSize: '0.6rem', fontWeight: '600', color: config.subColor || '#888', letterSpacing: '1px'}}>COLLECTION 2026</div>
                </div>
            )}
        </div>
    </div>
  );
};