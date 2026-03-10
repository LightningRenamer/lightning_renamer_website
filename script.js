const LANG_KEY = "lightning_renamer_lang";
const THEME_KEY = "lightning_renamer_theme";
const HERO_PREVIEW_KEY = "lightning_renamer_hero_preview";

function applyLanguage(lang) {
    const root = document.documentElement;
    const next = lang === "en" ? "en" : "zh";

    root.classList.toggle("tag-en", next === "en");
    root.classList.toggle("tag-zh", next === "zh");

    try {
        localStorage.setItem(LANG_KEY, next);
    } catch (error) {
        console.warn("Unable to save language preference.", error);
    }
}

function toggleLanguage() {
    const current = document.documentElement.classList.contains("tag-en") ? "en" : "zh";
    applyLanguage(current === "en" ? "zh" : "en");
}

function bindLanguageToggle() {
    document.querySelectorAll("[data-toggle-language]").forEach((button) => {
        button.addEventListener("click", toggleLanguage);
    });
}

function getStoredHeroPreview() {
    try {
        const value = localStorage.getItem(HERO_PREVIEW_KEY);
        if (value === "light" || value === "dark") {
            return value;
        }
    } catch (error) {
        console.warn("Unable to read hero preview preference.", error);
    }

    return null;
}

function updateHeroPreviewControls(preview) {
    const nextPreview = preview === "dark" ? "light" : "dark";
    const ariaLabel = nextPreview === "dark" ? "Switch preview to dark screenshot" : "Switch preview to light screenshot";

    document.querySelectorAll("[data-toggle-hero-preview]").forEach((button) => {
        button.classList.toggle("is-active", preview === "dark");
        button.setAttribute("aria-label", ariaLabel);
        button.setAttribute("title", ariaLabel);
        button.setAttribute("aria-pressed", String(preview === "dark"));
    });
}

function applyHeroPreview(preview, options = {}) {
    const { persist = true } = options;
    const nextPreview = preview === "dark" ? "dark" : "light";

    document.documentElement.dataset.heroPreview = nextPreview;
    updateHeroPreviewControls(nextPreview);

    if (!persist) {
        return;
    }

    try {
        localStorage.setItem(HERO_PREVIEW_KEY, nextPreview);
    } catch (error) {
        console.warn("Unable to save hero preview preference.", error);
    }
}

function toggleHeroPreview() {
    const currentPreview = document.documentElement.dataset.heroPreview === "dark" ? "dark" : "light";
    applyHeroPreview(currentPreview === "dark" ? "light" : "dark");
}

function bindHeroPreviewToggle() {
    document.querySelectorAll("[data-toggle-hero-preview]").forEach((button) => {
        button.addEventListener("click", toggleHeroPreview);
    });
}

function getStoredTheme() {
    try {
        const value = localStorage.getItem(THEME_KEY);
        if (value === "light" || value === "dark") {
            return value;
        }
    } catch (error) {
        console.warn("Unable to read theme preference.", error);
    }

    return null;
}

function getPreferredTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
        return storedTheme;
    }

    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeControls(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const icon = theme === "dark" ? "☾" : "☀︎";
    const zhLabel = theme === "dark" ? "深色" : "浅色";
    const enLabel = theme === "dark" ? "Dark" : "Light";
    const ariaLabel = nextTheme === "dark" ? "Switch to dark theme" : "Switch to light theme";

    document.querySelectorAll("[data-toggle-theme]").forEach((button) => {
        button.classList.toggle("is-active", theme === "dark");
        button.setAttribute("aria-label", ariaLabel);
        button.setAttribute("title", ariaLabel);
        button.setAttribute("aria-pressed", String(theme === "dark"));
    });

    document.querySelectorAll("[data-theme-icon]").forEach((node) => {
        node.textContent = icon;
    });

    document.querySelectorAll("[data-theme-label-zh]").forEach((node) => {
        node.textContent = zhLabel;
    });

    document.querySelectorAll("[data-theme-label-en]").forEach((node) => {
        node.textContent = enLabel;
    });
}

function applyTheme(theme, options = {}) {
    const { persist = true } = options;
    const nextTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    updateThemeControls(nextTheme);

    if (!persist) {
        return;
    }

    try {
        localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
        console.warn("Unable to save theme preference.", error);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
}

function bindThemeToggle() {
    document.querySelectorAll("[data-toggle-theme]").forEach((button) => {
        button.addEventListener("click", toggleTheme);
    });
}

function activateTab(targetId) {
    const panes = document.querySelectorAll("[data-tab-pane]");
    const buttons = document.querySelectorAll("[data-tab-target]");

    panes.forEach((pane) => {
        const isActive = pane.dataset.tabPane === targetId;
        pane.classList.toggle("is-active", isActive);
    });

    buttons.forEach((button) => {
        const isActive = button.dataset.tabTarget === targetId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
        button.setAttribute("tabindex", isActive ? "0" : "-1");
    });
}

function bindTabs() {
    const buttons = document.querySelectorAll("[data-tab-target]");
    if (!buttons.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => activateTab(button.dataset.tabTarget));
    });
}

function bindCarousel() {
    const carousels = document.querySelectorAll('.carousel-stage');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const dots = Array.from(carousel.querySelectorAll('.carousel-indicator'));
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));

        if (!track || dots.length === 0 || slides.length === 0) return;

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const currentSlide = track.querySelector('.carousel-slide.is-active') || slides[0];
                const currentDot = carousel.querySelector('.carousel-indicator.is-active') || dots[0];

                if (currentSlide) currentSlide.classList.remove('is-active');
                if (currentDot) currentDot.classList.remove('is-active');

                slides[index].classList.add('is-active');
                dots[index].classList.add('is-active');

                track.style.transform = `translateX(-${index * 100}%)`;
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let savedLanguage = "zh";
    const theme = document.documentElement.dataset.theme || getPreferredTheme();
    const heroPreview = document.documentElement.dataset.heroPreview || getStoredHeroPreview() || theme;

    try {
        const localValue = localStorage.getItem(LANG_KEY);
        if (localValue === "en" || localValue === "zh") {
            savedLanguage = localValue;
        }
    } catch (error) {
        console.warn("Unable to read language preference.", error);
    }

    applyTheme(theme, { persist: false });
    applyHeroPreview(heroPreview, { persist: false });
    applyLanguage(savedLanguage);
    bindLanguageToggle();
    bindThemeToggle();
    bindHeroPreviewToggle();
    bindTabs();
    bindCarousel();

    const firstTab = document.querySelector("[data-tab-target].is-active")?.dataset.tabTarget
        || document.querySelector("[data-tab-target]")?.dataset.tabTarget;

    if (firstTab) {
        activateTab(firstTab);
    }
});
