export function droopyEffect(){
    const svg = document.getElementById('jelly-svg');
    const jellyTextCntnr = svg.querySelector('text');

    if (!svg) return;
    if (!jellyTextCntnr) return;

    // split textContent into spans
    const tSpansArray = jellyTextCntnr.textContent.split('').map((char, i) => {
        return `<tspan class="key-${i} key" fill="white">${char}</tspan>`;
    }).join('');

    jellyTextCntnr.innerHTML = tSpansArray;

    const tspans = document.querySelectorAll('tspan');

    let frame = 0;

    function animate() {
        frame += 0.04;

        tspans.forEach((span, i) => {
            // SINE WAVE LOGIC
            // We calculate a scaleY (vertical stretch)
            // 1.0 is normal size, 1.8 is long and stretched
            const offset = i * 0.3;
            const stretch = 1 + Math.abs(Math.sin(frame + offset) * 0.8);
            
            // We also make it thinner as it gets longer (conservation of mass!)
            const squeeze = 1 / Math.sqrt(stretch);

            // Apply the elastic transform
            // scale(horizontal, vertical)
            span.style.transform = `scale(${squeeze}, ${stretch})`;
            
            // Subtle opacity shift to emphasize the stretch
            span.style.opacity = 1.2 - (stretch * 0.2);
        });

        requestAnimationFrame(animate);
    }

    animate();
}