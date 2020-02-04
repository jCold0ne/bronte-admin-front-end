//test a post creates a post
//test editing a post and updating
//test deleting post

// P A S S E D
describe("create post button on post route", () => {
  it("create post button pops up form", () => {
    cy.visit("http://localhost:3000/dashboard/posts")
      .get(".MuiButton-containedPrimary") //find create post button
      .click() //click
      .get(".MuiFormControl-root"); //find form that pops up after click
  });
});
