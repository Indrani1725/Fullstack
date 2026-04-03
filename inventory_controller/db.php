<?php
$host = "localhost"; // port number to XAMPP settings
$user = "root";           // Default XAMPP user
$pass = "";               // Default XAMPP password is empty
$dbname = "inventory_controller_db"; 

// Create connection
$conn = mysqli_connect($host, $user, $pass, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>