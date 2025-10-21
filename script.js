const stocksContainer = document.getElementById('stocks-container');
const fundsAmount = document.getElementById('funds-amount');
const portfolioValueEl = document.getElementById('portfolio-value');
const netWorthValueEl = document.getElementById('net-worth-value');
const marketEventNotificationEl = document.getElementById('market-event-notification');
const newsTickerTextEl = document.getElementById('news-ticker-text');
const updateButton = document.getElementById('update-button');

let userFunds = 9000000;
let marketState = 'normal'; // can be 'normal', 'bull', or 'bear'

const economicNewsEvents = [
    {
        headline: "TERKINI: Kerajaan mengumumkan pakej rangsangan, meningkatkan keyakinan pelabur!",
        effect: () => {
            // Memberi sedikit rangsangan kepada semua harga saham
            stocks.forEach(stock => {
                stock.price *= (1 + (Math.random() * 0.02 + 0.01)); // Rangsangan 1-3%
            });
            marketState = 'bull'; // Boleh mencetuskan bull market mini
        }
    },
    {
        headline: "SKANDAL: Sebuah syarikat teknologi besar didapati melakukan penipuan, menggegarkan sektor teknologi!",
        effect: () => {
            // Memberi kesan negatif kepada 5 saham teknologi pertama
            for(let i = 0; i < 5; i++) {
                stocks[i].price *= (1 - (Math.random() * 0.05 + 0.05)); // Kejatuhan 5-10%
            }
        }
    },
    {
        headline: "INOVASI: Syarikat bioteknologi tempatan berjaya menghasilkan penemuan perubatan baharu!",
        effect: () => {
            // Memberi rangsangan besar kepada saham bioteknologi (indeks 30-39)
            for(let i = 30; i <= 39; i++) {
                stocks[i].price *= (1 + (Math.random() * 0.1 + 0.05)); // Rangsangan 5-15%
            }
        }
    },
    {
        headline: "KEGELISAHAN GLOBAL: Ketegangan perdagangan antarabangsa meningkat, menjejaskan pasaran.",
        effect: () => {
            // Kesan negatif kecil kepada semua saham
            stocks.forEach(stock => {
                stock.price *= (1 - (Math.random() * 0.03 + 0.01)); // Kejatuhan 1-4%
            });
            marketState = 'bear';
        }
    },
    {
        headline: "CUKAI TAK TERDUGA: Kerajaan mengenakan cukai keuntungan luar biasa ke atas syarikat tenaga.",
        effect: () => {
            // Memberi kesan negatif kepada saham tenaga (indeks 10-19)
             for(let i = 10; i <= 19; i++) {
                stocks[i].price *= (1 - (Math.random() * 0.08 + 0.04)); // Kejatuhan 4-12%
            }
        }
    }
];

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
                <input type="number" min="1" placeholder="Qty" id="buy-qty-${stock.id}" class="qty-input">
                <button id="buy-btn-${stock.id}">Beli</button>
            </div>
            <div class="sell-controls">
                <input type="number" min="1" placeholder="Qty" id="sell-qty-${stock.id}" class="qty-input">
                <button id="sell-btn-${stock.id}">Jual</button>
            </div>
        `;
        stocksContainer.appendChild(stockElement);

        document.getElementById(`buy-btn-${stock.id}`).addEventListener('click', () => {
            const quantityInput = document.getElementById(`buy-qty-${stock.id}`);
            const quantity = parseInt(quantityInput.value, 10);
            if (!isNaN(quantity) && quantity > 0) {
                buyStock(stock.id, quantity);
                quantityInput.value = ''; // Clear input
            }
        });

        document.getElementById(`sell-btn-${stock.id}`).addEventListener('click', () => {
            const quantityInput = document.getElementById(`sell-qty-${stock.id}`);
            const quantity = parseInt(quantityInput.value, 10);
            if (!isNaN(quantity) && quantity > 0) {
                sellStock(stock.id, quantity);
                quantityInput.value = ''; // Clear input
            }
        });
    });
}

function updateStats() {
    const portfolioValue = stocks.reduce((total, stock) => total + (stock.price * stock.owned), 0);
    const netWorth = userFunds + portfolioValue;

    fundsAmount.textContent = `RM${userFunds.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    portfolioValueEl.textContent = `RM${portfolioValue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    netWorthValueEl.textContent = `RM${netWorth.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function updateStockPrices() {
    // Economic News RNG
    if (Math.random() < 0.25) { // 25% chance of a news event
        const event = economicNewsEvents[Math.floor(Math.random() * economicNewsEvents.length)];
        event.effect();
        newsTickerTextEl.textContent = `BERITA EKONOMI: ${event.headline}`;
        // Force re-render of animation
        newsTickerTextEl.style.animation = 'none';
        newsTickerTextEl.offsetHeight; /* trigger reflow */
        newsTickerTextEl.style.animation = null;
    }


    // Random Event: Chance for a cash injection
    if (Math.random() < 0.1) { // 10% chance
        const sources = ["Kerajaan", "Syarikat Teknologi Terkemuka", "Pelabur Antarabangsa"];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const amount = Math.floor(Math.random() * 500000) + 100000; // 100k to 600k
        userFunds += amount;
        alert(`🎉 Berita Baik! Anda menerima suntikan dana sebanyak RM${amount.toLocaleString()} daripada ${source}!`);
    }

    // Market Event RNG
    const marketRNG = Math.random();
    if (marketRNG < 0.2) { // 20% chance of a bull market
        marketState = 'bull';
        marketEventNotificationEl.textContent = '📈 PASARAN NAIK! Sentimen pelabur positif.';
        marketEventNotificationEl.className = 'bull-market';
        marketEventNotificationEl.style.display = 'block';
    } else if (marketRNG < 0.4) { // 20% chance of a bear market
        marketState = 'bear';
        marketEventNotificationEl.textContent = '📉 PASARAN TURUN! Sentimen pelabur negatif.';
        marketEventNotificationEl.className = 'bear-market';
        marketEventNotificationEl.style.display = 'block';
    } else {
        marketState = 'normal';
        marketEventNotificationEl.style.display = 'none';
    }

    // Dividend RNG
    stocks.forEach(stock => {
        if (stock.owned > 0 && Math.random() < 0.05) { // 5% chance for dividend per owned stock
            const dividendYield = Math.random() * 0.02 + 0.01; // 1% to 3% dividend
            const dividendAmount = stock.price * stock.owned * dividendYield;
            userFunds += dividendAmount;
            alert(`💰 Dividen! ${stock.name} membayar dividen sebanyak RM${dividendAmount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`);
        }
    });

    stocks.forEach(stock => {
        // Stock Price Generator: Fluktuasi harga saham acak (±5-15%)
        let magnitude = Math.random() * 10 + 5; // 5 to 15
        let sign = Math.random() < 0.5 ? -1 : 1;

        // Adjust for market state
        if (marketState === 'bull') {
            sign = Math.random() < 0.7 ? 1 : -1; // 70% chance of price increase
        } else if (marketState === 'bear') {
            sign = Math.random() < 0.7 ? -1 : 1; // 70% chance of price decrease
        }

        const change = magnitude * sign;
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
        updateStats();
        displayStocks(); // Refresh to update owned count and clear input
    } else {
        alert("Dana tidak mencukupi!");
    }
}

function sellStock(stockId, quantity) {
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;

    if (stock.owned >= quantity) {
        const totalCredit = stock.price * quantity;
        userFunds += totalCredit;
        stock.owned -= quantity;
        updateStats(); // Use updateStats to refresh everything
        displayStocks(); // Refresh to update owned count and clear input
    } else {
        alert("Anda tidak mempunyai saham yang mencukupi untuk dijual!");
    }
}

updateButton.addEventListener('click', () => {
    updateStockPrices();
    updateStats();
});

// Initial display
displayStocks();
updateStats();
