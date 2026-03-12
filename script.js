/* ===============================
   1️⃣ Scroll Fade Effect
================================= */

// Select all elements with scroll-fade
const faders = document.querySelectorAll('.scroll-fade');

// Intersection Observer options
const appearOptions = {
  threshold: 0.2,                 // 20% visible before triggering
  rootMargin: "0px 0px -50px 0px"
};

// Observer function
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;  // skip if not visible
    entry.target.classList.add('show'); // add show class to trigger CSS
    observer.unobserve(entry.target);   // stop observing after first reveal
  });
}, appearOptions);

// Observe each fader
faders.forEach(fader => appearOnScroll.observe(fader));


/* ===============================
   2️⃣ Navbar / Hamburger Menu
================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});



/* ===============================
   3️⃣ Fetch JSON for Dynamic Content
================================= */
Promise.all([
  fetch("data.json").then(res => res.json()),
  fetch("reviews.json").then(res => res.json())
])
.then(([data, reviews]) => {

  // ======================
  // Navbar
  // ======================
  document.getElementById("clinicName").textContent =
    data.clinic_name || "Dental Clinic";

  document.getElementById("callButton").href =
    "tel:" + (data.phone || "#");


  // ======================
  // Hero Section
  // ======================
  const heroSection = document.querySelector(".hero");

  heroSection.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
     url(${data.hero_img || ""})`;


  // ======================
  // Contact Section
  // ======================
  if (data.address) {
    document.getElementById("contactAddress").innerHTML =
      `<i class="ri-map-pin-line"></i> ${data.address}`;
  }

  if (data.phone) {
    document.getElementById("contactPhone").innerHTML =
      `<i class="ri-phone-line"></i> ${data.phone}`;
  }


  // ======================
  // Map
  // ======================
  if (data.map_url) {
    const mapFrame = document.getElementById("mapFrame");
    if (mapFrame) mapFrame.src = data.map_url;
  }


  // ======================
  // Testimonials
  // ======================
  const container = document.getElementById("testimonialsContainer");

  reviews.forEach(review => {

    const card = document.createElement("div");
    card.classList.add("testimonial-card", "scroll-fade");

    let stars = "";
    for (let i = 0; i < review.rating; i++) {
      stars += `<i class="ri-star-fill"></i>`;
    }

    card.innerHTML = `
      <img src="${review.image}" alt="${review.name}">
      <h4>${review.name}</h4>
      <p>${review.review}</p>
      <div class="stars">${stars}</div>
    `;

    container.appendChild(card);

    if (typeof appearOnScroll !== "undefined") {
      appearOnScroll.observe(card);
    }

  });


  // ======================
  // Footer
  // ======================
  document.getElementById("footerClinicName").textContent =
    data.clinic_name;

  document.getElementById("footerPhone").innerHTML =
    `<i class="ri-phone-line"></i> ${data.phone}`;

  document.getElementById("footerAddress").innerHTML =
    `<i class="ri-map-pin-line"></i> ${data.address}`;

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

})
.catch(err => console.error("Error loading JSON:", err));
