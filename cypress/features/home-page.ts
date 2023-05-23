// cypress/e2e/home-page.ts
import {When, Then, Given} from "@badeball/cypress-cucumber-preprocessor";

export const urls: { [key: string]: string } = {
    "home": "http://localhost:3000/",
};

export const element: { [key: string]: string } = {
    "sourceLangTitle": "#sourceLangTitle > .justify-between > .p-2"
}
Given("the {string} page", (value: string) => {
    cy.visit(urls[value]);
});

Then("I should see {string}", (value: string) => {
    cy.get(element[value]).should("have.text", "Langue choisie");
});
