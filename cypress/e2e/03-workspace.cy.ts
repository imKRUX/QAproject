describe("Workspace (protected)", () => {
     it("redirects to login when NOT logged in", () => {
          cy.visit("/workspace");
          cy.url().should("include", "/login");
     });

     it("opens workspace when logged in", () => {
          cy.login("tester@example.com"); // custom command
          cy.visit("/workspace");

          cy.url().should("include", "/workspace"); // not redirected
          cy.contains("Studio Workspace").should("be.visible");
          cy.contains("Host Workshop Portal").should("be.visible");
     });
});
