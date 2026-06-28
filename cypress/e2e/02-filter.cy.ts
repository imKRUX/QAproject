describe("Category filter", () => {
     it("filters workshops by category via URL", () => {
          cy.visit("/");

          cy.contains("button", "Dishes").click();

          cy.url().should("include", "/?category=dishes");

          cy.contains("Sourdough Ramen").should("be.visible");
     });

     it("shows all workshops by default", () => {
          cy.visit("/");
          cy.get("h3").should("have.length.at.least", 6);
     });
});
