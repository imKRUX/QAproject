describe("Responsive layout", () => {
     it("shows core content on mobile", () => {
          cy.viewport("iphone-x");
          cy.visit("/");

          cy.contains("SkillHub").should("be.visible");
          cy.get("h1").should("be.visible");
     });

     it("shows core content on desktop", () => {
          cy.viewport(1280, 800);
          cy.visit("/");

          cy.get('[data-cy="workshop-card"]').should("have.length.at.least", 6);
          cy.contains("Hot & New").should("be.visible");
     });
});
