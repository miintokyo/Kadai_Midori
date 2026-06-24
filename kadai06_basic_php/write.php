<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Assets</title>
    <link rel="stylesheet" href="writestyle.css">
</head>
<body>

<div class="dashboard-container">

        <header class="portfolio-summary">
            <div class="stock-col">
                <span class="summary-label">Manage Portfolios</span>
                <h1 class="total-balance">New Assets</h1>
            </div>
        </header>

        <main>
            <h2 class="section-title">Register Stock</h2>

            <form action="process.php" method="POST" class="input-form">
                
                <div class="form-group">
                    <label for="ticker">Ticker Name</label>
                    <input type="text" id="ticker" name="ticker" placeholder="e.g., AAPL" required>
                </div>

                <div class="form-group">
                    <label for="name">Stock Name</label>
                    <input type="text" id="name" name="name" placeholder="e.g., Apple Inc." required>
                </div>

                <div class="form-group">
                    <label for="numberOfShares">Number of Shares</label>
                    <input type="number" id="numberOfShares" name="numberOfShares" placeholder="0" required>
                </div>

                <div class="form-group">
                    <label for="purchasePrice">Purchase Price</label>
                    <input type="number" id="purchasePrice" name="purchasePrice" step="0.01" placeholder="0.00" required>
                </div>

                <div class="form-group">
                    <label for="currency">Currency</label>
                    <input type="text" id="currency" name="currency" placeholder="USD" required>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="NISA" name="NISA" value="yes">
                    <label for="NISA">NISA Account</label>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-submit">Save Asset</button>
                    <a href="index.php" class="btn-cancel">Cancel</a>
                </div>
            </form>
        </main>
    </div>

<!--script src="script.js" script
PHP code runs on the server, before the page is sent. JavaScript in script.js runs in the browser, after the page arrives. They never directly "see" each other — if JS ever needs data that PHP prepared, you'd have to print that data into the HTML/JS somehow (e.g. 
PHP echoing it into a script block, or JS fetching a separate PHP endpoint. -->

</body>
</html>