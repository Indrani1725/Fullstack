<?php include('db.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | StockPro</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { 
            --primary-blue: #4361ee; 
            --amazon-orange: #ff9900; /* Real world "Amazon" box color */
            --bg-light: #f8fafe; 
        }
        body { 
            font-family: 'Inter', sans-serif; 
            background: var(--bg-light); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
        }
        .login-card { 
            background: white; 
            padding: 45px; 
            border-radius: 24px; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.06); 
            width: 400px; 
            text-align: center;
            border: 1px solid #edf2f7;
        }

        /* The Box Icon - Now in "Amazon Orange" */
        .logo-icon { 
            font-size: 3.8rem; 
            color: var(--amazon-orange); 
            margin-bottom: 15px; 
            filter: drop-shadow(0 4px 6px rgba(255, 153, 0, 0.2));
        }

        /* Updated StockPro Font Style */
        h2 { 
            font-family: 'Montserrat', sans-serif; 
            color: #1a202c; 
            margin: 0; 
            font-size: 2.2rem; 
            font-weight: 800; 
            letter-spacing: -1px;
        }
        
        /* The sub-text line you requested */
        .sub-text { 
            color: #718096; 
            margin: 10px 0 35px 0; 
            font-size: 0.95rem; 
        }
        
        .input-group { margin-bottom: 22px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-weight: 700; color: #4a5568; font-size: 0.85rem; }
        input { 
            width: 100%; 
            padding: 14px; 
            border: 1.5px solid #e2e8f0; 
            border-radius: 12px; 
            box-sizing: border-box; 
            outline: none;
            transition: all 0.3s ease;
        }
        input:focus { border-color: var(--primary-blue); box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1); }
        
        button { 
            width: 100%; 
            padding: 16px; 
            background-color: var(--primary-blue); 
            color: white; 
            border: none; 
            border-radius: 12px; 
            cursor: pointer; 
            font-size: 1rem; 
            font-weight: 700;
            transition: 0.3s;
            margin-top: 10px;
        }
        button:hover { background-color: #3f37c9; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3); }
        
        .footer-note { margin-top: 30px; font-size: 0.8rem; color: #a0aec0; letter-spacing: 0.5px; }
    </style>
</head>
<body>

    <div class="login-card">
        <div class="logo-icon"><i class="fas fa-box-open"></i></div>
        
        <h2>StockPro</h2>
        
        <p class="sub-text">Please enter your details to access the system</p>

        <form action="dashboard.php" method="POST">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Enter your username" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter your password" required>
            </div>
            <button type="submit">Sign In to System</button>
        </form>

        <div class="footer-note">
            &copy; 2026 Inventory Controller Project
        </div>
    </div>

</body>
</html>