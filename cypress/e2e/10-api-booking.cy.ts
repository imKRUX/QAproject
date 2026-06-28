describe("Booking API (authenticated)", () => {
     it("creates then cancels a booking via the API", () => {
          cy.login("apitester@example.com");

          cy.request("POST", "/api/bookings", { workshopId: "ws-3" }).then(
               (res) => {
                    expect(res.status).to.eq(201);
                    expect(res.body).to.have.property("workshopId", "ws-3");
               },
          );

          cy.request("DELETE", "/api/bookings", { workshopId: "ws-3" }).then(
               (res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body).to.have.property("success", true);
               },
          );
     });
});
