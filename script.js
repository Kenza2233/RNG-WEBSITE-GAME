const stocksContainer = document.getElementById('stocks-container');
const updateButton = document.getElementById('update-button');

const stocks = [
    { name: 'Syarikat A', percentage: 0, price: 100.00, change: 0 },
    { name: 'Syarikat B', percentage: 0, price: 150.00, change: 0 },
    { name: 'Syarikat C', percentage: 0, price: 200.00, change: 0 },
    { name: 'Syarikat D', percentage: 0, price: 50.00, change: 0 },
];

function displayStocks() {
    stocksContainer.innerHTML = '';
    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.classList.add('stock');

        const changeClass = stock.change >= 0 ? 'positive' : 'negative';

        stockElement.innerHTML = `
            <h2>${stock.name}</h2>
            <p>Peratus Saham: ${stock.percentage.toFixed(2)}%</p>
            <p class="price">RM${stock.price.toFixed(2)}</p>
            <p class="change ${changeClass}">${stock.change.toFixed(2)}%</p>
        `;
        stocksContainer.appendChild(stockElement);
    });
}

function updateStockPrices() {
    stocks.forEach(stock => {
        const change = (Math.random() - 0.5) * 10; // Random change between -5% and 5%
        stock.change = change;
        stock.price *= (1 + change / 100);
        stock.percentage += change;
    });
    displayStocks();
}

updateButton.addEventListener('click', updateStockPrices);

// Initial display
displayStocks();
