describe("File upload (API)", () => {
     it("uploads an image to /api/upload", () => {
          cy.login("uploader@example.com");

          // read the fixture image as binary, build a real multipart upload
          cy.fixture("cover.png", "binary").then((img) => {
               const blob = Cypress.Blob.binaryStringToBlob(img, "image/png");
               const formData = new FormData();
               formData.append("file", blob, "cover.png");

               cy.request({
                    method: "POST",
                    url: "/api/upload",
                    body: formData,
               }).then((res) => {
                    expect(res.status).to.eq(201);
                    expect(res.body).to.have.property("url");
                    expect(res.body.url).to.include("/uploads/");
               });
          });
     });
});
