import { counterAnimation, parallaxScroll, textSlideReveal } from "./components/animatons.js";
import { heroCanvas } from "./components/heroCanvas.js";

document.addEventListener('DOMContentLoaded', () =>{

    // hero animation
    heroCanvas();

    // counter Animation
    counterAnimation();

    // text slide reveal
    textSlideReveal();

    // parallax scroll
    parallaxScroll();
})