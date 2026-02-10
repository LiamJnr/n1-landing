export function counterAnimation(){
    const counters = document.querySelectorAll('.metric-value');

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function animateCounter(el, duration = 1600) {
    const target = parseInt(el.textContent.replace(/\D/g, ''), 10);

    console.log(target);

    let start = null;

    function frame(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);

        const eased = easeOutCubic(progress);
        const current = Math.floor(target * eased);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            el.textContent = target;
        }
    }

        requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target); // run once
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));

}

export function textSlideReveal(){
    const text = document.querySelector('.visionary-cntnr p');

    function splitText(el) {
        const content = el.textContent;
        el.textContent = '';

        [...content].forEach(char => {
            const outer = document.createElement('span');
            outer.className = 'char';

            const inner = document.createElement('span');
            inner.textContent = char === ' ' ? '\u00A0' : char;

            outer.appendChild(inner);
            el.appendChild(outer);
        });
    }

    splitText(text);

    const chars = text.querySelectorAll('.char');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            chars.forEach((char, i) => {
                setTimeout(() => {
                    char.classList.add('reveal');
                }, i * 25); // 🔥 stagger speed here
            });

            observer.disconnect();
        });
    }, { threshold: 0.6 });

    observer.observe(text);

}

export function parallaxScroll(){
    const container = document.querySelector('.pain-sliders__cntnr');

    const sliders = {
        top: document.querySelector('.pain-slider__top'),
        middle: document.querySelector('.pain-slider__middle'),
        bottom: document.querySelector('.pain-slider__bottom')
    };

    function clamp(v, min, max) {
        return Math.max(min, Math.min(v, max));
    }

    function animate() {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;

        // progress 0 → 1 while section is on screen
        const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);

        const distance = 180; // 🔥 adjust how far they slide

        sliders.top.style.transform = `translateX(${ -distance * progress }px)`;

        sliders.middle.style.transform = `translateX(${ distance * progress }px)`;

        sliders.bottom.style.transform = `translateX(${ -distance * progress }px)`;
    }

    window.addEventListener('scroll', animate);
    window.addEventListener('resize', animate);
    animate();

}