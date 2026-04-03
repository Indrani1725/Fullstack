<?php 
include('db.php'); 

// Logic stays the same to keep your counts working
$product_query = mysqli_query($conn, "SELECT COUNT(*) as total FROM products");
$product_data = mysqli_fetch_assoc($product_query);
$total_products = $product_data['total'];

$low_stock_query = mysqli_query($conn, "SELECT COUNT(*) as low FROM products WHERE stock_qty < 5");
$low_stock_data = mysqli_fetch_assoc($low_stock_query);
$low_stock_count = $low_stock_data['low'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory | Pro Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --primary: #4361ee; --secondary: #3f37c9; --success: #4cc9f0; --bg: #f8fafe; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); margin: 0; color: #1e293b; }
        
        /* Modern Sidebar/Nav */
        .navbar { background: #fff; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); letter-spacing: -1px; }
        .nav-links a { text-decoration: none; color: #64748b; margin-left: 20px; font-weight: 500; transition: 0.3s; }
        .nav-links a:hover { color: var(--primary); }
        .logout { color: #ef4444 !important; }

        .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
        .welcome-msg { margin-bottom: 30px; }
        .welcome-msg h1 { font-size: 1.8rem; margin: 0; color: #0f172a; }
        .welcome-msg p { color: #64748b; margin: 5px 0 0; }

        /* Fancy Cards */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; }
        .stat-card { background: #fff; padding: 25px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; position: relative; overflow: hidden; transition: transform 0.3s; }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin: 0; }
        .stat-card .number { font-size: 2.5rem; font-weight: 800; margin: 15px 0; color: #1e293b; }
        .icon-box { position: absolute; right: -10px; bottom: -10px; font-size: 5rem; color: #f1f5f9; z-index: 0; }
        .stat-content { position: relative; z-index: 1; }

        /* Action Section */
        .actions { margin-top: 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 40px; border-radius: 20px; color: white; display: flex; justify-content: space-between; align-items: center; }
        .actions h2 { margin: 0; font-size: 1.5rem; }
        .btn-premium { background: white; color: var(--primary); padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .btn-premium:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
    </style>
</head>
<body>

    <nav class="navbar">
        <div class="logo"><i class="fas fa-box-open"></i> STOCKPRO</div>
        <div class="nav-links">
            <a href="products.php">Inventory</a>
            <a href="history.php">History</a> 
            <a href="suppliers_list.php" class="btn">Manage Suppliers</a>
            <a href="login.php" class="logout">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="welcome-msg">
            <h1>Hello, Admin 👋</h1>
            <p>Here is what's happening with your stock today.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-content">
                    <h3>Total Products</h3>
                    <div class="number"><?php echo $total_products; ?></div>
                    <span style="color: #10b981; font-weight: 600;"><i class="fas fa-arrow-up"></i> Live System</span>
                </div>
                <i class="fas fa-boxes icon-box"></i>
            </div>

            <div class="stat-card">
                <div class="stat-content">
                    <h3>Low Stock Alerts</h3>
                    <div class="number" style="color: <?php echo ($low_stock_count > 0) ? '#ef4444' : '#1e293b'; ?>;">
                        <?php echo $low_stock_count; ?>
                    </div>
                    <span style="color: #64748b;">Requires Attention</span>
                </div>
                <i class="fas fa-exclamation-triangle icon-box"></i>
            </div>
        </div>

        <div class="actions">
            <div>
                <h2>Ready to grow your inventory?</h2>
                <p style="opacity: 0.9; margin-top: 5px;">Add new items to the database instantly.</p>
            </div>
            <a href="products.php" class="btn-premium">Add New Product</a>
        </div>
    </div>

</body>
</html>