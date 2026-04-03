<?php 
include('db.php'); // Your existing database connection file
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StockPro | Supplier List</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafe; margin: 0; padding: 20px; }
        .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background-color: #4361ee; color: white; border-radius: 5px 5px 0 0; }
        .btn-back { text-decoration: none; color: #4361ee; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2><i class="fas fa-truck-field"></i> Managed Suppliers</h2>
        <a href="dashboard.php" class="btn-back">← Back to Dashboard</a>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Supplier Name</th>
                    <th>Contact Info</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Fetching from your 'suppliers' table
                $sql = "SELECT * FROM suppliers ORDER BY s_id DESC";
                $result = mysqli_query($conn, $sql);

                if (mysqli_num_rows($result) > 0) {
                    while($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                                <td>" . $row['s_id'] . "</td>
                                <td><strong>" . $row['s_name'] . "</strong></td>
                                <td>" . $row['contact'] . "</td>
                              </tr>";
                    }
                } else {
                    echo "<tr><td colspan='3' style='text-align:center;'>No suppliers added yet.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>