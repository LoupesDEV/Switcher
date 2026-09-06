// export const command = `
//   cat WidgetMusic/layout.json && echo "|||" && 
//   osascript -e '
//     if application "Spotify" is running then
//         tell application "Spotify"
//             try
//                 set cTrack to current track
//                 set tName to name of cTrack
//                 set tArtist to artist of cTrack
//                 set tAlbum to album of cTrack
//                 set tArt to artwork url of cTrack
//         set tDuration to duration of cTrack -- in milliseconds
//         set tPos to player position -- in seconds
//                 set pState to player state as string
//         return pState & "@@@" & tName & "@@@" & tArtist & "@@@" & tArt & "@@@" & tPos & "@@@" & tDuration
//             on error
//                 return "stopped"
//             end try
//         end tell
//     else
//         return "stopped"
//     end if'
// `;

// export const refreshFrequency = 500;

// export const className = `
//   top: 0; left: 0; width: 100vw; height: 100vh;
//   z-index: 2; pointer-events: none;
//   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
// `;

// export const render = ({output, error}) => {
//   if (!output) return null;

//   const [jsonRaw, musicRaw] = output.split("|||");
  
//   let config;
//   try { config = JSON.parse(jsonRaw); } catch(e) { return null; }

//   let isPlaying = false;
//   let song = "En pause";
//   let artist = "Spotify";
//   let artwork = ""; 
//   let positionSec = 0;
//   let durationMs = 0;

//   if (musicRaw && musicRaw.includes("@@@")) {
//     const parts = musicRaw.trim().split("@@@");
//     if (parts.length >= 6) {
//         isPlaying = parts[0].includes("playing"); 
//         song = parts[1];
//         artist = parts[2];
//         artwork = parts[3];
//         positionSec = parseFloat(parts[4]) || 0;
//         durationMs = parseInt(parts[5]) || 0;
//     } else if (parts.length >= 4) {
//         // Fallback if timing not available
//         isPlaying = parts[0].includes("playing"); 
//         song = parts[1];
//         artist = parts[2];
//         artwork = parts[3];
//     }
//   } else if (musicRaw && (musicRaw.includes("stopped") || musicRaw.includes("paused"))) {
//     isPlaying = false;
//     song = "Aucune musique";
//     artist = "Spotify";
//     artwork = "";
//     positionSec = 0;
//     durationMs = 0;
//   }

//   const durationSec = durationMs > 0 ? durationMs / 1000 : 0;
//   const progress = durationSec > 0 ? Math.max(0, Math.min(1, positionSec / durationSec)) : 0;

//   const formatTime = (sec) => {
//     const s = Math.max(0, Math.floor(sec || 0));
//     const m = Math.floor(s / 60);
//     const r = s % 60;
//     return `${m}:${r.toString().padStart(2, '0')}`;
//   };

//   const currentLabel = formatTime(positionSec);
//   const totalLabel = formatTime(durationSec);

//   const containerStyle = {
//     position: 'absolute',
//     top: config.top,
//     left: config.left,
//     right: config.right,
//     width: config.width || '320px',
//     height: '80px',
    
//     backgroundColor: config.bgcolor || 'rgba(20, 20, 20, 0.9)',
//     borderRadius: '16px',
//     border: `1px solid ${config.borderColor || 'rgba(255,255,255,0.1)'}`,
//     boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    
//     display: 'flex',
//     alignItems: 'center',
//     padding: '10px',
//     gap: '15px',
//     pointerEvents: 'auto',
//     transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
//     overflow: 'hidden'
//   };

//   const artStyle = {
//     width: '60px',
//     height: '60px',
//     borderRadius: '10px',
//     objectFit: 'cover',
//     backgroundColor: '#333', 
//     flexShrink: 0,
//     boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
//   };

//   const textContainerStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     minWidth: 0 
//   };

//   const songStyle = {
//     color: config.color || 'white',
//     fontSize: '15px',
//     fontWeight: '700',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     marginBottom: '4px'
//   };

//   const artistStyle = {
//     color: config.color || 'white',
//     fontSize: '13px',
//     fontWeight: '400',
//     opacity: 0.7,
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis'
//   };

//   const progressContainerStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '6px',
//     marginTop: '6px'
//   };

//   const timeRowStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   };

//   const timeStyle = {
//     color: config.color || 'white',
//     fontSize: '11px',
//     fontWeight: '500',
//     opacity: 0.7
//   };

//   const progressBarStyle = {
//     width: '220px',
//     height: '4px',
//     borderRadius: '2px',
//     backgroundColor: config.bgcolor || 'rgba(255, 255, 255, 0.1)',
//     border: `1px solid rgba(0, 0, 0, 0.15)`, 
//     overflow: 'hidden'
//   };

//   const progressFillStyle = {
//     height: '100%',
//     width: `${Math.round(progress * 100)}%`,
//     background: config.color || 'white',
//     transition: 'width 0.5s linear'
//   };

//   const defaultArt = "https://cdn-icons-png.flaticon.com/512/10701/10701484.png";

//   return (
//     <div style={containerStyle}>
//       <img src={artwork || defaultArt} style={artStyle} />
//       <div style={textContainerStyle}>
//         <div style={songStyle}>{song}</div>
//         <div style={artistStyle}>{artist}</div>
//         {durationSec > 0 && (
//           <div style={progressContainerStyle}>
//             <div style={timeRowStyle}>
//               <span style={timeStyle}>{currentLabel}</span>
//               <span style={timeStyle}>{totalLabel}</span>
//             </div>
//             <div style={progressBarStyle}>
//               <div style={progressFillStyle} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };  
