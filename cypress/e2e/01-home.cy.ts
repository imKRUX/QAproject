describe("Home page", () => {
     it("loads the homepage", () => {
          cy.visit("/");
          cy.contains("Learn something new today.");
     });
});

it("shows the heading and workshop cards", () => {
     cy.visit("/");
     cy.get("h1").should("contain.text", "Learn something new today");
     cy.contains("SkillHub").should("be.visible");
     cy.get("h3").should("have.length.at.least", 6);
});
