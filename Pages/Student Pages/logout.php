<?php
session_start();

// Destroy all session data
$_SESSION = array();

// Destroy the session cookie if it exists
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Destroy the session
session_destroy();

// Redirect to landing page
header("Location: ../Landing Page/php/landing_page.php");
exit();
?>
