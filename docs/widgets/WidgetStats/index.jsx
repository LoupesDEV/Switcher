// export const command = `
//   cat WidgetStats/layout.json && echo "@@@" &&

//   CPU=$(sysctl -n vm.loadavg | awk '{print $2 * 100}') &&
//   RAM=$(memory_pressure | grep "System-wide memory free percentage" | awk '{print 24 * (100 - $5) / 100}') &&
  
//   echo "$CPU::$RAM"
// `;

// export const refreshFrequency = 1000;

// export const className = `
//   top: 0; left: 0; width: 100vw; height: 100vh;
//   z-index: 1; pointer-events: none;
//   font-family: -apple-system, monospace;
// `;

// export const render = ({output, error}) => {
//   if (!output) return null;

//   const [jsonRaw, statsRaw] = output.split("@@@");
//   let config;
//   try { config = JSON.parse(jsonRaw); } catch(e) { return null; }

//   let cpuVal = 0;
//   let ramVal = 0;

//   if (statsRaw) {
//       const parts = statsRaw.trim().split("::");
//       if (parts.length === 2) {
//           cpuVal = (parseFloat(parts[0])/12);
//           ramVal = parseFloat(parts[1]);
//       }
//   }

//   const cpuPercent = Math.min(cpuVal, 100); 
//   const ramPercent = Math.min((ramVal / 24) * 100, 100); 

//   const containerStyle = {
//     position: 'absolute',
//     top: config.top,
//     left: config.left,
//     right: config.right,
//     width: config.width || '200px',
//     color: config.color || 'white',
//     padding: '15px',
//     borderRadius: '12px',
//     backgroundColor: config.bgcolor || 'transparent',
//     border: config.border ? `1px solid ${config.borderColor}` : 'none',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     transition: 'all 0.5s ease',
//   };

//   const labelStyle = {
//     fontSize: '0.7rem',
//     fontWeight: '700',
//     letterSpacing: '1px',
//     marginBottom: '3px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     opacity: 0.8
//   };

//   const trackStyle = {
//     width: '100%',
//     height: config.barHeight || '4px',
//     backgroundColor: config.trackColor || 'rgba(128,128,128,0.3)',
//     borderRadius: '10px',
//     overflow: 'hidden'
//   };

//   const barStyle = (percent) => ({
//     width: `${percent}%`,
//     height: '100%',
//     backgroundColor: config.barColor || config.color,
//     transition: 'width 1s ease',
//     borderRadius: '10px'
//   });

//   return (
//     <div style={containerStyle}>
//       <div>
//         <div style={labelStyle}>
//             <span>CPU</span>
//             <span>{Math.round(cpuVal)}%</span>
//         </div>
//         <div style={trackStyle}>
//             <div style={barStyle(cpuPercent)}></div>
//         </div>
//       </div>

//       {/* SECTION RAM */}
//       <div>
//         <div style={labelStyle}>
//             <span>RAM</span>
//             <span>{Math.round(ramVal)} GB</span>
//         </div>
//         <div style={trackStyle}>
//             <div style={barStyle(ramPercent)}></div>
//         </div>
//       </div>
//     </div>
//   );
// };
