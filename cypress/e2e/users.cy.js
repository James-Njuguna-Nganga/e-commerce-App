/// <reference types="Cypress"/>

describe('E-commerce Application User Tests', () => {
  
  const user = {
    name: 'Jonathan Ndambuki',
    email: 'jonah@gmail.com',
    password: '1234'
  };

  beforeEach(() => {
    cy.visit('http://localhost:58830');
  });

  const registerUser = () => {
    cy.get('#register').invoke('show'); 
    cy.get('[data-cy="register-input-name"]').type(user.name);
    cy.get('[data-cy="register-input-email"]').type(user.email);
    cy.get('[data-cy="register-input-password"]').type(user.password);
    cy.get('[data-cy="register-btn-submit"]').click();
  };

  const loginUser = () => {
    cy.get('#login').invoke('show');
    cy.get('[data-cy="login-input-email"]').type(user.email);
    cy.get('[data-cy="login-input-password"]').type(user.password);
    cy.get('[data-cy="login-btn-submit"]').click();
  };

  it('Should register a new user', () => {
    registerUser();
    cy.get('#userPanel').should('be.visible');
  });

  it('Should log in an existing user', () => {
    registerUser(); 
    loginUser(); 
    cy.get('#userPanel').should('be.visible');
  });

  it('Should add items to the cart', () => {
    loginUser(); 
    cy.get('.btn-primary').contains('View Products').click();
    
    cy.get('.product-list button').first().click();
  
    cy.get('#cartItems').should('contain', 'product 4');
  });

  it('Should display a message after checking out', () => {
    loginUser(); 
    cy.get('.btn-primary').contains('View Products').click();
    
    cy.get('.product-list button').first().click(); 
    cy.get('#cart .btn-primary').contains('Checkout').click(); 
    

    cy.get('#checkoutDetails').should('contain', 'Thank you for shopping with us!');
  });
});
