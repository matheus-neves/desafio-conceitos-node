const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', checkIdIsValid);

const repositories = [];

function checkIdIsValid(req, res, next) {

  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: 'Repository ID is invalid.'})
  }

  next();
}


app.get("/repositories", (req, res) => {

  return res.status(200).json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return res.status(201).json(repository);

});

app.put("/repositories/:id", (req, res) => {

  const { id } = req.params;
  const { title, url, techs } = req.body;

  const index = repositories.findIndex(repository => repository.id === id);

  if(index < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  const { likes } = repositories[index];

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[index] = repository;

  return res.status(200).json(repository);

});

app.delete("/repositories/:id", (req, res) => {
  
  const { id } = req.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if(index < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(index, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {

  const { id } = req.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if(index < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  const repository = repositories[index];
  let { likes } = repository;

  repositories[index] = {
    ...repository,
    likes: likes + 1
  }

  return res.status(200).json(repositories[index]);
});

module.exports = app;
