describe("Create a workshop", () => {
     beforeEach(() => {
          cy.login("tester@example.com");
          cy.visit("/workspace");
     });

     it("submits the form and shows success", () => {
          cy.intercept("POST", "/api/workshops", {
               statusCode: 201,
               body: { id: "ws-test", title: "Cypress Test Class" },
          }).as("createWorkshop");

          // fill the form
          cy.get('input[placeholder*="Hand-Pulled"]').type(
               "Cypress Test Class",
          );
          cy.get("select").eq(0).select("dishes");
          cy.get("select").eq(1).select("beginner");
          cy.get('input[type="date"]').type("2026-08-01");
          cy.get('input[type="time"]').type("10:30");
          cy.get('input[type="number"]').type("8");
          cy.get("textarea").type("A class created by a Cypress test.");
          cy.contains("button", "Schedule Class").click();

          cy.wait("@createWorkshop").its("request.body").should("include", {
               title: "Cypress Test Class",
               category: "dishes",
          });

          // the UI should show the success state
          cy.contains("Workshop Scheduled!").should("be.visible");
     });
});
