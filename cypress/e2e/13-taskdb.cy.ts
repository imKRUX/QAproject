describe("Database tasks (cy.task)", () => {
     beforeEach(() => {
          cy.task("db:reset");
     });

     it("starts empty, then records a booking", () => {
          cy.task("db:bookingsCount").should("eq", 0);

          cy.login("tasker@example.com");
          cy.request("POST", "/api/bookings", { workshopId: "ws-3" })
               .its("status")
               .should("eq", 201);

          // Node confirms the booking was written to db.json
          cy.task("db:bookingsCount").should("eq", 1);
     });
});
