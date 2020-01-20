module.exports = function(plop) {
  // create your generators here
  plop.setGenerator("controller", {
    description: "application controller logic",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "controller name please",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{name}}.ts",
        templateFile: "plop-templates/controller.hbs",
      },
    ],
  });
};
