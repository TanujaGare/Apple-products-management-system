document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const form = document.getElementById('checkout-form');
    if(form) {
        form.addEventListener('submit', handleCheckout);
    }
});

async function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    
    // Give user visual feedback while fetching
    cartItemsDiv.innerHTML = '<p>Loading your bag...</p>';
    
    const cart = await fetchCart();

    if(cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your bag is empty.</p>';
        totalSpan.innerText = '0.00';
        return;
    }

    let total = 0;
    cartItemsDiv.innerHTML = '';
    
    cart.forEach(item => {
        // Fallback for edge cases where product was deleted but remains in cart
        if (!item || !item.price) return;
        
        const itemTotal = item.price * item.cartQuantity;
        total += itemTotal;
        
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p style="color: #86868b; font-size: 14px;">Qty: ${item.cartQuantity}</p>
                </div>
                <div>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
    });

    totalSpan.innerText = total.toFixed(2);
}

async function handleCheckout(e) {
    e.preventDefault();
    const cart = await fetchCart();
    if(cart.length === 0) {
        return alert("Cart is empty!");
    }

    const customerData = {
        name: document.getElementById('cust-name').value,
        email: document.getElementById('cust-email').value,
        phone: document.getElementById('cust-phone').value,
        address: document.getElementById('cust-address').value
    };

    const paymentMethod = document.getElementById('cust-payment').value;

    try {
        // 1. Ensure Customer Exists/Registers
        const customer = await createCustomer(customerData);
        
        // 2. Format Items for Order
        const items = cart.map(item => ({
            product_id: item._id,
            quantity: item.cartQuantity
        }));

        // 3. Place the Order (Creates Order, OrderItems, Payment and deducts stock backend)
        const orderData = {
            customer_id: customer._id,
            items: items,
            payment_method: paymentMethod
        };

        const result = await placeOrder(orderData);
        
        alert("Order placed successfully! Order ID: " + result.order_id);
        await clearCart();
        window.location.href = 'index.html';

    } catch (err) {
        alert("Checkout failed: " + err.message);
    }
}
