// / <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

/**
 * Custom Cypress command to extract a numeric value from a text element.
 * @param {Cypress.Chainable<JQuery<HTMLElement>>} subject - The Cypress subject
 * @returns {Cypress.Chainable<number>} The extracted numeric value or -1 if not found
 */
Cypress.Commands.add('getNumericValue', { prevSubject: ['element'] }, (subject) => {
  return cy.wrap(subject).invoke('text').then((text: string) => {
    cy.log(`Extracted text for numeric value: ${text}`);
    const match = text.match(/(\d+)/);
    const numericValue = match ? parseFloat(match[1]) : -1;
    cy.log(`Numeric value extracted: ${numericValue}`);
    return cy.wrap(numericValue);
  });
});


declare namespace Cypress {
  interface Chainable<Subject = any> {
      getNumericValue(): Chainable<number>;
  }
}