const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

// Move dot instantly
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

// Smooth outline animation
function animateOutline() {
  outlineX += (mouseX - outlineX) * 0.1;
  outlineY += (mouseY - outlineY) * 0.1;

  outline.style.left = outlineX + "px";
  outline.style.top = outlineY + "px";

  requestAnimationFrame(animateOutline);
}

animateOutline();

// Hover effect on links & buttons
const hoverElements = document.querySelectorAll("a, button, .btn");

hoverElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    outline.classList.add("hover");
  });
  el.addEventListener("mouseleave", () => {
    outline.classList.remove("hover");
  });
});

// Click effect
window.addEventListener("mousedown", () => {
  dot.classList.add("click");
});

window.addEventListener("mouseup", () => {
  dot.classList.remove("click");
});
