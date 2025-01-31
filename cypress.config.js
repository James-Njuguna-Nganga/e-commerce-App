const { defineConfig } = require("Cypress");

module.exports = defineConfig({
   time:3000,
  e2e: {
    baseUrl:"http://localhost:58830/",
    video:true,
    setupNodeEvents(on, config) {
    },
  },
});
