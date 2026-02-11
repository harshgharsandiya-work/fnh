// ========= NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById("navbar");
const logo = document.getElementById("logo");
const navItems = document.querySelectorAll(".nav-item-initial");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");

// logo paths
const LOGO_WHITE = "./res/header/fnh-logo-white.svg";
const LOGO_DARK = "./res/header/fnh-logo-red.svg";

// Active nav item on scroll
const sections = document.querySelectorAll("section");
window.addEventListener("scroll", () => {
    const isScrolled = window.scrollY > 100;

    if (isScrolled) {
        navbar.classList.add("bg-white", "shadow-md", "scrolled"); // Added "scrolled" class
        navbar.classList.remove("bg-transparent", "backdrop-blur-md");

        logo.src = LOGO_DARK;

        navItems.forEach((item) => {
            item.classList.remove("nav-item-initial", "text-white");
            item.classList.add("nav-item-scrolled", "text-gray-700");
        });
    } else {
        navbar.classList.remove("bg-white", "shadow-md", "scrolled"); // Remove "scrolled" class
        navbar.classList.add("bg-transparent", "backdrop-blur-md");

        logo.src = LOGO_WHITE;

        navItems.forEach((item) => {
            item.classList.add("nav-item-initial", "text-white");
            item.classList.remove("nav-item-scrolled", "text-gray-700");
        });
    }
});

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

// ============== REVIEW SLIDER =================
let swiper;

// Initialize Swiper
swiper = new Swiper(".testimonialSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        // Mobile
        640: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        // Tablet
        768: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        // Desktop - show exactly 4 cards
        1024: {
            slidesPerView: 4,
            spaceBetween: 24,
        },
        // Large Desktop
        1280: {
            slidesPerView: 4,
            spaceBetween: 28,
        },
    },
});

// Toggle review text function
function toggleReview(element) {
    const reviewText = element.closest(".review-text");

    if (reviewText.classList.contains("expanded")) {
        // Collapse
        reviewText.classList.remove("expanded");
        element.textContent = "See More";
    } else {
        // Expand
        reviewText.classList.add("expanded");
        element.textContent = "See Less";
    }
}

let isViewingAll = false;

// Toggle between slider and grid view
function toggleAllReviews() {
    const slider = document.getElementById("testimonialSlider");
    const grid = document.getElementById("allReviewsGrid");
    const btnText = document.getElementById("viewMoreBtnText");

    if (!isViewingAll) {
        // Show all reviews in grid
        slider.classList.add("hidden");
        grid.classList.add("active");
        btnText.textContent = "View Less";

        // Stop autoplay
        if (swiper && swiper.autoplay) {
            swiper.autoplay.stop();
        }

        // Populate grid with all reviews
        populateAllReviews();
        isViewingAll = true;
    } else {
        // Show slider again
        slider.classList.remove("hidden");
        grid.classList.remove("active");
        btnText.textContent = "View More";

        // Start autoplay again
        if (swiper && swiper.autoplay) {
            swiper.autoplay.start();
        }

        isViewingAll = false;
    }
}

// Populate grid with all reviews
function populateAllReviews() {
    const grid = document.getElementById("allReviewsGrid");
    grid.innerHTML = "";

    allReviews.forEach((review) => {
        const reviewCard = createReviewCard(review);
        grid.innerHTML += reviewCard;
    });
}

// Create review card HTML
function createReviewCard(review) {
    const avatarHTML = review.image
        ? `<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-white shadow">
                        <img src="${review.image}" alt="${review.name}" class="w-full h-full object-cover" />
                       </div>`
        : `<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow bg-red-500 flex items-center justify-center text-white text-lg sm:text-xl font-semibold">${review.initial}</div>`;

    const starsHTML = Array(review.rating)
        .fill(
            '<img src="./res/testimonal/star.png" class="w-5 h-5 sm:w-6 sm:h-6" alt="Star" />',
        )
        .join("");

    return `
                    <div class="relative bg-white rounded-2xl px-3 sm:px-4 pt-10 sm:pt-12 pb-6 sm:pb-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300 mb-8">
                        <div class="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2">
                            ${avatarHTML}
                        </div>
                        <h4 class="mt-2 sm:mt-4 text-red-500 font-[Agatta] text-[16px] sm:text-lg">
                            ${review.name}
                        </h4>
                        <p class="review-text text-gray-900 text-[13px] sm:text-[14px] md:text-[15px] font-medium mt-2 sm:mt-3 px-1">
                            <span class="short-text">${review.shortText}</span>
                            <span class="full-text">${review.fullText}</span>
                            <span class="see-more-btn text-red-500 cursor-pointer hover:underline ml-1" onclick="toggleReview(this)">See More</span>
                        </p>
                        <div class="flex justify-center gap-1 my-3 sm:my-4">
                            ${starsHTML}
                        </div>
                    </div>
                `;
}

// ============== CHEF'S SPECIALS DYNAMIC CARDS ==============
function createChefSpecialCard(item) {
    return `
        <div class="swiper-slide">
            <div class="bg-white rounded-[20px] shadow-sm overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
                <div class="p-3 sm:p-4">
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        class="rounded-xl w-full h-[200px] sm:h-[250px] object-cover ${item.imagePosition}"
                    />
                </div>

                <div class="px-4 sm:px-5 pb-5 sm:pb-6">
                    <p class="font-semibold text-[15px] sm:text-[16px] mb-1">
                        ${item.name}
                    </p>
                </div>

                <!-- Decorative Corner -->
                <svg
                    class="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20"
                    viewBox="0 0 80 80"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M80 0 L80 80 L20 80 C30 70 60 40 80 0 Z"
                        fill="#DB3444"
                    />
                </svg>
            </div>
        </div>
    `;
}

// ---------- Chef's Special Swiper -----------

function populateChefSpecials() {
    const container = document.getElementById("chefSpecialCards");

    if (!container) {
        console.error("Chef Special Cards container not found");
        return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Create cards from data (duplicate for loop effect)
    const cardsHTML = chefSpecialData
        .concat(chefSpecialData) // Duplicate array for seamless loop
        .map((item) => createChefSpecialCard(item))
        .join("");

    // Insert cards into container
    container.innerHTML = cardsHTML;
}

// Populate chef specials on page load
document.addEventListener("DOMContentLoaded", function () {
    populateChefSpecials();
});

// ============== CHEF SPECIAL SLIDER =================
let chefSpecialSwiper;

// Initialize Chef Special Swiper
chefSpecialSwiper = new Swiper(".chefSpecialSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        // Mobile
        640: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        // Tablet
        768: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        // Desktop - show exactly 4 cards
        1024: {
            slidesPerView: 4,
            spaceBetween: 24,
        },
        // Large Desktop
        1280: {
            slidesPerView: 4,
            spaceBetween: 28,
        },
    },
});
