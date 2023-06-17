const navMenu = document.getElementById("nav-menu"),
navToggle = document.getElementById("nav-toggle"),
navItem = document.querySelectorAll(".nav__item"),
header = document.getElementById("header");

// open and close menu
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

// close the menu when the user clicks the nav links
navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("nav__menu--open")) {
      navMenu.classList.remove("nav__menu--open");
    }
    changeIcon();
  });
});

// Change nav toggle icon
function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
  } else {
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }
}

// Downloading Resume
// document.getElementsByClassName("btn btn--primary").addEventListener("click", function() {
//   window.location.href = "../../assets/Calvin Mwangi.pdf"
// })


// Testimonial Slide

const testimonialSlide = new Swiper(".testimonial__wrapper", {
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  effect: "coverflow",
  grabCursor: true,
  slidesPerView: 1,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    520: {
      slidesPerView: "auto",
    },
  },
});

// ScrollReveal animations
const sr = ScrollReveal({
  duration: 2000,
  distance: "100px",
  delay: 400,
  reset: false,
});

sr.reveal(".hero__content, .about__content");
sr.reveal(".hero__img", { origin: "top" });

sr.reveal(
  ".hero__info-wrapper, .skills__content, .qualification__name, .qualification__item, .qualication__header, .education__content, .experience__content, .project__header_content, .project__content, .footer__content",
  {
    delay: 500,
    interval: 100,
  }
);

sr.reveal(".qualification__footer-text, .contact__content", {
  origin: "left",
});

sr.reveal(".qualification__footer .btn, .contact__btn", { origin: "right" });


// Wait for the page to load
window.addEventListener('DOMContentLoaded', (event) => {
  // Get the element with the "hero__title" class
  const titleElement = document.querySelector('.hero_top_title');

  // Set the desired text for the typing effect
  const text = "Hello, Welcome! I am...";

  // Set the initial text content of the element to an empty string
  titleElement.textContent = '';

  // Start the typing effect
  let index = 0;
  const typingEffect = setInterval(() => {
    titleElement.textContent += text[index];
    index++;
    
    // Check if the typing effect is finished
    if (index >= text.length) {
      clearInterval(typingEffect);
      titleElement.classList.add('custom-font');
    }
  }, 100); // Adjust the typing speed by changing the interval time (in milliseconds)
});


// Add fade-in class to timeline items when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  const timelineItems = document.querySelectorAll('.timeline .timeline-item');
  timelineItems.forEach(function(item) {
    item.classList.add('fade-in');
  });
});
