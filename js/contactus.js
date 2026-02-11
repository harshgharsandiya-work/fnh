const navbar = document.getElementById("navbar");
const logo = document.getElementById("logo");
const navItems = document.querySelectorAll(".nav-item-initial");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");

// Mobile menu toggle
const mobileMenu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("menu-icon-open");
const iconClose = document.getElementById("menu-icon-close");

mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = mobileMenu.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active", isOpen);

    iconOpen.classList.toggle("hidden", isOpen);
    iconClose.classList.toggle("hidden", !isOpen);
});

// Close mobile menu when clicking on a link
const mobileNavLinks = mobileMenu.querySelectorAll("a");
mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
    });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// ============== IMAGE MODE HANDLER ==============
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
}

function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    lightboxImg.src = "";
}

// Close when clicking outside image
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});
