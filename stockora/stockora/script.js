const API_KEY = "53LP1X5AKNE2KIYG";

const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

searchBtn.addEventListener("click", () => {
  const symbol = document.getElementById("searchInput").value;
  getStockData(symbol);
});
async function getStockData(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    resultDiv.innerHTML = "Loading...";

    const response = await fetch(url);
    const data = await response.json();

    displayData(data);
  } catch (error) {
    resultDiv.innerHTML = "Error fetching data";
  }
}
function displayData(data) {
  const stock = data["Global Quote"];

  if (!stock || Object.keys(stock).length === 0) {
    resultDiv.innerHTML = "No data found";
    return;
  }

  const price = stock["05. price"];
  const change = stock["10. change percent"];

  resultDiv.innerHTML = `
    <p><strong>Price:</strong> $${price}</p>
    <p><strong>Change:</strong> ${change}</p>
  `;
}
