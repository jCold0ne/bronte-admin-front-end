describe("create image button on image route", () => {
  it("create image button pops up form", () => {
    cy.visit("http://localhost:3000/dashboard/images")
      .get(".MuiButton-containedPrimary") //find create post button
      .click() //click
      .get("form"); //find form that pops up after click
  });
});
