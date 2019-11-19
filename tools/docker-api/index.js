let dockerHubAPI = require("docker-hub-api");
const username = process.env.DOCKER_HUB_USERNAME;
const password = process.env.DOCKER_HUB_PASSWORD;
const repository = "flusshygiene-postgres-api";
try {
  dockerHubAPI
    .login(username, password)
    .then(function(info) {
      // console.log(`My Docker Hub login token is '${info.token}'!`);
      dockerHubAPI.setLoginToken(info.token);
      const res = dockerHubAPI.tags(username, repository);
      res
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
} catch (error) {
  console.error(error);
}
