export const command = `
  cat WidgetRecord/layout.json && echo "|||" && 
  osascript -e '
    if application "Spotify" is running then
        tell application "Spotify"
            try
                set cTrack to current track
                set tName to name of cTrack
                set tArtist to artist of cTrack
                set tAlbum to album of cTrack
                set tArt to artwork url of cTrack
        set tDuration to duration of cTrack -- in milliseconds
        set tPos to player position -- in seconds
                set pState to player state as string
        return pState & "@@@" & tName & "@@@" & tArtist & "@@@" & tArt & "@@@" & tPos & "@@@" & tDuration
            on error
                return "stopped"
            end try
        end tell
    else
        return "stopped"
    end if'
`;

export const refreshFrequency = 500;

export const className = `
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 0;
  font-family: -apple-system, sans-serif;
`;

export const render = ({output}) => {
  if (!output) return null;
  
  const [jsonRaw, musicRaw] = output.split("|||");

  let config;
  try { config = JSON.parse(jsonRaw); } catch(e) { return null; }

  let song = "Aucune musique";
  let artist = "Spotify";
  let artwork = "";
  let isPlaying = false;

  if (musicRaw && musicRaw.includes("@@@")) {
    const parts = musicRaw.trim().split("@@@");
    if (parts.length >= 4) {
        song = parts[1];
        artist = parts[2];
        artwork = parts[3];
        isPlaying = true;
    }
  } else if (musicRaw && (musicRaw.includes("stopped") || musicRaw.includes("paused"))) {
    song = "Aucune musique";
    artist = "Spotify";
    isPlaying = false;
  }

  const isPlatinum = config.theme === 'colors';
  
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

  const artworkStyle = {
    width: `${discSize}px`,
    height: `${discSize}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: isPlatinum ? '0 0 10px rgba(255,255,255,0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
    flexShrink: 0
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
    overflow: 'hidden'
  };

  const textStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%'
  };

  return (
    <div style={frameStyle}>
        {isPlaying ? (
            <img src={artwork} style={artworkStyle} alt="Album Cover" />
        ) : (
            <div style={discStyle}>
                <div style={labelStyle}>
                    {isPlatinum ? '☕️' : ''}
                </div>
            </div>
        )}

        {/* Le Texte */}
        <div style={plaqueStyle}>
            {isPlatinum ? (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                    <div style={{fontSize: '0.4rem', fontWeight: 'bold', letterSpacing: '0.5px', color: '#555'}}>PRESENTED TO</div>
                    <div style={{...textStyle, fontSize: '0.7rem', fontWeight: '900', color: '#000', margin: '1px 0', textTransform: 'uppercase'}}>{artist}</div>
                    <div style={{fontSize: '0.35rem', color: '#666'}}>TO COMMEMORATE PLATINUM SALES OF</div>
                    <div style={{...textStyle, fontSize: '0.6rem', fontStyle: 'italic', fontWeight: 'bold', color: '#1A3A5E', marginTop: '1px'}}>"{song}"</div>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                    <div style={{...textStyle, fontSize: '0.9rem', fontWeight: '900', color: config.textColor || '#000', textTransform: 'uppercase', letterSpacing: '-0.5px'}}>{song}</div>
                    <div style={{...textStyle, fontSize: '0.6rem', fontWeight: '600', color: config.subColor || '#888', letterSpacing: '1px'}}>{artist}</div>
                </div>
            )}
        </div>
    </div>
  );
};