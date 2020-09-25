const express = require('express');
const { v4 } = require('uuid');
const { isUuid } = require('uuidv4');

const app = express();
app.use(express.json());
/**
 * Metodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Cria uma informaçãono back-end
 * PUT/PATCH: alterar uma informação no backend
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identifica recursos (Atualizar/Deletar)
 * Request Body: Conteudo na hora de criar ou editar um recurso (json)
 */

/**
 * Middleware:
 * 
 * Interceptador de requisições que interromper totalmente ou alterar dados da requisição
 * 
 */
const projects = [];

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next()
};

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid project ID.'});
    }
    return next();


}

app.use(logRequests);
app.use('/projects/:id',validateProjectId);

app.get('/projects', (request, response) => {
    const { title } = request.query;
    const result = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(result);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    const project = { id: v4(), title, owner };
    projects.push(project);
    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'project not found' });
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;
    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'project not found' });
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('🚀back-end started!');
});