module.exports = function(plop) {
  plop.setGenerator("component", {
    description: "A presentational React component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the component's name?",
        validate(value) {
          return value.length ? true : "Name cannot be blank";
        }
      }
    ],
    actions: [
      {type: "add", path: "src/components/{{dashCase name}}/index.js", templateFile: "templates/component.hbs"},
      {type: "add", path: "src/components/{{dashCase name}}/style.css", templateFile: "templates/component-style.hbs"}
    ]
  });
};
