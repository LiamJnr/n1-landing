import { droopyEffect } from "./components/droopyText.js";
import { heroCanvas } from "./components/heroCanvas.js";

document.addEventListener('DOMContentLoaded', () =>{

    // hero animation
    heroCanvas();

    // jelly svg
    droopyEffect();
})