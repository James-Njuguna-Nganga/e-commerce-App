// State variables
let currentUser = null;
let currentAdmin = null;
let cartItems = [];

// DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const addProductForm = document.getElementById('addProduct');
const productsList = document.getElementById('productsList');
const productsListUser = document.getElementById('productsListUser');
const cartItemsHTML = document.getElementById('cartItems');
const checkoutDetails = document.getElementById('checkoutDetails');

// Show/Hide Forms
function showRegisterForm() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'block';
}

function showAddProductForm() {
    document.getElementById('addProductForm').style.display = 'block';
}

// User Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const user = await response.json();
        console.log('User registered:', user);
        showLoginForm();
    } catch (error) {
        console.error('Error registering user:', error);
    }
});

// User Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            document.getElementById('login').style.display = 'none';
            document.getElementById('userPanel').style.display = 'block';
            console.log('Login successful');
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
    }
});

// Admin Login
adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        const response = await fetch('http://localhost:3000/admins');
        const admins = await response.json();
        const admin = admins.find(a => a.email === email && a.password === password);
        if (admin) {
            currentAdmin = admin;
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            console.log('Admin login successful');
        } else {
            alert('Invalid admin credentials');
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
    }
});

// Add Product
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;

    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price }),
        });
        const product = await response.json();
        console.log('Product added:', product);
        document.getElementById('addProductForm').style.display = 'none';
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

// View Products
async function showProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        console.log('Fetched Products:', products);

        if (currentAdmin) {
            productsList.innerHTML = '';
            products.forEach(product => {
                const productHTML = `
                    <div class="product">
                        <h4>${product.name}</h4>
                        <p>Price: $${product.price}</p>
                        <button onclick="updateProduct(${product.id})">Update</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </div>
                `;
                productsList.innerHTML += productHTML;
            });
            productsList.style.display = 'block';
        }

        if (currentUser) {
            productsListUser.innerHTML = '';
            products.forEach(product => {
                const productHTML = `
                    <div class="product">
                        <h4>${product.name}</h4>
                        <p>Price: $${product.price}</p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                `;
                productsListUser.innerHTML += productHTML;
            });
            productsListUser.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Update Product
async function updateProduct(productId) {
    const newName = prompt('Enter new product name:');
    const newPrice = prompt('Enter new product price:');

    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, price: newPrice }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        console.log('Product updated:', product);
        showProducts();
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// Delete Product
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Product deleted successfully');
        showProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Add to Cart
async function addToCart(productId) {
    if (cartItems.length < 4) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product = await response.json();
            console.log('Product added to cart:', product);
            cartItems.push(product);
            updateCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    } else {
        alert('Cart is full!');
    }
}

// Update Cart
function updateCart() {
    cartItemsHTML.innerHTML = '';
    cartItems.forEach(item => {
        const itemHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>Price: $${item.price}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsHTML.innerHTML += itemHTML;
    });
    document.getElementById('cart').style.display = 'block';
}

// Remove from Cart
function removeFromCart(productId) {
    console.log('Removing product from cart:', productId);
    cartItems = cartItems.filter(item => item.id !== productId);
    console.log('Cart items after removal:', cartItems);
    updateCart();
}

// Checkout
function checkout() {
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    checkoutDetails.innerHTML = `
        <h3>Checkout Summary</h3>
        <p>Total: $${total}</p>
    `;
    document.getElementById('checkout').style.display = 'block';
}
