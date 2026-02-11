// ========== FORM VALIDATION & SUBMISSION ==========
const contactForm = document.getElementById("contactForm");
const successModal = document.getElementById("successModal");
const submitBtn = document.getElementById("submitBtn");

const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const message = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const messageError = document.getElementById("messageError");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

// ========== PHONE NUMBER SANITIZATION ==========
phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
});

// ========== REAL-TIME ERROR REMOVAL ==========

// Name - remove error as user types
name.addEventListener("input", function () {
    if (this.value.trim() !== "") {
        this.classList.remove("input-error");
        nameError.classList.add("hidden");
    }
});

// Email - remove error when valid email is entered
email.addEventListener("input", function () {
    const value = this.value.trim();
    if (value !== "" && emailRegex.test(value)) {
        this.classList.remove("input-error");
        emailError.classList.add("hidden");
    }
});

// Phone - remove error when valid phone is entered
phone.addEventListener("input", function () {
    // Sanitize to numbers only
    this.value = this.value.replace(/[^0-9]/g, "");

    // Remove error if valid
    if (phoneRegex.test(this.value.trim())) {
        this.classList.remove("input-error");
        phoneError.classList.add("hidden");
    }
});

// Message - remove error as user types
message.addEventListener("input", function () {
    if (this.value.trim() !== "") {
        this.classList.remove("input-error");
        messageError.classList.add("hidden");
    }
});

// ========== FORM SUBMISSION ==========
contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    // Reset all errors
    [name, email, phone, message].forEach((field) =>
        field.classList.remove("input-error"),
    );
    [nameError, emailError, phoneError, messageError].forEach((error) =>
        error.classList.add("hidden"),
    );

    // Validate Name
    if (name.value.trim() === "") {
        name.classList.add("input-error");
        nameError.classList.remove("hidden");
        isValid = false;
    }

    // Validate Email
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add("input-error");
        emailError.classList.remove("hidden");
        isValid = false;
    }

    // Validate Phone
    if (!phoneRegex.test(phone.value.trim())) {
        phone.classList.add("input-error");
        phoneError.classList.remove("hidden");
        isValid = false;
    }

    // Validate Message
    if (message.value.trim() === "") {
        message.classList.add("input-error");
        messageError.classList.remove("hidden");
        isValid = false;
    }

    // Stop if validation failed
    if (!isValid) return;

    // ========== DISABLE BUTTON & SHOW LOADING ==========
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-60", "cursor-not-allowed");
    submitBtn.innerHTML = `
        <svg class="animate-spin inline-block w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        SENDING...
    `;

    try {
        const response = await fetch("./public/contact.php", {
            method: "POST",
            body: new FormData(contactForm),
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get response text first for debugging
        const responseText = await response.text();

        // Try to parse JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Server response:", responseText);
            throw new Error("Invalid response from server. Please try again.");
        }

        // Handle success
        if (result.status === 1) {
            successModal.classList.remove("hidden");
            contactForm.reset();

            // Clear any error states
            [name, email, phone, message].forEach((field) =>
                field.classList.remove("input-error"),
            );
            [nameError, emailError, phoneError, messageError].forEach((error) =>
                error.classList.add("hidden"),
            );
        } else {
            // Show error message from server
            alert(
                result.message || "Failed to send message. Please try again.",
            );
        }
    } catch (error) {
        console.error("Form submission error:", error);
        alert(
            "Unable to send message. Please check your connection and try again.",
        );
    } finally {
        // ========== RE-ENABLE BUTTON ==========
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-60", "cursor-not-allowed");
        submitBtn.innerHTML = originalBtnText;
    }
});

// ========== MODAL CLOSE HANDLERS ==========
document.getElementById("closeModal").addEventListener("click", function () {
    successModal.classList.add("hidden");
});

document.getElementById("closeModalBtn").addEventListener("click", function () {
    successModal.classList.add("hidden");
});

// Close modal when clicking outside
successModal.addEventListener("click", function (e) {
    if (e.target === this) {
        this.classList.add("hidden");
    }
});
