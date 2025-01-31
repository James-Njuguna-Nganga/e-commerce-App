let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || null;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const addProductForm = document.getElementById('addProduct');
const productsList = document.getElementById('productsList');
const productsListUser = document.getElementById('productsListUser');
const cartItemsHTML = document.getElementById('cartItems');
const checkoutDetails = document.getElementById('checkoutDetails');

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
        alert("Registration successful!");
        showLoginForm();
    } catch (error) {
        console.error('Error registering user:', error);
    }
});
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
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('login').style.display = 'none';
            document.getElementById('userPanel').style.display = 'block';
            console.log('Login successful');
            showProducts();
        } else {
        }
    } catch (error) {
        console.error('Error logging in user:', error);
    }
});
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
            localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
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

 function checkPrice(price){

 }
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const priceStr = document.getElementById('productPrice').value;

    if (!isNaN(priceStr)) {
        const price = parseFloat(priceStr).toFixed(2);
        
try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price }),
            });
            const product = await response.json();
            console.log('Product added:', product);
            alert("Product added successfully!");
            showProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    } else {
        alert("Please enter a valid price.");
    }
});
async function updateProduct(productId) {
    const newName = prompt("Enter new product name:");
    const newPriceStr = prompt("Enter new product price:");
    if (!isNaN(newPriceStr)) {
        let newPrice = parseFloat(newPriceStr).toFixed(2);

        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, price: newPrice })
            });

            if (response.ok) {
                console.log(`Product updated to ${newName} at $${newPrice}.`);
                alert("Product updated successfully!");
                showProducts();
            } else {
                throw new Error(`Failed to update product with ID: ${productId}`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("There was an error updating the product.");
        }
    } else {
        alert("Please enter a valid price.");
    }
}
async function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`, { method: 'DELETE' });

            if (response.ok) {
                console.log("Product deleted successfully");
                alert("Product deleted successfully!");
                showProducts();
            } else {
                throw new Error(`Failed to delete product with ID: ${productId}`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("There was an error deleting the product.");
        }
    }
}
async function showProducts() {
    try {
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();
        if (currentAdmin) {
            productsList.innerHTML = "";
            products.forEach(product => {
                const productHTML = `
                    <div class="product">
                        <i class="fas fa-shopping-cart" style="font-size: 50px;"></i>
                        <h4>${product.name}</h4>
                        <p>Price: $${product.price}</p>
                        <button onclick="updateProduct(${product.id})">Update</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </div>`;
                productsList.innerHTML += productHTML;
            });
            productsList.style.display = "block";
        }
        if (currentUser) {
            productsListUser.innerHTML = "";
            products.forEach(product => {
                const productHTML = `
                    <div class="product">
                        <i class="fas fa-shopping-cart" style="font-size: 50px;"></i>
                        <h4>${product.name}</h4>
                        <p>Price: $${product.price}</p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>`;
                productsListUser.innerHTML += productHTML;
            });
            productsListUser.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}
async function addToCart(productId) {
    if (cartItems.length < 8) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const product = await response.json();
            cartItems.push(product);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();

        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    } else {
        alert("Cart is full!");
    }
}
function updateCart() {
    cartItemsHTML.innerHTML = '';

    cartItems.forEach(item => {
        const itemHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>Price: $${item.price}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>`;
        cartItemsHTML.innerHTML += itemHTML;
    });
    if (cartItems.length > 0) {
        document.getElementById("cart").style.display = "block";
    } else {
        document.getElementById("cart").style.display = "none";
        checkoutDetails.innerHTML = ''; 
    }
}
async function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
}
function checkout() {
    const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);
    checkoutDetails.innerHTML = `<h3>Checkout Summary</h3><p>Total Price in Cart: $${total.toFixed(2)}</p><p>Thank you for shopping with us!</p>`;
    document.getElementById("checkout").style.display = "block";
}

if (currentUser || currentAdmin) {
    showProducts();
    updateCart();
}

