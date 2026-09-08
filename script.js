document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("site-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    function updateThemeToggle() {
        if (!themeToggle) return;
        const isLight = document.body.classList.contains("light-theme");
        themeToggle.setAttribute("aria-pressed", isLight.toString());
        themeToggle.setAttribute("aria-label", isLight ? "Přepnout tmavý režim" : "Přepnout světlý režim");
        themeToggle.querySelector(".theme-label").textContent = isLight ? "☾/☀" : "☀/☾";
        themeToggle.querySelector(".theme-icon").textContent = isLight ? "" : "";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("light-theme");
            localStorage.setItem("site-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
            updateThemeToggle();
        });
        updateThemeToggle();
    }

    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("navLinks");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", function () {
            hamburgerBtn.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                hamburgerBtn.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    document.querySelectorAll(".accordion-header").forEach((header) => {
        header.addEventListener("click", function () {
            const currentItem = this.parentElement;
            document.querySelectorAll(".accordion-item").forEach((item) => {
                if (item !== currentItem) item.classList.remove("active");
            });
            currentItem.classList.toggle("active");
        });
    });

    // Datum a čas voleb upravujte pouze na tomto řádku.
    // Formát: YYYY-MM-DDTHH:mm:ss+02:00 (časové pásmo České republiky).
    const ELECTION_DATE = "2026-10-09T14:00:00+02:00";
    const targetDate = new Date(ELECTION_DATE);

    if (Number.isNaN(targetDate.getTime())) {
        throw new Error("ELECTION_DATE má neplatný formát.");
    }

    function updateCountdown() {
        const difference = targetDate.getTime() - Date.now();
        const remainingTime = Math.max(0, difference);

        const values = {
            days: Math.floor(remainingTime / 86400000),
            hours: Math.floor((remainingTime % 86400000) / 3600000),
            minutes: Math.floor((remainingTime % 3600000) / 60000),
            seconds: Math.floor((remainingTime % 60000) / 1000)
        };

        Object.entries(values).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value.toString().padStart(2, "0");
        });
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    const statNumbers = document.querySelectorAll(".stat-number");
    let statsAnimated = false;

    function animateStats() {
        const statsSection = document.getElementById("vysledky");
        if (!statsSection || statsAnimated || statsSection.getBoundingClientRect().top >= window.innerHeight / 1.3) return;

        statsAnimated = true;
        statNumbers.forEach((number) => {
            const target = Number(number.dataset.target);
            let count = 0;
            const step = Math.max(1, target / 30);

            function updateNumber() {
                count += step;
                number.textContent = Math.min(Math.ceil(count), target).toString();
                if (count < target) setTimeout(updateNumber, 40);
            }

            updateNumber();
        });
    }

    window.addEventListener("scroll", animateStats);
    animateStats();

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            formStatus.textContent = "Děkujeme za váš podnět! Zprávu jsme přijali.";
            contactForm.reset();
            setTimeout(() => {
                formStatus.textContent = "";
            }, 4000);
        });
    }

    const candidateCards = document.querySelectorAll(".candidate-card");
    candidateCards.forEach((card) => {
        const toggleButton = card.querySelector(".candidate-toggle-btn");
        const icon = card.querySelector(".toggle-icon");
        if (!toggleButton || !icon) return;

        toggleButton.addEventListener("click", function () {
            candidateCards.forEach((otherCard) => {
                if (otherCard !== card) {
                    otherCard.classList.remove("active");
                    const otherIcon = otherCard.querySelector(".toggle-icon");
                    if (otherIcon) otherIcon.textContent = "+";
                }
            });

            card.classList.toggle("active");
            icon.textContent = card.classList.contains("active") ? "-" : "+";
        });
    });
});
