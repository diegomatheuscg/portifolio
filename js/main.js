
const projectGrid = document.querySelector(".projects-grid");
const experienceList = document.querySelector("#experience .timeline");
const repoSpan = document.getElementById("repo-count");
const languageSelector = document.getElementById("language-selector");

document.addEventListener("DOMContentLoaded", async () => {

    const data = await initData();
    if (projects) {
        projectGrid.innerHTML = "";
        projects.forEach(p => createProject(p));
    }
    if (experiences) {
        experienceList.innerHTML = "";
        experiences.forEach(e => createExperience(e));
    }

    if (repoCount !== null) {
        repoSpan.textContent = repoCount;
    } else {
        repoSpan.style.display = 'none';
    }

});



async function fetchRepoCount() {
    try {
        const response = await fetch("https://api.github.com/users/diegomatheuscg");
        if (!response.ok) {
            throw new Error(`Erro de requisição do GitHub. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.public_repos;
    } catch (e) {
        console.error("Failed to fetch repo count:", e);
        return null;
    }
}

async function initData(){
    try{
        const response = await fetch("../assets/json/en.json");
        if(!response.ok){
            return null;
        }
        const data = await response.json();
        return data;
    }catch(e){
        console.error("Failed to fetch data: ", e);
        return null;
    }
}

function createProject(p) {
    const projectCard = document.createElement("article");
    projectCard.className = "project-card";

    const techStackSpans = (p.techStack || []).map(techStack => `<span>${techStack}</span>`).join('');

    projectCard.innerHTML =
        `<div class="project-image-wrapper">
            <img class="project-image" src="${p.imgUrl}" alt="${p.title}">
        </div>
        <div class="project-content">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
        </div>
        <div class="project-footer">
            <div class="tech-stack">
                ${techStackSpans}
            </div>
            <div class="btn-wrapper">
                <a href="${p.repoUrl || '#'}" class="btn-sm" target="_blank">${p.btnText || 'Ver mais'}</a>
            </div>
        </div>`
    projectGrid.appendChild(projectCard);
}

function createExperience(e) {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";

    timelineItem.innerHTML = `<div class="timeline-date">${e.timeline_date}</div>
                        <div class="timeline-content">
                            <h3>${e.title}</h3>
                            <h4>${e.company}</h4>
                            <p>${e.description}</p>
                        </div>`
    experienceList.appendChild(timelineItem);
}
