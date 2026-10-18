document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hambuger");
  const navMenu = document.querySelector(".navRightContainer");

  //   console.log("Hamburger:", hamburger);
  //   console.log("Nav Menu:", navMenu);

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  } else {
    console.log("Hamburger or navMenu not found");
  }
});

//
document.addEventListener("DOMContentLoaded", function () {
  const options = {
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe specific elements
  const elementsToObserve = document.querySelectorAll(".h1, .p");
  elementsToObserve.forEach((el) => observer.observe(el));
});
