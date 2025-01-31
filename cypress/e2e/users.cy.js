/// <reference types="Cypress"/>

describe('E-commerce Application Tests', () => {
  
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('Should register a new user', () => {
      cy.get('[data-cy="register-btn-submit"]').click();
      cy.get('[data-cy="register-input-name"]').type('jonathan ndambuki');
      cy.get('[data-cy="register-input-email"]').type('jonah@gmail.com');
      cy.get('[data-cy="register-input-password"]').type('1234');
      cy.get('[data-cy="register-btn-submit"]').click();
      
      cy.get('#userPanel').should('be.visible');
    });
  
    it('Should log in an existing user', () => {
      cy.get('[data-cy="register-btn-submit"]').click();
      cy.get('[data-cy="register-input-name"]').type('jonathan ndambuki');
      cy.get('[data-cy="register-input-email"]').type('jonah@gmail.com');
      cy.get('[data-cy="register-input-password"]').type('1234');
      cy.get('[data-cy="register-btn-submit"]').click();
  
      cy.get('[data-cy="login-input-email"]').type('jonah@gmail.com.com');
      cy.get('[data-cy="login-input-password"]').type('1234');
      cy.get('[data-cy="login-btn-submit"]').click();
  
      cy.get('#userPanel').should('be.visible');
    });
  
    it('Should add items to the cart', () => {
      cy.get('[data-cy="login-input-email"]').type('jonah@gmail.com');
      cy.get('[data-cy="login-input-password"]').type('1234');
      cy.get('[data-cy="login-btn-submit"]').click();
  
      cy.get('.btn-primary').contains('View Products').click();
      cy.get('.product-list button').first().click();
      
      cy.get('#cartItems').should('contain', 'product 4');
    });
    it('Should display a message after checking out', () => {

      cy.get('[data-cy=login-input-email]').type('jonah@gmail.com');
      cy.get('[data-cy=login-input-password]').type('1234');
      cy.get('[data-cy=login-btn-submit]').click();
  
      cy.get('.btn-primary').contains('View Products').click();
      cy.get('.product-list button').first().click(); 

      cy.get('#cart .btn-primary').contains('Checkout').click(); 
      cy.get('#checkoutDetails').should('contain', 'Thank you for shopping with us!');
    });
  });
  