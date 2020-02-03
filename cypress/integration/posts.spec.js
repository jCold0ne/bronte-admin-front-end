//test a post creates a post
//test editing a post and updating
//test deleting post

// P A S S E D
describe("test that side nav buttons change endpoint", () => {
  it("nav buttons render corresponding endpoint", () => {
    cy.visit("http://localhost:3000/dashboard")
      .get(".MuiListItemText-root")
      .click({ multiple: true })
      .url();
  });
});
