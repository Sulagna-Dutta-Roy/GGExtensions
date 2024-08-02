function validateEmail() {
  const emailInput = document.getElementById("emailInput");
  const validationResult = document.getElementById("validationResult");

  
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const email = emailInput.value;

  if (emailPattern.test(email)) {
      validationResult.innerHTML = "Valid email address";
      validationResult.style.color = "green";
  } else {
      validationResult.innerHTML = "Invalid email address";
      validationResult.style.color = "red";
  }
}
// select elements

const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const ul = document.querySelector(".nav__menu");

// sticky navigation using Intersection observer api for better performance

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("header__sticky");
  else nav.classList.remove("header__sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

// page navigation scroll smoothly with event delegation
const sections = document.querySelectorAll("section");

ul.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    sections.forEach((section) => (section.style.paddingTop = "100px"));
  }
});

// fading animation with better performance
const allSections = document.querySelectorAll(".section");

const fadingSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section__hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(fadingSection, {
  root: null,
  threshold: 0.12,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section__hidden");
});

// mobile menu
const mobileMenu = document.querySelector(".mobile__menu");
const overlay = document.querySelector(".navigation");

const showMenu = () => {
  overlay.classList.add("show__menu");
};

const hideMenu = () => {
  overlay.classList.remove("show__menu");
};

mobileMenu.addEventListener("click", showMenu);
overlay.addEventListener("click", hideMenu);