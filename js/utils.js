export function createProject(p, e) {
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
    e.appendChild(projectCard);
}

export function createExperience(experience, container) {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.innerHTML = `
        <div class="timeline-date">${experience.date}</div>
        <div class="timeline-content">
            <div class="timeline-body">
                <h3>${experience.role}</h3>
                <h4>${experience.company}</h4>
                <p>${experience.description}</p>
            </div>
            ${experience.imgUrl ? `<div class="timeline-image"><img src="${experience.imgUrl}" alt="${experience.company} logo"></div>` : ""}
        </div>`;
    container.appendChild(timelineItem);
}

export function createEducation(ed, e) {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.innerHTML = `
        <div class="timeline-date">${ed.date}</div>
        <div class="timeline-content">
            <div class="timeline-body">
                <h3>${ed.degree}</h3>
                <h4>${ed.institution}</h4>
                <p>${ed.description}</p>
            </div>
            ${ed.imgUrl ? `<div class="timeline-image"><img src="${ed.imgUrl}" alt="${ed.institution} logo"></div>` : ""}
        </div>`;
    e.appendChild(timelineItem);
}

export function createSkill(skill, e) {
    const skillBlock = document.createElement("div");
    skillBlock.className = "skill-category";

    const itemsList = (skill.items || []).map((item) => `<p>${item}</p>`).join("");

    skillBlock.innerHTML = `
        <h3>${skill.category}</h3>
        ${itemsList}`;
    e.appendChild(skillBlock);
}