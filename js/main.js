

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
    const textMap = {
        "nav.about": data.nav.about,
        "nav.projects": data.nav.projects,
        "nav.skills": data.nav.skills,
        "nav.experience": data.nav.experience,
        "nav.education": data.nav.education,
        "hero.greeting": data.hero.greeting,
        "hero.title": data.hero.title,
        "hero.subtitle": data.hero.subtitle,
        "hero.cta_contact": data.hero.cta_contact,
        "hero.cta_github": data.hero.cta_github,
        "sections.projects_title": data.sections.projects_title,
        "sections.skills_title": data.sections.skills_title,
        "sections.experience_title": data.sections.experience_title,
        "sections.education_title": data.sections.education_title,
        "sections.contact_title": data.sections.contact_title,
        "contact.subtitle": data.contact.subtitle,
        "contact.description": data.contact.description,
        "contact.form_btn": data.contact.form_btn,
        "footer.text": data.footer.text,
    };
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (textMap[key]) element.textContent = textMap[key];
    });

    const placeholderMap = {
        "contact.form_name": data.contact.form_name,
        "contact.form_email": data.contact.form_email,
        "contact.form_message": data.contact.form_message,
    };

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        if (placeholderMap[key]) element.placeholder = placeholderMap[key];
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