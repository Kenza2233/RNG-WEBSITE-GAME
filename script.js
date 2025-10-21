const stocksContainer = document.getElementById('stocks-container');
const fundsAmount = document.getElementById('funds-amount');
const portfolioValueEl = document.getElementById('portfolio-value');
const netWorthValueEl = document.getElementById('net-worth-value');
const marketEventNotificationEl = document.getElementById('market-event-notification');
const newsTickerTextEl = document.getElementById('news-ticker-text');
const creditScoreValueEl = document.getElementById('credit-score-value');
const interestRateValueEl = document.getElementById('interest-rate-value');
const loanAmountValueEl = document.getElementById('loan-amount-value');
const loanInputElement = document.getElementById('loan-input');
const applyLoanButton = document.getElementById('apply-loan-button');
const specialInvestmentsContainer = document.getElementById('special-investments-container');
const updateButton = document.getElementById('update-button');

let userFunds = 9000000;
let marketState = 'normal'; // can be 'normal', 'bull', or 'bear'
let creditScore = 700; // Starting credit score
let interestRate = 5.0; // Starting interest rate
let loanAmount = 0; // Starting loan amount
let activeInvestments = [];
const investmentOpportunities = [
    { id: 1, name: "Bon Kerajaan Jangka Pendek", cost: 50000, risk: "Rendah", returnRange: [1.02, 1.05], duration: 5 },
    { id: 2, name: "Dana Indeks Teknologi", cost: 100000, risk: "Sederhana", returnRange: [0.9, 1.2], duration: 10 },
    { id: 3, name: "Projek Pembangunan Hartanah", cost: 250000, risk: "Sederhana", returnRange: [0.85, 1.3], duration: 15 },
    { id: 4, name: "Ekspedisi Mencari Harta Karun", cost: 500000, risk: "Tinggi", returnRange: [0.1, 5.0], duration: 20 },
    { id: 5, name: "Membiayai 'Startup' Kecerdasan Buatan", cost: 750000, risk: "Sangat Tinggi", returnRange: [0.0, 10.0], duration: 25 }
];
let availableInvestments = [];

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
    const netWorth = userFunds + portfolioValue - loanAmount;

    fundsAmount.textContent = `RM${userFunds.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    portfolioValueEl.textContent = `RM${portfolioValue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    netWorthValueEl.textContent = `RM${netWorth.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    creditScoreValueEl.textContent = creditScore;
    interestRateValueEl.textContent = `${interestRate.toFixed(2)}%`;
    loanAmountValueEl.textContent = `RM${loanAmount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

    handleBankingEvents();
    handleInvestmentEvents();

    // Bonus Events RNG
    const bonusRNG = Math.random();
    if (bonusRNG < 0.01) { // 1% chance for inheritance
        const amount = Math.floor(Math.random() * 1000000) + 500000;
        userFunds += amount;
        alert(`🎉 Warisan Tak Terduga! Anda menerima warisan sebanyak RM${amount.toLocaleString()} daripada saudara jauh!`);
    } else if (bonusRNG < 0.03) { // 2% chance for lottery win
        const amount = Math.floor(Math.random() * 50000) + 10000;
        userFunds += amount;
        alert(`🎉 Tuah Nombor! Anda menemui tiket loteri yang menang bernilai RM${amount.toLocaleString()}!`);
    } else if (bonusRNG < 0.05) { // 2% chance for tax audit
        const penalty = Math.floor(Math.random() * 150000) + 50000;
        userFunds -= penalty;
        creditScore -= 20;
        alert(`🚨 Audit Cukai! Lembaga Hasil Dalam Negeri menemui penyelewengan dan anda dikenakan denda sebanyak RM${penalty.toLocaleString()}!`);
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

function handleBankingEvents() {
    // Interest Rate Fluctuation
    if (Math.random() < 0.1) { // 10% chance to change
        const change = (Math.random() * 1) - 0.5; // Fluctuate between -0.5% and +0.5%
        interestRate = Math.max(1.0, interestRate + change); // Minimum rate of 1.0%
    }

    // Credit Score Events
    if (Math.random() < 0.15) { // 15% chance
        const scoreChange = Math.floor(Math.random() * 20) + 10; // Change by 10-30 points
        if (Math.random() < 0.5) {
            creditScore += scoreChange;
            alert(`🌟 Berita Baik! Skor kredit anda meningkat sebanyak ${scoreChange} mata kerana pengurusan kewangan yang baik.`);
        } else {
            creditScore -= scoreChange;
            alert(`🚨 Amaran! Skor kredit anda menurun sebanyak ${scoreChange} mata kerana pembayaran lewat dikesan.`);
        }
        creditScore = Math.max(300, Math.min(850, creditScore)); // Clamp score between 300 and 850
    }

    // Banking Fees RNG
    if (Math.random() < 0.08) { // 8% chance
        const fee = Math.floor(Math.random() * 1000) + 500;
        userFunds -= fee;
        alert(`💸 Yuran Bank! Anda dikenakan bayaran sebanyak RM${fee.toLocaleString()} untuk yuran perkhidmatan.`);
    }

    // Loan Interest Payment
    if (loanAmount > 0) {
        const interestPayment = loanAmount * (interestRate / 100 / 12); // Monthly interest
        userFunds -= interestPayment;
        loanAmount += interestPayment; // Compound the interest for simplicity
        alert(`💸 Bayaran Faedah! RM${interestPayment.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} telah ditolak untuk faedah pinjaman.`);
    }
}

function displayInvestments() {
    specialInvestmentsContainer.innerHTML = '';
    availableInvestments.forEach(inv => {
        const invEl = document.createElement('div');
        invEl.classList.add('investment-opportunity');
        invEl.innerHTML = `
            <h4>${inv.name}</h4>
            <p><strong>Kos:</strong> RM${inv.cost.toLocaleString()}</p>
            <p><strong>Risiko:</strong> ${inv.risk}</p>
            <p><strong>Potensi Pulangan:</strong> ${inv.returnRange[0] * 100}% - ${inv.returnRange[1] * 100}%</p>
            <p><strong>Tempoh:</strong> ${inv.duration} Pusingan</p>
            <button data-id="${inv.id}">Labur</button>
        `;
        specialInvestmentsContainer.appendChild(invEl);
    });

    specialInvestmentsContainer.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const investmentId = parseInt(e.target.dataset.id, 10);
            const investment = availableInvestments.find(inv => inv.id === investmentId);
            if (investment && userFunds >= investment.cost) {
                userFunds -= investment.cost;
                activeInvestments.push({ ...investment, turnsRemaining: investment.duration });
                availableInvestments = availableInvestments.filter(inv => inv.id !== investmentId);
                alert(`Anda telah melabur RM${investment.cost.toLocaleString()} dalam ${investment.name}.`);
                displayInvestments();
                updateStats();
            } else {
                alert("Dana tidak mencukupi untuk pelaburan ini.");
            }
        });
    });
}

function handleInvestmentEvents() {
    // New Investment Slots
    if (Math.random() < 0.2 && availableInvestments.length < 3) { // 20% chance if less than 3 available
        const potentialInvestments = investmentOpportunities.filter(p => !availableInvestments.some(a => a.id === p.id));
        if (potentialInvestments.length > 0) {
            const newInvestment = potentialInvestments[Math.floor(Math.random() * potentialInvestments.length)];
            availableInvestments.push(newInvestment);
            displayInvestments();
        }
    }

    // Process matured investments
    const maturedInvestments = [];
    activeInvestments.forEach(inv => {
        inv.turnsRemaining -= 1;
        if (inv.turnsRemaining <= 0) {
            maturedInvestments.push(inv);
        }
    });

    maturedInvestments.forEach(inv => {
        const returnRate = Math.random() * (inv.returnRange[1] - inv.returnRange[0]) + inv.returnRange[0];
        const returnValue = inv.cost * returnRate;
        userFunds += returnValue;
        activeInvestments = activeInvestments.filter(a => a.id !== inv.id);
        alert(`✅ Pelaburan Matang! Pelaburan anda dalam "${inv.name}" telah memulangkan RM${returnValue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
    });
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

applyLoanButton.addEventListener('click', () => {
    const requestedAmount = parseInt(loanInputElement.value, 10);

    if (isNaN(requestedAmount) || requestedAmount <= 0) {
        alert("Sila masukkan jumlah pinjaman yang sah.");
        return;
    }

    // Loan Approval RNG: Probability based on credit score
    const approvalProbability = (creditScore - 300) / (850 - 300); // Scale score to 0-1 range
    const isApproved = Math.random() < approvalProbability;

    if (isApproved) {
        userFunds += requestedAmount;
        loanAmount += requestedAmount;
        alert(`🎉 Pinjaman Diluluskan! RM${requestedAmount.toLocaleString()} telah ditambahkan pada dana anda.`);
        updateStats();
    } else {
        creditScore -= 10; // Penalty for failed application
        alert(`😞 Pinjaman Ditolak. Permohonan pinjaman anda tidak berjaya. Skor kredit anda telah menurun sedikit.`);
        updateStats();
    }
    loanInputElement.value = ''; // Clear input
});


// Initial display
displayStocks();
displayInvestments();
updateStats();
