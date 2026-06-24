<?php
$csvText = file_get_contents("holdings.csv");//like fetch('holdings.csv') + .text() without await

$lines = explode("\n", $csvText);//like .split('\n')

$holdings=[];//Always add $ !!!!

foreach($lines as $line){
    if(trim($line) == ""){continue;}
    $items = explode(",", $line);
    $stock =[
        "ticker" => $items[0],
        "name" => $items[1],
        "numberOfShares" =>(int)$items[2], //not ;!!
        "price" => (float)$items[3],
        "currency" => $items[4],
        "nisa" => $items[5]
    ];

    $holdings[] = $stock;//similar to holdings.push(stock) in Javascript
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Assets</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dashboard-container">
        <header class="portfolio-summary">
            <div class="summary-left">
                <span class="summary-label">Total Portfolio Value</span>
                <h1 class="total-balance"></h1>
            </div>
            <div class="badge"></div>
        </header>

        <main class="stock-list">
            <div class= "myAssets">
                <h2 class="section-title">My Assets</h2>
                <a href="write.php" class="addBtn">+ Add</a>
            </div>

<?php foreach($holdings as $stock){?>
            <div class="stock-row" data-trend="">
            <div class="stock-col stock-info">

            <span class="ticker"><?php echo $stock["ticker"]
            //This is PHP version of stock.ticker 
            ?></span>
                <span class="subtext"><?php echo $stock["numberOfShares"]."stocks" ?></span>
            </div>
            <div class="stock-col stock-chart-placeholder">
                <div class="sparkline-preview"></div>
            </div>
            <div class="stock-col stock-pricing">
                <span class="current-price"><?php echo $stock["price"]?></span>
                <span class="badge badge-mini"><?php echo "later"?></span>
            </div>
            </div>
<?php }?>

        </main>
    </div>

<!--script src="script.js" script
PHP code runs on the server, before the page is sent. JavaScript in script.js runs in the browser, after the page arrives. They never directly "see" each other — if JS ever needs data that PHP prepared, you'd have to print that data into the HTML/JS somehow (e.g. 
PHP echoing it into a script block, or JS fetching a separate PHP endpoint. -->

</body>
</html>