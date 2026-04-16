

const projectGrid = document.querySelector(".projects-grid");
const experienceList = document.querySelector("#experience .timeline");
const educationList = document.querySelector("#education .timeline");
const skillsWrapper = document.querySelector(".skills-wrapper");
const repoSpan = document.getElementById("repo-count");
const languageSelector = document.getElementById("language-selector");

async function updatePage() {
    const data = await initData();
    if (data) {
        translatePage(data);
        loadContent(data);
    }
}

languageSelector.addEventListener("change", updatePage);

document.addEventListener("DOMContentLoaded", async () => {
    updatePage();

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

    (data.projects || []).forEach(createProject);
    (data.skills || []).forEach(createSkill);
    (data.experience || []).forEach(createExperience);
    (data.education || []).forEach(createEducation);
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

function createProject(p) {
    const projectCard = document.createElement("article");
    projectCard.className = "project-card";

    const techStackSpans = (p.techStack || []).map((tech) => `<span>${tech}</span>`).join("");

    projectCard.innerHTML = `
        <div class="project-image-wrapper">
            <img class="project-image" src="${p.imgUrl}" alt="${p.title}">
        </div>
        <div class="project-content">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
        </div>
        <div class="project-footer">
            <div class="tech-stack">${techStackSpans}</div>
            <div class="btn-wrapper">
                <a href="${p.repoUrl || '#'}" class="btn-sm" target="_blank">${p.btnText || 'Ver mais'}</a>
            </div>
        </div>`;
    projectGrid.appendChild(projectCard);
}

function createExperience(e) {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.innerHTML = `
        <div class="timeline-date">${e.date}</div>
        <div class="timeline-content">
            <h3>${e.role}</h3>
            <h4>${e.company}</h4>
            <p>${e.description}</p>
        </div>`;
    experienceList.appendChild(timelineItem);
}

function createEducation(ed) {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.innerHTML = `
        <div class="timeline-date">${ed.date}</div>
        <div class="timeline-content">
            <h3>${ed.degree}</h3>
            <h4>${ed.institution}</h4>
            <p>${ed.description}</p>
        </div>`;
    educationList.appendChild(timelineItem);
}

function createSkill(skill) {
    const skillBlock = document.createElement("div");
    skillBlock.className = "skill-category";

    const itemsList = (skill.items || []).map((item) => `<li>${item}</li>`).join("");

    skillBlock.innerHTML = `
        <h3>${skill.category}</h3>
        <ul>${itemsList}</ul>`;
    skillsWrapper.appendChild(skillBlock);
}