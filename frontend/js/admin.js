document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    checkLowStock();
    loadOrders(); // New function

    const modal = document.getElementById('product-modal');
    const addBtn = document.getElementById('add-product-btn');
    const closeBtn = document.querySelector('.close-btn');

    addBtn.onclick = () => {
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('modal-title').innerText = 'Add Product';
        modal.style.display = 'flex';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('product-form').onsubmit = handleFormSubmit;
});

window.showTab = (tab) => {
    const invTab = document.getElementById('inventory-tab');
    const ordTab = document.getElementById('orders-tab');
    const invBtn = document.getElementById('nav-inventory');
    const ordBtn = document.getElementById('nav-orders');
    const title = document.getElementById('tab-title');
    const subtitle = document.getElementById('tab-subtitle');

    if (tab === 'inventory') {
        invTab.style.display = 'block';
        ordTab.style.display = 'none';
        invBtn.classList.add('active');
        ordBtn.classList.remove('active');
        title.textContent = 'Product Inventory';
        subtitle.textContent = 'Manage your Apple product listings and stock levels.';
    } else {
        invTab.style.display = 'none';
        ordTab.style.display = 'block';
        invBtn.classList.remove('active');
        ordBtn.classList.add('active');
        title.textContent = 'Customer Orders';
        subtitle.textContent = 'Overview of all customer purchases and order fulfillment.';
        loadOrders();
    }
};

async function loadInventory() {
    const tbody = document.getElementById('inventory-list');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    try {
        const products = await fetchProducts();
        tbody.innerHTML = '';
        
        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td style="${p.stock < 5 ? 'color:red; font-weight:bold;' : ''}">${p.stock}</td>
                <td>
                    <button class="btn-secondary" onclick='editProduct(${JSON.stringify(p)})'>Edit</button>
                    <button class="btn-secondary" style="background:#ff3b30; color:white;" onclick="removeProduct('${p._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5">Error loading inventory.</td></tr>';
    }
}

async function checkLowStock() {
    try {
        const lowProducts = await fetchProducts('?low_stock=true');
        const alertBox = document.getElementById('low-stock-alert');
        const alertList = document.getElementById('low-stock-list');
        
        if (lowProducts && lowProducts.length > 0) {
            alertList.innerText = lowProducts.map(p => `${p.name} (${p.stock} left)`).join(', ');
            alertBox.style.display = 'block';
        } else {
            alertBox.style.display = 'none';
        }
    } catch (e) {
        console.warn("Could not fetch low stock alerts", e);
    }
}

window.editProduct = (p) => {
    document.getElementById('prod-id').value = p._id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-description').value = p.description || '';
    
    document.getElementById('modal-title').innerText = 'Edit Product';
    document.getElementById('product-modal').style.display = 'flex';
};

window.removeProduct = async (id) => {
    if(confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(id);
        loadInventory();
        checkLowStock();
    }
};

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('prod-id').value;
    const productData = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: Number(document.getElementById('prod-price').value),
        stock: Number(document.getElementById('prod-stock').value),
        description: document.getElementById('prod-description').value
    };

    if (id) {
        await updateProduct(id, productData);
    } else {
        await createProduct(productData);
    }

    document.getElementById('product-modal').style.display = 'none';
    loadInventory();
    checkLowStock();
}

async function loadOrders() {
    const tbody = document.getElementById('orders-list-admin');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    try {
        const res = await fetch('http://localhost:5000/api/orders', {
            headers: { ...Auth.getAuthHeader() }
        });
        const orders = await res.json();
        
        tbody.innerHTML = '';
        orders.forEach(o => {
            const tr = document.createElement('tr');
            const date = new Date(o.order_date).toLocaleDateString();
            tr.innerHTML = `
                <td style="font-size:12px; color:#86868b;">#${o._id.substring(o._id.length-6)}</td>
                <td>${o.customer_id ? o.customer_id.name : 'Guest'}</td>
                <td style="font-weight:600;">$${o.total_amount.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span>
                </td>
                <td style="font-size:13px;">${date}</td>
                <td>
                    <select onchange="updateOrderStatus('${o._id}', this.value)" style="font-size:12px; padding:4px; border-radius:4px;">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6">Error loading orders.</td></tr>';
    }
}

window.updateOrderStatus = async (id, status) => {
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                ...Auth.getAuthHeader() 
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error("Failed to update status");
        loadOrders();
    } catch (e) {
        alert("Error updating order: " + e.message);
    }
};
