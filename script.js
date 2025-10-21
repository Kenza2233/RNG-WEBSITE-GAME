const stocksContainer = document.getElementById('stocks-container');
const fundsAmount = document.getElementById('funds-amount');
const updateButton = document.getElementById('update-button');

let userFunds = 9000000;

const stockNames = [
    // Teknologi & Digital
    "Neurobyte Corp.", "Celixion Technologies", "OrbiSoft Systems", "Vyntrix Dynamics", "Auralink Networks",
    "Q-Synapse Ltd.", "HexaNova Innovations", "ZentraTech Holdings", "ArcVane Cloudworks", "Lunaris Data Group",
    // Tenaga & Industri
    "Solarune Energy", "AetherFuel Dynamics", "Cryonix Power Solutions", "Ironcrest Industries", "Volterra Mechanics",
    "BlueCore Reactors", "TerraForge Mining Co.", "Hydrion Global", "Obsidian Works Ltd.", "PyraCell Energy Corp.",
    // Kewangan & Pelaburan
    "Merrix Capital", "NovaTrust Bank", "Ecliptic Holdings", "PrimeVast Securities", "Aurivest Finance",
    "Zephyr Mutuals", "ChronoCredit Group", "FalconEdge Investments", "Monetra Global", "Viridian Asset Co.",
    // Pertanian, Alam Sekitar & Bioteknologi
    "Greenveil BioLabs", "Florantis AgriTech", "BioArdent Sciences", "EdenCore Genetics", "NaturaSynth Organics",
    "TerraNova Growth", "BlueStem Biopharma", "SylvaGene Research", "EcoRite Solutions", "Aureflora Labs",
    // Automotif & Pengangkutan
    "Stratos Motors", "Aeronix Transit", "Velon Drive Systems", "OmniRail Corp.", "Zephair Aerospace",
    "Novion Mobility", "TitanRide Automotive", "AquaJet Marine Ltd.", "Quanta AeroTech", "Eclipta Logistics",
    // Hartanah & Pembinaan
    "Granvia Development", "Aurum Estates", "NovaHaven Realty", "SkyLoom Construction", "Crestfall Properties",
    "UrbanRise Builders", "TerraSpire Holdings", "PillarStone Projects", "ArcHaven Design Co.", "LuminaLand Group",
    // Media, Hiburan & Gaya Hidup
    "StarVale Studios", "EchoVerse Media", "VelvetRay Entertainment", "HarmonyWave Productions", "LuneCast Networks",
    "Aestora Fashion Group", "Dreamforge Music", "Cyntra Creative Co.", "PetalPixel Visuals", "Auroria Arts Ltd."
];

const stocks = stockNames.map((name, index) => ({
    id: index, // Add a unique ID for each stock
    name: name,
    percentage: 0,
    price: Math.random() * 450 + 50, // Random price between 50 and 500
    change: 0,
    owned: 0 // Number of shares owned by the player
}));

function displayStocks() {
    stocksContainer.innerHTML = '';
    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.classList.add('stock');

        const changeClass = stock.change >= 0 ? 'positive' : 'negative';

        stockElement.innerHTML = `
            <h2>${stock.name}</h2>
            <p class="owned">Dimiliki: ${stock.owned}</p>
            <p class="price">RM${stock.price.toFixed(2)}</p>
            <p class="change ${changeClass}">${stock.change.toFixed(2)}%</p>
            <div class="buy-controls">
                <input type="number" min="1" placeholder="Qty" id="buy-qty-${stock.id}">
                <button id="buy-btn-${stock.id}">Beli</button>
            </div>
        `;
        stocksContainer.appendChild(stockElement);

        document.getElementById(`buy-btn-${stock.id}`).addEventListener('click', () => {
            const quantity = parseInt(document.getElementById(`buy-qty-${stock.id}`).value, 10);
            if (!isNaN(quantity) && quantity > 0) {
                buyStock(stock.id, quantity);
            }
        });
    });
}

function displayFunds() {
    fundsAmount.textContent = `RM${userFunds.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function updateStockPrices() {
    stocks.forEach(stock => {
        // Makes the market more volatile (-15% to +13%) and slightly bearish.
        const change = (Math.random() * 28) - 15; // From -15 to +13
        stock.change = change;

        // Ensure price doesn't go below a certain threshold (e.g., $1.00)
        const newPrice = stock.price * (1 + change / 100);
        stock.price = Math.max(1.00, newPrice); // Floor price at 1.00

        stock.percentage += change;
    });
    displayStocks();
}

function buyStock(stockId, quantity) {
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;

    const totalCost = stock.price * quantity;

    if (userFunds >= totalCost) {
        userFunds -= totalCost;
        stock.owned += quantity;
        displayFunds();
        displayStocks(); // Refresh to update owned count and clear input
    } else {
        alert("Dana tidak mencukupi!");
    }
}

updateButton.addEventListener('click', () => {
    updateStockPrices();
    displayFunds();
});

// Initial display
displayStocks();
displayFunds();
