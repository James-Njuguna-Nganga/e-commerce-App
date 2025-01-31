/**
 * @jest-environment jsdom
 */
const { JSDOM } = require('jsdom');

describe('E-commerce application tests', () => {
    let localStorageMock;
    let fetchMock;

    beforeEach(() => {
        // Mock localStorage
        localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };
        Object.defineProperty(global, 'localStorage', {
            value: localStorageMock,
        });

        // Mock fetch
        fetchMock = jest.fn();
        global.fetch = fetchMock;

        // Mock DOM structure
        const dom = new JSDOM(`
            <div id="login"></div>
            <div id="register"></div>
            <div id="adminLogin"></div>
            <div id="addProductForm"></div>
            <div id="productsList"></div>
            <div id="productsListUser"></div>
            <div id="cartItems"></div>
            <div id="checkoutDetails"></div>
            <div id="cart"></div>
        `);
        global.document = dom.window.document;
        global.window = dom.window;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('showRegisterForm displays the register form and hides login', () => {
        const loginDiv = document.getElementById('login');
        const registerDiv = document.getElementById('register');
        loginDiv.style.display = 'block';
        registerDiv.style.display = 'none';

        showRegisterForm();

        expect(loginDiv.style.display).toBe('none');
        expect(registerDiv.style.display).toBe('block');
    });

    test('showLoginForm displays the login form and hides register and adminLogin', () => {
        const loginDiv = document.getElementById('login');
        const registerDiv = document.getElementById('register');
        const adminLoginDiv = document.getElementById('adminLogin');
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'block';
        adminLoginDiv.style.display = 'block';

        showLoginForm();

        expect(loginDiv.style.display).toBe('block');
        expect(registerDiv.style.display).toBe('none');
        expect(adminLoginDiv.style.display).toBe('none');
    });

    test('showAddProductForm displays the add product form', () => {
        const addProductFormDiv = document.getElementById('addProductForm');
        addProductFormDiv.style.display = 'none';

        showAddProductForm();

        expect(addProductFormDiv.style.display).toBe('block');
    });

    test('addProductForm submits a valid product', async () => {
        const addProductForm = document.getElementById('addProductForm');
        const productName = document.createElement('input');
        productName.id = 'productName';
        productName.value = 'Sample Product';
        const productPrice = document.createElement('input');
        productPrice.id = 'productPrice';
        productPrice.value = '20.99';
        addProductForm.appendChild(productName);
        addProductForm.appendChild(productPrice);

        fetchMock.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ id: 1, name: 'Sample Product', price: '20.99' }),
        });

        const event = { preventDefault: jest.fn() };
        await addProductForm.dispatchEvent(new Event('submit', { bubbles: true }));
        await addProductForm.submit(event);

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Sample Product', price: '20.99' }),
        });
    });

    test('updateCart displays cart items', () => {
        cartItems = [{ id: 1, name: 'Product 1', price: '10.00' }];
        localStorageMock.getItem.mockReturnValue(JSON.stringify(cartItems));
        const cartDiv = document.getElementById('cart');
        const cartItemsHTML = document.getElementById('cartItems');

        updateCart();

        expect(cartItemsHTML.innerHTML).toContain('Product 1');
        expect(cartDiv.style.display).toBe('block');
    });

    test('checkout calculates total price and updates UI', () => {
        cartItems = [
            { id: 1, name: 'Product 1', price: '10.00' },
            { id: 2, name: 'Product 2', price: '20.00' },
        ];
        const checkoutDetails = document.getElementById('checkoutDetails');

        checkout();

        expect(checkoutDetails.innerHTML).toContain('Total Price in Cart: $30.00');
    });
});
