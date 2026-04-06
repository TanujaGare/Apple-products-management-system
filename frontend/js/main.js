document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadProducts();

    // Setup Search
    document.getElementById('search-btn').addEventListener('click', () => {
        const val = document.getElementById('search-input').value;
        loadProducts(`?search=${val}`);
    });

    // Setup Filters
    const categories = ['MacBook', 'iPad', 'iPhone', 'Accessories'];
    categories.forEach(cat => {
        document.getElementById(`filter-${cat}`).addEventListener('click', (e) => {
            e.preventDefault();
            loadProducts(`?category=${cat}`);
        });
    });
});

async function loadProducts(query = '') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<p>Loading products...</p>';

    try {
        const products = await fetchProducts(query);
        
        if (products.length === 0) {
            grid.innerHTML = '<p>No products found.</p>';
            return;
        }

        grid.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="category">${product.category}</div>
                <h4>${product.name}</h4>
                <p class="price">$${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                <p style="font-size:13px; color:#86868b; margin-bottom: 20px;">${product.description || ''}</p>
                ${product.stock > 0 
                    ? `<button class="btn-primary add-to-cart" onclick='handleAddToCart(${JSON.stringify(product)})'>Buy</button>`
                    : `<p class="out-of-stock">Out of Stock</p>`
                }
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = `<p style="color:red;">Error loading products. Ensure backend is running.</p>`;
    }
}

// Expose to window for the onclick handler
window.handleAddToCart = (product) => {
    addToCart(product);
}
