<?php 
include('db.php'); 

// 1. Get the product data to fill the form
if(isset($_GET['id'])) {
    $id = $_GET['id'];
    $result = mysqli_query($conn, "SELECT * FROM products WHERE p_id = $id");
    $row = mysqli_fetch_assoc($result);
}

// 2. Handle the Update
if(isset($_POST['update_product'])) {
    $id = $_POST['p_id'];
    $name = mysqli_real_escape_string($conn, $_POST['p_name']);
    $cat = mysqli_real_escape_string($conn, $_POST['category']);
    $price = $_POST['price'];
    $qty = $_POST['stock_qty'];
    
    $sql = "UPDATE products SET p_name='$name', category='$cat', price='$price', stock_qty='$qty' WHERE p_id=$id";
    if(mysqli_query($conn, $sql)) {
        header("Location: products.php");
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Product | StockPro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafe; display: flex; justify-content: center; padding-top: 50px; }
        .edit-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 450px; }
        h2 { color: #1a202c; margin-bottom: 25px; }
        .input-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; color: #4a5568; }
        input { width: 100%; padding: 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; box-sizing: border-box; }
        .btn-update { width: 100%; padding: 14px; background: #4361ee; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 10px; }
        .btn-cancel { display: block; text-align: center; margin-top: 15px; color: #718096; text-decoration: none; font-size: 0.9rem; }
    </style>
</head>
<body>

<div class="edit-card">
    <h2><i class="fas fa-edit" style="color:#4361ee;"></i> Edit Product</h2>
    <form method="POST">
        <input type="hidden" name="p_id" value="<?php echo $row['p_id']; ?>">
        
        <div class="input-group">
            <label>Product Name</label>
            <input type="text" name="p_name" value="<?php echo $row['p_name']; ?>" required>
        </div>
        
        <div class="input-group">
            <label>Category</label>
            <input type="text" name="category" value="<?php echo $row['category']; ?>">
        </div>
        
        <div class="input-group">
            <label>Price</label>
            <input type="number" name="price" step="0.01" value="<?php echo $row['price']; ?>" required>
        </div>
        
        <div class="input-group">
            <label>Current Stock</label>
            <input type="number" name="stock_qty" value="<?php echo $row['stock_qty']; ?>" required>
        </div>
        
        <button type="submit" name="update_product" class="btn-update">Save Changes</button>
        <a href="products.php" class="btn-cancel">Cancel and Go Back</a>
    </form>
</div>

</body>
</html>