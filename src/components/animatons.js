// counter animation
export function counterAnimation() {
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

// pain slider parallax animation
export function parallaxScroll() {
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

        sliders.top.style.transform = `translateX(${-distance * progress}px)`;

        sliders.middle.style.transform = `translateX(${distance * progress}px)`;

        sliders.bottom.style.transform = `translateX(${-distance * progress}px)`;
    }

    window.addEventListener('scroll', animate);
    window.addEventListener('resize', animate);
    animate();

}

// rect text reveal animation
export function rectTextReveal() {
    const paragraphs = document.querySelectorAll('.rectrev-paragraph');

    paragraphs.forEach(para => {
        const text = para.textContent;

        // regex that matches just one word
        const words = text.match(/\S+/g);

        // map words to span wrapped words
        const spanWrappedWords = words.map(word => `<span class="word">${word}</span>`).join(' ');

        // set the innerHTML of para to spanWrappedWords
        para.innerHTML = spanWrappedWords;
    });

    const wrapper = document.querySelector('.rect-text__wrapper');
    const spanWords = document.querySelectorAll('.word');

    if (!wrapper || spanWords.length === 0) return;

    let isVisible = false;

    const updateScrollEffect = () => {
        if (!isVisible) return;

        const section = wrapper.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Calculate progress (0 to 1)
        const progress = Math.min(Math.max((viewHeight - section.top) / section.height, 0), 1);
        const totalSpans = spanWords.length;

        // 1. Block Entrance Logic (0 to 1 progress)
        const showCount = Math.floor(progress * totalSpans);

        // 2. Text Reveal Logic (Starts at 0.5 progress)
        const revealCount = progress >= 0.5
            ? Math.floor((progress - 0.5) * 2 * totalSpans)
            : 0;

        spanWords.forEach((span, index) => {
            // Toggle blocks
            span.classList.toggle('block-in', index < showCount);
            // Toggle text reveal
            span.classList.toggle('reveal-text', index < revealCount);
        });

        // Request next frame
        requestAnimationFrame(updateScrollEffect);
    };

    // Intersection Observer to toggle the rAF loop
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                requestAnimationFrame(updateScrollEffect);
            }
        });
    }, { threshold: [0, 0.1, 0.5, 1.0] });

    observer.observe(wrapper);
}
