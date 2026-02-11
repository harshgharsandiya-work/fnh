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

// ============== HOT FAVOURITES SLIDER =================
const testimonialSwiper = new Swiper(".testimonialSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // Pause when hovering
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        // Mobile (small)
        480: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        // Mobile (larger)
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
            loop: false, // Disable loop when all cards are visible
        },
        // Large Desktop
        1280: {
            slidesPerView: 4,
            spaceBetween: 28,
            loop: false,
        },
    },
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

// ============== DYNAMIC MENU FILTER FUNCTIONALITY ==============
document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.getElementById("menuItemsContainer");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Function to create menu item HTML
    function createMenuItem(item, category) {
        const hasDescription =
            item.description && item.description.trim() !== "";

        return `
        <div class="menu-item flex gap-4 sm:gap-5 items-${hasDescription ? "start" : "center"}"
             data-category="${category}">
             
            <div class="flex-shrink-0">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onclick="openLightbox(this.src)"
                    class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm cursor-pointer"
                />
            </div>

            <div class="flex-grow ${hasDescription ? "" : "flex items-center"}">
                <div>
                    <h3 class="text-lg sm:text-xl font-semibold text-[#151515]
                               ${hasDescription ? "mb-1 sm:mb-2" : ""}">
                        ${item.name}
                    </h3>

                    ${
                        hasDescription
                            ? `<p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                                   ${item.description}
                               </p>`
                            : ""
                    }
                </div>
            </div>
        </div>
    `;
    }

    // Function to render menu items for a specific category
    function renderMenuItems(category) {
        menuContainer.innerHTML = "";

        if (menuData[category]) {
            const items = menuData[category];
            items.forEach((item) => {
                menuContainer.innerHTML += createMenuItem(item, category);
            });

            const menuItems = menuContainer.querySelectorAll(".menu-item");
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.animation = "fadeInUp 0.4s ease-out";
                }, index * 50);
            });
        } else {
            menuContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No items available in this category.</p>
                </div>
            `;
        }
    }

    // Initial render - show pasta items by default
    renderMenuItems("pasta");

    // Filter button click handlers
    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");

            // Remove active class from all buttons - ONLY toggle 'active' class
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            // Add active class to clicked button - ONLY toggle 'active' class
            this.classList.add("active");

            // Render items for selected category
            renderMenuItems(category);
        });
    });
});

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

    // Create cards from data (NO duplication - Swiper handles looping)
    const cardsHTML = chefSpecialData
        .map((item) => createChefSpecialCard(item))
        .join("");

    // Insert cards into container
    container.innerHTML = cardsHTML;
}

// ============== CHEF SPECIAL SLIDER =================
let chefSpecialSwiper;

// Initialize EVERYTHING inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // 1. Populate the cards FIRST
    populateChefSpecials();

    // 2. THEN initialize the Swiper AFTER cards are populated
    chefSpecialSwiper = new Swiper(".chefSpecialSwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoHeight: true,
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
});
