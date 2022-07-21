function setupVideoScroll() {
  let playBackSpeed = 800;

  let scHt = document.querySelector("#scroll-height-div");
  let vidEl = document.querySelector("#background-video");

  vidEl.addEventListener("loadedmetadata", function () {
    scHt.style.height = `${Math.floor(vidEl.duration) * playBackSpeed}px`;
  });

  function playOnScroll() {
    let frameNumber = window.pageYOffset / playBackSpeed;
    vidEl.currentTime = frameNumber;
    window.requestAnimationFrame(playOnScroll);
  }

  window.requestAnimationFrame(playOnScroll);
}

function setupScrollReader() {
  let overlayCards = document.querySelectorAll("[class*=overlay-card]");

  window.addEventListener("scroll", (event) => {
    let vidEl = document.querySelector("#background-video");
    let crTime = vidEl.currentTime;

    overlayCards.forEach((node) => {
      let timeStamp = [...node.classList].filter((cl) => cl.includes(":"))[0];
      if (!timeStamp) return;
      let stTime = timeStamp.split(":")[0];
      let edTime = timeStamp.split(":")[1];
      if (stTime < crTime && crTime < edTime) {
        node.classList.add("visible");
        node.classList.remove("hidden");
      } else {
        node.classList.remove("visible");
        node.classList.add("hidden");
      }
    });
  });
}

async function main() {
  setupVideoScroll();
  setupScrollReader();
}

window.addEventListener("load", (event) => {
  main();
});
