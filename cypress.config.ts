import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";

require('dotenv').config()

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 60000,
    specPattern: "**/*.feature",
    video: false,
    screenshotOnRunFailure: false,
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    async setupNodeEvents(
        on: Cypress.PluginEvents,
        config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config);

      on(
          "file:preprocessor",
          createBundler({
            // @ts-ignore
            plugins: [createEsbuildPlugin(config)],
          })
      );
      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
  },
});
