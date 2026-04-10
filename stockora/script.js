const API_KEY = "PUJWNKW9U2WIYQ5X";

const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

let stocks = [];

// Search Button Click
searchBtn.addEventListener("click", async () => {
  const symbol = document.getElementById("searchInput").value.trim().toUpperCase();

  if (!symbol) {
    document.getElementById("error").innerHTML = `<p>Input not found</p>`
    return;
  }

  const stockData = await getStockData(symbol);

  if (stockData) {
    stocks.push(stockData);
    displayStocks(stocks);
  }
});

// Fetch Stock Data
async function getStockData(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    resultDiv.innerHTML = "Loading...";

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const stock = data["Global Quote"];

    if (!stock || Object.keys(stock).length === 0) {
      document.getElementById("error").innerHTML = `<p>Data Not Found</p>`
      return null;
    }

    return {
      symbol: stock["01. symbol"],
      price: parseFloat(stock["05. price"]),
      change: stock["10. change percent"]
    };

  } catch (error) {
    document.getElementById("error").innerHTML = `<p>Api not feching</p>`
    return null;
  }
  
}

// Display Stocks
function displayStocks(stockList) {
  resultDiv.innerHTML = "";

  stockList.forEach(stock => {
    const div = document.createElement("div");

    // Color based on gain/loss
    const color = parseFloat(stock.change) > 0 ? "green" : "red";

    div.innerHTML = `
      <h3>${stock.symbol}</h3>
      <p>Price: $${stock.price}</p>
      <p style="color:${color}">Change: ${stock.change}</p>
      <hr>
    `;

    resultDiv.appendChild(div);
  });
}

// Sorting
function sortByPrice() {
  const sorted = [...stocks].sort((a, b) => a.price - b.price);
  displayStocks(sorted);
}

function sortByChange() {
  const sorted = [...stocks].sort((a, b) =>
    parseFloat(a.change) - parseFloat(b.change)
  );
  displayStocks(sorted);
}

// Filtering
function showGainers() {
  const gainers = stocks.filter(stock => parseFloat(stock.change) > 0);
  displayStocks(gainers);
}

function showLosers() {
  const losers = stocks.filter(stock => parseFloat(stock.change) < 0);
  displayStocks(losers);
}