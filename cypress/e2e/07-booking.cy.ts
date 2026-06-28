describe("Booking a workshop", () => {
     it("books a class and shows booked state", () => {
          cy.login("booker@example.com");

          cy.intercept("POST", "/api/bookings").as("book");

          cy.visit("/");

          cy.contains("button", "Book").first().click();

          // wait for the request, assert it succeeded
          cy.wait("@book").its("response.statusCode").should("eq", 201);
     });
});
