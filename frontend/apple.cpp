<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order History - Apple Store</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="admin-body">
    <header>
        <div class="header-content">
            <h1 class="logo"> Orders</h1>
            <nav>
                <a href="index.html">Store</a>
                <a href="cart.html">Cart</a>
                <a href="orders.html" class="active">Orders</a>
                <a href="admin.html">Admin</a>
            </nav>
        </div>
    </header>

    <main class="admin-container">
        <h2>Order History</h2>
        
        <div id="orders-list">
            <!-- Orders injected here -->
        </div>
    </main>

    <script src="js/api.js"></script>
    <script src="js/orders.js"></script>
</body>
</html>
