const projectGrid = document.querySelector(".projects-grid");

projectGrid.innerHTML = "";


let projects = await fetchProjectsData();
cadastrarTodosProjetos(projects);


function cadastrarTodosProjetos(projects) {

    projects.forEach((p) => {
        cadastrarProjeto(p);
    });
}

function cadastrarProjeto(project) {

    const cardProject = document.createElement("article");
    cardProject.className = "project-card";

    const techStackSpans = (project.techStack || []).
        map(tech => `<span>${tech}</span>`).join('');

    cardProject.innerHTML = `
        <div class="project-image-wrapper">
            <img class="project-image" src="${project.imgUrl}" alt="${project.title}">
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        </div>
        <div class="project-footer">
            <div class="tech-stack">
                ${techStackSpans}
            </div>
            <div class="btn-wrapper">
                <a href="${project.repoUrl || '#'}" class="btn-sm" target="_blank">Ver repositório</a>
            </div>
        </div>`;

    projectGrid.appendChild(cardProject);
}

async function fetchProjectsData() {
    try {
        const response = await fetch('./assets/json/projects.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Falha ao carregar os projetos da fonte de dados:", error);
        return [];
    }
}