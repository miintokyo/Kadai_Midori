<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

//Important that the very first character in the file is this or even white space will be output

//1. Grab data from $_POST into variables
$ticker         = trim($_POST['ticker'] ?? '');
$name           = trim($_POST['name'] ?? '');
$numberOfShares = trim($_POST['numberOfShares'] ?? '');
$purchasePrice  = trim($_POST['purchasePrice'] ?? '');
$currency       = trim($_POST['currency'] ?? '');
//$NISA = $_POST['NISA'];

//2. Handle NISA with the isset() pattern
// $nisa = isset($_POST['NISA']) ? 'yes' : 'no';

if (isset($_POST['NISA'])) {
    $nisa = "yes";
} else {
    $nisa = "no";
}

//3. Build $line string(comma-separated, ending in \n)
//* Modern shorthand of "fopen → fwrite → fclose"
$a = ',';
$line = $ticker.$a.$name.$a.$numberOfShares.$a.$purchasePrice.$a.$currency.$a.$nisa."\n";//data
file_put_contents("holdings.csv", $line, FILE_APPEND | LOCK_EX);//filename, data, flag - writes data into filename
//FILE_APPEND: adds to the end

// Redirect to read.php
header("Location: index.php");
// echo "Process page reached!";
// var_dump($_POST);
exit;
?>

<!--
//A pure logic file that 
//1. Receives the $_POST data
//2. Builds a CSV line from it
//3. Appends that line to holdings.csv
//4. Redirects the user back to read.php so they see the result-->