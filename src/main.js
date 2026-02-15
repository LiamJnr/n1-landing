import { counterAnimation, parallaxScroll, rectTextReveal } from "./components/animatons.js";
import { liquidShader } from "./components/liquidShader.js";

document.addEventListener('DOMContentLoaded', () => {

    // liquid shader
    liquidShader();

    // counter Animation
    counterAnimation();

    // parallax scroll
    parallaxScroll();

    // rect text reveal scroll effect
    rectTextReveal();
})