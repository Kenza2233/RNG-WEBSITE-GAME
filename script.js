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

const stocks = stockNames.map(name => ({
    name: name,
    percentage: 0,
    price: Math.random() * 450 + 50, // Harga rawak antara 50 dan 500
    change: 0
}));

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

function displayFunds() {
    fundsAmount.textContent = `RM${userFunds.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

updateButton.addEventListener('click', () => {
    updateStockPrices();
    displayFunds();
});

// Initial display
displayStocks();
displayFunds();
