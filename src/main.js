import { counterAnimation, parallaxScroll, textSlideReveal } from "./components/animatons.js";
import { heroCanvas } from "./components/heroCanvas.js";
import { liquidShader } from "./components/liquidShader.js";

document.addEventListener('DOMContentLoaded', () =>{

    // liquid shader
    liquidShader();

    // hero animation
    // heroCanvas();

    // counter Animation
    counterAnimation();

    // text slide reveal
    textSlideReveal();

    // parallax scroll
    parallaxScroll();
})