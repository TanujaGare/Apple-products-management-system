const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : 'https://apple-products-management-system.onrender.com/api';

async function fetchProducts(queryParams = '') {
    const res = await fetch(`${API_URL}/products${queryParams}`);
    if(!res.ok) throw new Error("Backend failed to load products");
    return await res.json();
}

async function createProduct(productData) {
    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return res.json();
}

async function updateProduct(id, productData) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return res.json();
}

async function deleteProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
    });
    return res.json();
}

// Order APIs
async function placeOrder(orderData) {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
}

async function fetchOrders() {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const res = await fetch(`${API_URL}/orders`, { headers });
    if(!res.ok) throw new Error("Backend failed to load orders");
    return await res.json();
}

// Customers API
async function createCustomer(customerData) {
    const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
    });
    const data = await res.json();
    if (!res.ok && res.status !== 400) throw new Error(data.error);
    return data.customer || data; 
}

// Session management for anonymous cart
let cartSessionId = localStorage.getItem('cart_session_id');
if (!cartSessionId) {
    cartSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', cartSessionId);
}

async function fetchCart() {
    try {
        const res = await fetch(`${API_URL}/cart/${cartSessionId}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const items = await res.json();
        // Map product_id object to match the old flat product structure expected by cart.js
        return items
            .filter(item => item.product_id !== null) // Filter out items where product was physically deleted
            .map(item => ({
                ...item.product_id, // Unpack the populated product
                cartQuantity: item.quantity
            }));
    } catch (err) {
        console.error("Cart fetch error:", err);
        return [];
    }
}

async function addToCart(product) {
    try {
        const res = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: cartSessionId,
                product_id: product._id,
                quantity: 1
            })
        });
        if (!res.ok) throw new Error("Failed to add to cart");
        await updateCartCount();
        alert(`${product.name} added to cart!`);
    } catch (err) {
        alert("Error adding to cart: " + err.message);
    }
}

async function clearCart() {
    try {
        await fetch(`${API_URL}/cart/clear/${cartSessionId}`, {
            method: 'DELETE'
        });
        await updateCartCount();
    } catch (err) {
        console.error("Error clearing cart:", err);
    }
}

async function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if(countSpan) {
        const cart = await fetchCart();
        countSpan.textContent = cart.reduce((acc, item) => acc + item.cartQuantity, 0);
    }
}
