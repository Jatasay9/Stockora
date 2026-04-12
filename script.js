const API_KEY = "d7dst6pr01qmm59ed9n0d7dst6pr01qmm59ed9ng"; // Free Finnhub key
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");

let stocks = [];

searchBtn.addEventListener("click", async () => {
  const symbol = document.getElementById("searchInput").value.trim().toUpperCase();

  if (!symbol) {
    errorDiv.innerHTML = `<p>Input not found</p>`;
    return;
  }

  const stockData = await getStockData(symbol);

  if (stockData) {
    stocks.push(stockData);
    displayStocks(stocks);
  }
});

async function getStockData(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

  try {
    resultDiv.innerHTML = "Loading...";
    errorDiv.innerHTML = "";

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (!data || data.c === 0) {
      errorDiv.innerHTML = `<p>Data Not Found. Check the symbol.</p>`;
      resultDiv.innerHTML = "";
      return null;
    }

    const change = data.c - data.pc;
    const changePct = ((change / data.pc) * 100).toFixed(2) + "%";

    return {
      symbol: symbol,
      price: data.c.toFixed(2), 
      change: changePct        
    };

  } catch (error) {
    console.error(error);
    errorDiv.innerHTML = `<p>API not fetching. Try again.</p>`;
    resultDiv.innerHTML = "";
    return null;
  }
}

function displayStocks(stockList) {
  resultDiv.innerHTML = "";

  stockList.forEach(stock => {
    const div = document.createElement("div");
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

function showGainers() {
  const gainers = stocks.filter(stock => parseFloat(stock.change) > 0);
  displayStocks(gainers);
}

function showLosers() {
  const losers = stocks.filter(stock => parseFloat(stock.change) < 0);
  displayStocks(losers);
}