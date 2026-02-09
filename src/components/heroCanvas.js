// export function heroCanvas(){
    
//     const heroSection = document.querySelector('.hero-section');
//     const canvas = document.getElementById('hero-canvas');

//     if(!heroSection || !canvas) return;

//     const ctx = canvas.getContext('2d');
//     const step = 50;

//     function resize(){
//         const rect = heroSection.getBoundingClientRect();
//         const dpr = window.devicePixelRatio || 1;

//         // display size
//         canvas.style.width = rect.width + 'px';
//         canvas.style.height = rect.height + 'px';

//         //drawing surface size (scaled for DPI)
//         canvas.width = rect.width * dpr;
//         canvas.height = rect.height * dpr;

//         ctx.scale(dpr, dpr);
        
//         drawGrid();
//     }

//     function drawGrid() {
//         const rect = heroSection.getBoundingClientRect();
//         const w = rect.width;
//         const h = rect.height;
//         const diamondSize = 3; // The "radius" of the diamond

//         ctx.clearRect(0, 0, w, h);

//         // 1. Draw the Lines
//         ctx.beginPath();
//         ctx.strokeStyle = 'rgba(124, 124, 124, 0.15)'; // Slightly lighter for the grid
//         ctx.lineWidth = 1;

//         for (let y = 0.5; y <= h; y += step) {
//             ctx.moveTo(0, y);
//             ctx.lineTo(w, y);
//         }
//         for (let x = 0.5; x <= w; x += step) {
//             ctx.moveTo(x, 0);
//             ctx.lineTo(x, h);
//         }
//         ctx.stroke();

//         // 2. Draw the Diamonds at Intersections
//         ctx.beginPath();
//         ctx.fillStyle = 'rgba(124, 124, 124, 0.8)'; // Stronger color for the points

//         for (let x = 0.5; x <= w; x += step) {
//             for (let y = 0.5; y <= h; y += step) {
//                 // Draw diamond shape
//                 ctx.moveTo(x, y - diamondSize); // Top
//                 ctx.lineTo(x + diamondSize, y); // Right
//                 ctx.lineTo(x, y + diamondSize); // Bottom
//                 ctx.lineTo(x - diamondSize, y); // Left
//                 ctx.closePath();
//             }
//         }
//         ctx.fill();
//     }

//     // Initialize and listen for changes
//     window.addEventListener('resize', resize);
//     resize();
    
//     // drawGrid();
// }



export function heroCanvas() {
    const heroSection = document.querySelector('.hero-section');
    const canvas = document.getElementById('hero-canvas');
    if (!heroSection || !canvas) return;

    const ctx = canvas.getContext('2d');
    const step = 50;
    const diamondSize = 2;
    let beams = [];
    let animationFrameId;

    class Beam {
        constructor(w, h) {
            this.init(w, h);
        }

        init(w, h) {
            this.len = Math.random() * 50 + 10; // Length of the beam
            this.speed = Math.random() * 2 + 1;  // Speed of travel
            this.dir = Math.random() > 0.5 ? 'H' : 'V'; // Horizontal or Vertical
            
            if (this.dir === 'H') {
                this.y = Math.floor(Math.random() * (h / step)) * step + 0.5;
                this.x = -this.len; // Start off-screen left
            } else {
                this.x = Math.floor(Math.random() * (w / step)) * step + 0.5;
                this.y = -this.len; // Start off-screen top
            }
            this.color = 'rgba(0, 100, 200,'; // Cyan base
        }

        update(w, h) {
            if (this.dir === 'H') this.x += this.speed;
            else this.y += this.speed;

            // Reset if the tail passes the edge
            if (this.x > w + this.len || this.y > h + this.len) {
                this.init(w, h);
            }
        }

        draw(ctx) {
            ctx.lineWidth = 1;
            let grad;

            if (this.dir === 'H') {
                grad = ctx.createLinearGradient(this.x - this.len, this.y, this.x, this.y);
                grad.addColorStop(0, `${this.color} 0)`);
                grad.addColorStop(1, `${this.color} 0.8)`);
                ctx.strokeStyle = grad;
                ctx.beginPath();
                ctx.moveTo(this.x - this.len, this.y);
                ctx.lineTo(this.x, this.y);
            } else {
                grad = ctx.createLinearGradient(this.x, this.y - this.len, this.x, this.y);
                grad.addColorStop(0, `${this.color} 0)`);
                grad.addColorStop(1, `${this.color} 0.8)`);
                ctx.strokeStyle = grad;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.len);
                ctx.lineTo(this.x, this.y);
            }
            ctx.stroke();
        }
    }

    function drawStaticElements(w, h) {
        // Draw Grid Lines
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(124, 124, 124, 0.1)';
        ctx.lineWidth = 1;
        for (let y = 0.5; y <= h; y += step) {
            ctx.moveTo(0, y); ctx.lineTo(w, y);
        }
        for (let x = 0.5; x <= w; x += step) {
            ctx.moveTo(x, 0); ctx.lineTo(x, h);
        }
        ctx.stroke();

        // Draw Diamonds at intersections
        ctx.beginPath();
        ctx.fillStyle = 'rgba(124, 124, 124, 0.4)';
        for (let x = 0.5; x <= w; x += step) {
            for (let y = 0.5; y <= h; y += step) {
                ctx.moveTo(x, y - diamondSize);
                ctx.lineTo(x + diamondSize, y);
                ctx.lineTo(x, y + diamondSize);
                ctx.lineTo(x - diamondSize, y);
                ctx.closePath();
            }
        }
        ctx.fill();
    }

    function resize() {
        const rect = heroSection.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Populate Beams
        beams = Array.from({ length: 15 }, () => new Beam(rect.width, rect.height));
    }

    function animate() {
        const rect = heroSection.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        drawStaticElements(rect.width, rect.height);

        // Draw Beams with a "Glow" effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 255, 200, 0.5)';
        beams.forEach(beam => {
            beam.update(rect.width, rect.height);
            beam.draw(ctx);
        });
        ctx.shadowBlur = 0; // Reset for performance

        animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
}