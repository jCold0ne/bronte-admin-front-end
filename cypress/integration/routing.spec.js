// P A S S E D
describe("check all endpoints are accessable", () => {
  it("visit current routes", () => {
    cy.visit("http://localhost:3000")
      .visit("http://localhost:3000/dashboard/")
      .visit("http://localhost:3000/dashboard/images")
      .visit("http://localhost:3000/dashboard/posts");
  });
});
// P A S S E D
describe("test that side nav buttons change endpoint", () => {
  it("nav buttons render corresponding endpoint", () => {
    cy.visit("http://localhost:3000/dashboard")
      .get(".MuiListItemText-root")
      .click({ multiple: true })
      .url();
  });
});
