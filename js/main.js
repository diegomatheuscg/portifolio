import { createProject, createSkill, createEducation, createExperience } from "./utils.js";
const projectGrid = document.querySelector(".projects-grid");
const experienceList = document.querySelector("#experience .timeline");
const educationList = document.querySelector("#education .timeline");
const skillsWrapper = document.querySelector(".skills-wrapper");
const repoSpan = document.getElementById("repo-count");
const languageSelector = document.getElementById("language-selector");

function updateLanguageSelectorFlag() {
    languageSelector.dataset.lang = languageSelector.value;
}

async function updatePage() {
    updateLanguageSelectorFlag();
    const data = await initData();
    if (data) {
        translatePage(data);
        loadContent(data);
    }
}

languageSelector.addEventListener("change", updatePage);

document.addEventListener("DOMContentLoaded", async () => {
    await updatePage();

    const repoCount = await fetchRepoCount();
    if (repoCount !== null) {
        repoSpan.textContent = repoCount;
    } else {
        repoSpan.style.display = "none";
    }
});

function loadContent(data) {
    projectGrid.innerHTML = "";
    experienceList.innerHTML = "";
    educationList.innerHTML = "";
    skillsWrapper.innerHTML = "";

    (data.projects || []).forEach((project) => createProject(project, projectGrid));
    (data.skills || []).forEach((skill) => createSkill(skill, skillsWrapper));
    (data.experience || []).forEach((experience) => createExperience(experience, experienceList));
    (data.education || []).forEach((education) => createEducation(education, educationList));
}

async function fetchRepoCount() {
    try {
        const response = await fetch("https://api.github.com/users/diegomatheuscg");
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        return data.public_repos;
    } catch (e) {
        console.error("Failed to fetch repo count:", e);
        return null;
    }
}

async function initData() {
    try {
        const source = languageSelector.value === "en-us" ? "./assets/json/en.json" : "./assets/json/pt.json";
        const response = await fetch(source);
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error("Failed to fetch data:", e);
        return null;
    }
}

function translatePage(data) {
    const textMap = document.querySelectorAll("[data-i18n], [data-i18n-placeholder]");

    textMap.forEach((element) => {
        if (element.dataset.i18n) {
            const key = element.dataset.i18n;
            const translation = key
                .split('.')
                .reduce((obj, part) => (obj ? obj[part] : null), data);
            if (translation) element.textContent = translation;
        }

        if (element.dataset.i18nPlaceholder) {
            const key = element.dataset.i18nPlaceholder;
            const translation = key
                .split('.')
                .reduce((obj, part) => (obj ? obj[part] : null), data);
            if (translation) element.placeholder = translation;
        }
    });
}

