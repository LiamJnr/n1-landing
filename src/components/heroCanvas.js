// export function heroCanvas() {

//     /** @type {HTMLCanvasElement} */

//     const canvas = document.getElementById('hero-canvas');
//     const ctx = canvas.getContext('2d');

//     // Resize canvas to fill the hero area
//     function resize() {
//       canvas.width = window.innerWidth;
//       canvas.height = 600; // Adjust hero height here
//       draw();
//     }

//     function draw() {
//       const w = canvas.width;
//       const h = canvas.height;
//       const centerX = w / 2;
//       const centerY = h * 0.8; // Position the "planet" peak

//       // 1. Background: Solid Black
//       ctx.fillStyle = '#000';
//       ctx.fillRect(0, 0, w, h);

//       // 2. The Soft Blue Glow (Radial Gradient)
//       const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, h * 0.6);
//       glow.addColorStop(0, 'rgba(0, 110, 255, 0.4)');
//       glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
//       ctx.fillStyle = glow;
//       ctx.fillRect(0, 0, w, h);

//       // 3. The Bright Horizon Line
//       ctx.beginPath();
//       // We draw a large ellipse and only stroke the top arc
//       ctx.ellipse(centerX, centerY + 400, w * 0.7, 420, 0, 0, Math.PI * 2);
      
//       ctx.strokeStyle = '#80d4ff'; 
//       ctx.lineWidth = 2;
      
//       // Shadow/Glow effect for the line itself
//       ctx.shadowBlur = 15;
//       ctx.shadowColor = '#00a2ff';
      
//       ctx.stroke();

//       // 4. The "Sun" Peak (Central Highlight)
//       const flare = ctx.createRadialGradient(centerX, centerY - 15, 0, centerX, centerY - 15, 50);
//       flare.addColorStop(0, 'white');
//       flare.addColorStop(0.2, 'rgba(173, 216, 230, 0.8)');
//       flare.addColorStop(1, 'transparent');
      
//       ctx.fillStyle = flare;
//       ctx.globalCompositeOperation = 'lighter'; // Makes it "pop"
//       ctx.arc(centerX, centerY - 15, 50, 0, Math.PI * 2);
//       ctx.fill();
//     }

//     window.addEventListener('resize', resize);
//     resize();
// }



