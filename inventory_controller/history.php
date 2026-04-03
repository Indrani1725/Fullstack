<?php 
include('db.php'); 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StockPro | Activity History</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafe; margin: 0; }
        .navbar { background: #fff; padding: 1rem 2rem; display: flex; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
        .logo { font-weight: 800; color: #4361ee; text-decoration: none; font-size: 1.5rem; }
        .container { max-width: 1000px; margin: 50px auto; padding: 0 20px; }
        .history-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        h2 { color: #1a202c; display: flex; align-items: center; gap: 10px; }
        .log-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 15px; 
            border-bottom: 1px solid #f1f5f9; 
            align-items: center;
        }
        .log-item:last-child { border-bottom: none; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
        .status-in { color: #166534; background: #dcfce7; }
        .status-out { color: #991b1b; background: #fee2e2; }
        .time { color: #94a3b8; font-size: 0.85rem; }
    </style>
</head>
<body>

    <nav class="navbar">
        <a href="dashboard.php" class="logo">STOCKPRO</a>
        <div>
            <a href="dashboard.php" style="text-decoration:none; color:#64748b; margin-right:20px;">Dashboard</a>
            <a href="logout.php" style="text-decoration:none; color:#ef4444;">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="history-card">
            <h2><i class="fas fa-history" style="color:#4361ee;"></i> Recent Activity</h2>
            <p style="color:#64748b;">This page tracks all changes made to your inventory.</p>
            
            <?php
            // Pulling real data from your transactions table
            $query = "SELECT t.*, p.p_name FROM transactions t 
                      LEFT JOIN products p ON t.product_id = p.p_id 
                      ORDER BY t.t_date DESC";
            $result = mysqli_query($conn, $query);

            if (mysqli_num_rows($result) > 0) {
                while($row = mysqli_fetch_assoc($result)) {
                    // Determine style based on IN or OUT type
                    $statusClass = ($row['type'] == 'IN') ? 'status-in' : 'status-out';
                    $productDisplay = $row['p_name'] ? $row['p_name'] : "Product ID: " . $row['product_id'];
                    ?>
                    <div class="log-item">
                        <div>
                            <span class="badge <?php echo $statusClass; ?>"><?php echo $row['type']; ?></span>
                            <strong style="margin-left:10px;"><?php echo $productDisplay; ?></strong> 
                            was updated (Qty: <?php echo $row['quantity']; ?>)
                        </div>
                        <div class="time"><?php echo $row['t_date']; ?></div>
                    </div>
                    <?php
                }
            } else {
                echo "<p style='text-align:center; padding:20px;'>No recent activity found in database.</p>";
            }
            ?>
        </div>
    </div>

</body>
</html>