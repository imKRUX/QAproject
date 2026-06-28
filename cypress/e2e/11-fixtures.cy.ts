describe("Fixtures", () => {
     it("uses fixture data to fill the workshop form", () => {
          cy.login("fixture@example.com");

          cy.intercept("POST", "/api/workshops", {
               statusCode: 201,
               body: {},
          }).as("create");

          cy.fixture("newWorkshop").then((ws) => {
               cy.visit("/workspace");

               cy.get('input[placeholder*="Hand-Pulled"]').type(ws.title);
               cy.get("select").eq(0).select(ws.category);
               cy.get("select").eq(1).select(ws.level);
               cy.get('input[type="date"]').type(ws.date);
               cy.get('input[type="time"]').type(ws.time);
               cy.get('input[type="number"]').type(ws.seats);
               cy.get("textarea").type(ws.description);

               cy.contains("button", "Schedule Class").click();

               cy.wait("@create").its("request.body").should("include", {
                    title: ws.title,
                    category: ws.category,
               });
          });
     });
});
