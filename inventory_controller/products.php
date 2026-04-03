<?php 
include('db.php'); 

// 1. Handle Deleting a Product + Log to History
if(isset($_GET['delete'])) {
    $id = $_GET['delete'];
    
    // We log it as an "OUT" transaction with quantity 0 before deleting
    mysqli_query($conn, "INSERT INTO transactions (product_id, type, quantity) VALUES ($id, 'OUT', 0)");

    if(mysqli_query($conn, "DELETE FROM products WHERE p_id = $id")) {
        header("Location: products.php");
    }
}

// 2. Handle Adding a Product + Log to History
if(isset($_POST['add_product'])) {
    $name = mysqli_real_escape_string($conn, $_POST['p_name']);
    $cat = mysqli_real_escape_string($conn, $_POST['category']);
    $price = $_POST['price'];
    $qty = $_POST['stock_qty'];
    
    $sql = "INSERT INTO products (p_name, category, price, stock_qty) VALUES ('$name', '$cat', '$price', '$qty')";
    
    if(mysqli_query($conn, $sql)) { 
        // Get the ID of the product we just added to link it correctly
        $new_id = mysqli_insert_id($conn);
        
        // Log it as an "IN" transaction with the quantity you entered
        mysqli_query($conn, "INSERT INTO transactions (product_id, type, quantity) VALUES ($new_id, 'IN', $qty)");
        
        header("Location: products.php"); 
    }
}

// 3. Search Logic
$search_query = "";
if(isset($_POST['search_btn'])) {
    $search_query = mysqli_real_escape_string($conn, $_POST['search_txt']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Inventory | Search & Manage</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --primary: #4361ee; --danger: #ef4444; --table-header: #2d3748; }
        body { font-family: 'Inter', sans-serif; background: #f8fafe; margin: 0; }
        .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
        .table-title { font-size: 1.8rem; font-weight: 800; color: #1a202c; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .top-flex { display: flex; gap: 20px; margin-bottom: 30px; align-items: flex-start; }
        .form-card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); flex: 2; }
        .search-card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); flex: 1; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
        input { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; box-sizing: border-box; }
        .btn-add { background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; padding: 12px; }
        .btn-search { background: #64748b; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; padding: 12px; width: 100%; margin-top: 10px; }
        .table-section { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background-color: var(--table-header); }
        th { padding: 18px 20px; text-align: left; font-size: 0.85rem; text-transform: uppercase; color: #fff; letter-spacing: 1px; }
        td { padding: 18px 20px; border-bottom: 1px solid #edf2f7; font-size: 1rem; color: #2d3748; }
        tbody tr:hover { background-color: #f1f7ff; }
        .badge { padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; }
        .bg-cat { background: #e0e7ff; color: #3730a3; }
        .bg-stock { background: #dcfce7; color: #166534; }
        .btn-delete { color: var(--danger); text-decoration: none; font-weight: 700; margin-left: 15px; }
        .btn-edit { color: var(--primary); text-decoration: none; font-weight: 700; }
    </style>
</head>
<body>

    <div class="container">
        <div class="table-title">
            <i class="fas fa-boxes-stacked"></i> Master Product Inventory
        </div>

        <div class="top-flex">
            <div class="form-card">
                <form class="form-grid" method="POST">
                    <input type="text" name="p_name" placeholder="Product Name" required>
                    <input type="text" name="category" placeholder="Category">
                    <input type="number" name="price" placeholder="Price" step="0.01" required>
                    <input type="number" name="stock_qty" placeholder="Qty" required>
                    <button type="submit" name="add_product" class="btn-add">Add Item</button>
                </form>
            </div>

            <div class="search-card">
                <form method="POST" style="display: flex; flex-direction: column;">
                    <input type="text" name="search_txt" placeholder="Search by name..." value="<?php echo htmlspecialchars($search_query); ?>">
                    <button type="submit" name="search_btn" class="btn-search"><i class="fas fa-search"></i> Search</button>
                </form>
            </div>
        </div>

        <div class="table-section">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $sql_load = "SELECT * FROM products";
                    if(!empty($search_query)) {
                        $sql_load = "SELECT * FROM products WHERE p_name LIKE '%$search_query%'";
                    }
                    
                    $res = mysqli_query($conn, $sql_load);
                    $count = 1; 
                    
                    if (mysqli_num_rows($res) > 0) {
                        while($row = mysqli_fetch_assoc($res)) {
                            $lowStock = ($row['stock_qty'] < 10) ? 'background:#fee2e2; color:#991b1b;' : '';
                            echo "<tr>
                                    <td style='font-weight:700; color:#64748b;'>" . $count . "</td>
                                    <td style='font-weight:700; color:#1a202c;'>" . $row['p_name'] . "</td>
                                    <td><span class='badge bg-cat'>" . $row['category'] . "</span></td>
                                    <td style='font-weight:600;'>$" . $row['price'] . "</td>
                                    <td><span class='badge bg-stock' style='" . $lowStock . "'>" . $row['stock_qty'] . " Units</span></td>
                                    <td>
                                        <a href='edit_product.php?id=" . $row['p_id'] . "' class='btn-edit'><i class='fas fa-edit'></i> Edit</a>
                                        <a href='products.php?delete=" . $row['p_id'] . "' class='btn-delete' onclick=\"return confirm('Delete this product?')\"><i class='fas fa-trash'></i></a>
                                    </td>
                                  </tr>";
                            $count++; 
                        }
                    } else {
                        echo "<tr><td colspan='6' style='text-align:center; padding:40px; color:#64748b;'>No matches found.</td></tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <br>
        <a href="dashboard.php" style="color:var(--primary); font-weight:600; text-decoration:none;"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
    </div>

</body>
</html>