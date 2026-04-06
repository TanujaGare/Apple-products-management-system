document.addEventListener('DOMContentLoaded', () => {
    loadOrdersHistory();
});

async function loadOrdersHistory() {
    const listDiv = document.getElementById('orders-list');
    listDiv.innerHTML = '<p>Loading orders...</p>';

    try {
        const orders = await fetchOrders();
        
        if (!orders || orders.length === 0) {
            listDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #86868b;">
                    <h3>No Orders Found</h3>
                    <p>When customers make a purchase, their orders will appear here.</p>
                </div>
            `;
            return;
        }

        listDiv.innerHTML = '';
        
        orders.forEach(order => {
            const date = new Date(order.order_date).toLocaleString();
            
            // Build items HTML
            let itemsHTML = '';
            if (order.items && order.items.length > 0) {
                itemsHTML = `<div class="order-items-list"><strong>Items:</strong><ul>`;
                order.items.forEach(i => {
                    const prodName = i.product_id ? i.product_id.name : 'Unknown Product';
                    itemsHTML += `<li>${i.quantity} x ${prodName} - $${i.price} ea</li>`;
                });
                itemsHTML += `</ul></div>`;
            }

            const card = document.createElement('div');
            card.className = 'order-card';
                        const custName = order.customer_id ? order.customer_id.name : 'Unknown Customer';
                        const custEmail = order.customer_id ? order.customer_id.email : 'No Email';
                        
                        card.innerHTML = `
                            <div style="display:flex; justify-content:space-between;">
                                <div>
                                    <h4 style="margin-bottom: 5px;">Order #${order._id.substring(order._id.length-6)}</h4>
                                    <p style="font-size: 14px; color: #86868b;">Placed on: ${date}</p>
                                    <p style="font-size: 14px; margin-top: 5px;"><strong>Customer:</strong> ${custName} (${custEmail})</p>
                                </div>
                    <div style="text-align: right;">
                        <h3 style="margin-bottom: 5px;">$${order.total_amount.toFixed(2)}</h3>
                        <span style="font-size:13px; font-weight:600; padding: 4px 8px; border-radius: 12px; background: ${getStatusColor(order.status)}">
                            ${order.status}
                        </span>
                    </div>
                </div>
                ${itemsHTML}
            `;
            listDiv.appendChild(card);
        });

    } catch (err) {
        listDiv.innerHTML = '<p style="color:red;">Error fetching order history.</p>';
    }
}

function getStatusColor(status) {
    if(status === 'Completed') return '#d4edda; color: #155724';
    if(status === 'Cancelled') return '#f8d7da; color: #721c24';
    return '#fff3cd; color: #856404'; // Pending
}
