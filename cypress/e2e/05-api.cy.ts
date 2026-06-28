describe("Workshops API", () => {
     it("GET /api/workshops returns the workshop list", () => {
          cy.request("GET", "/api/workshops").then((response) => {
               // status code check
               expect(response.status).to.eq(200);

               expect(response.body).to.be.an("array");

               expect(response.body.length).to.be.at.least(6);

               expect(response.body[0]).to.have.all.keys(
                    "id",
                    "title",
                    "description",
                    "category",
                    "duration",
                    "hostId",
                    "date",
                    "time",
                    "seats",
                    "bookedSeats",
                    "imageUrl",
               );
          });
     });

     it("rejects booking when not logged in", () => {
          cy.request({
               method: "POST",
               url: "/api/bookings",
               body: { workshopId: "ws-1" },
               failOnStatusCode: false,
          }).then((response) => {
               expect(response.status).to.eq(401);
          });
     });
});
