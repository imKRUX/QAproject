describe("404 page", () => {
     it("shows custom not-found page for unknown routes", () => {
          // a 404 returns HTTP 404 — tell Cypress not to auto fail
          cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });

          cy.get('[data-cy="not-found"]').should("be.visible");
          cy.contains("404").should("be.visible");
          cy.contains("Page not found").should("be.visible");
     });

     it("can navigate home from the 404 page", () => {
          cy.visit("/nope", { failOnStatusCode: false });
          cy.contains("Back to Workshops").click();
          cy.url().should("eq", Cypress.config("baseUrl") + "/");
     });
});
