/// <reference types="Cypress"/>

describe('Admin Panel Tests', () => {
  
    const adminCredentials = {
      email: 'jimmy@gmail.com',
      password: '12345'
    };
  
    beforeEach(() => {
      cy.visit('http://localhost:58830');
    });
  
    const loginAsAdmin = () => {
      cy.get('#adminLogin').invoke('show'); 
      cy.get('[data-cy=admin-input-email]').type(adminCredentials.email);
      cy.get('[data-cy=admin-input-password]').type(adminCredentials.password);
      cy.get('form#adminLoginForm').submit();
      cy.get('#adminPanel').should('be.visible'); 
    };
  
    it('Should log in as admin', () => {
      loginAsAdmin(); 
    });
  
    it('Should add a new product', () => {
      loginAsAdmin(); 
  
      cy.get('.btn-primary').contains('Add Product').click();
  
      cy.get('[data-cy=product-input-name]').type('Product 1');
      cy.get('[data-cy=product-input-price]').type('30000');
      
      cy.get('[data-cy=product-btn-submit]').click();
  
      cy.get('#productsList').should('contain', 'Product 1');
    });
  
    it('Should verify that the product was added', () => {
      loginAsAdmin(); 
  
      cy.get('.btn-primary').contains('View Products').click();
      
      cy.get('#productsList').should('contain', 'Product 1');
    });
  });
  