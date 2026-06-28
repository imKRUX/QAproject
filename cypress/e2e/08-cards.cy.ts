describe("Workshop cards", () => {
     it("every card has a non-empty title", () => {
          cy.visit("/");

          cy.get('[data-cy="workshop-card"]').should("have.length.at.least", 6);

          // loop over each card
          cy.get('[data-cy="workshop-card"]').each(($card) => {
               cy.wrap($card).find("h3").should("not.be.empty");
          });
     });
});
