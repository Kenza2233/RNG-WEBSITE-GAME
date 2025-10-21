
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
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
    const navLinks = document.querySelectorAll('.app-sidebar nav a, .mobile-nav a');
    const views = document.querySelectorAll('#market-view, #portfolio-view, #bank-view, #stats-view, #leaderboard-view');
    const leaderboardContainer = document.getElementById('leaderboard-container');

    // --- Leaderboard Data ---
    const aiCompetitors = [
        { name: "Warren Buffet Jr.", netWorth: 15000000, strategy: 'value' },
        { name: "Cathie Wood 2.0", netWorth: 8000000, strategy: 'growth' },
        { name: "George Soros Clone", netWorth: 12000000, strategy: 'macro' },
        { name: "Jim Simons Bot", netWorth: 20000000, strategy: 'quant' }
    ];

    // --- Game State Variables ---
    let userFunds = 9000000;
    let lastUserFunds = userFunds;
    let lastPortfolioValue = 0;
    let lastNetWorth = userFunds;
    let marketState = 'normal';
    let creditScore = 700;
    let interestRate = 5.0;
    let loanAmount = 0;
    let activeInvestments = [];
    let availableInvestments = [];

    // --- Chaos Theory Price Engine ---
    class ChaosTheoryPriceEngine {
        constructor() {
            // Initial conditions for the Lorenz attractor
            this.lorenzState = { x: 0.1, y: 1.0, z: 1.05 };
            this.lorenzParams = { sigma: 10, rho: 28, beta: 8 / 3 };
            this.logistic_r = 3.999; // Parameter for logistic map
        }

        // Generate a price multiplier using the Lorenz attractor
        lorenz_attractor_price(dt = 0.01) {
            const { x, y, z } = this.lorenzState;
            const { sigma, rho, beta } = this.lorenzParams;

            const dx = sigma * (y - x);
            const dy = x * (rho - z) - y;
            const dz = x * y - beta * z;

            this.lorenzState.x += dx * dt;
            this.lorenzState.y += dy * dt;
            this.lorenzState.z += dz * dt;

            // Use the derivative to create a price multiplier.
            // The 0.001 is a scaling factor to keep changes reasonable.
            return 1 + (dx * 0.001);
        }

        // A simple logistic map function for additional chaos
        logistic_map(p) {
            return this.logistic_r * p * (1 - p);
        }
    }
    const priceEngine = new ChaosTheoryPriceEngine();

    // --- Heisenberg Uncertainty Engine ---
    const assetObservations = new Map(); // Tracks player observations of assets

    // --- Data ---
    const investmentOpportunities = [
        { id: 1, name: "Bon Kerajaan Jangka Pendek", cost: 50000, risk: "Rendah", returnRange: [1.02, 1.05], duration: 5 },
        { id: 2, name: "Dana Indeks Teknologi", cost: 100000, risk: "Sederhana", returnRange: [0.9, 1.2], duration: 10 },
        { id: 3, name: "Projek Pembangunan Hartanah", cost: 250000, risk: "Sederhana", returnRange: [0.85, 1.3], duration: 15 },
        { id: 4, name: "Ekspedisi Mencari Harta Karun", cost: 500000, risk: "Tinggi", returnRange: [0.1, 5.0], duration: 20 },
        { id: 5, name: "Membiayai 'Startup' Kecerdasan Buatan", cost: 750000, risk: "Sangat Tinggi", returnRange: [0.0, 10.0], duration: 25 }
    ];
    const economicNewsEvents = [
        {
            headline: "TERKINI: Kerajaan mengumumkan pakej rangsangan, meningkatkan keyakinan pelabur!",
            effect: () => {
                stocks.forEach(stock => { stock.price *= (1 + (Math.random() * 0.02 + 0.01)); });
                marketState = 'bull';
            }
        },
        {
            headline: "SKANDAL: Sebuah syarikat teknologi besar didapati melakukan penipuan, menggegarkan sektor teknologi!",
            effect: () => {
                for(let i = 0; i < 5; i++) { stocks[i].price *= (1 - (Math.random() * 0.05 + 0.05)); }
            }
        },
        {
            headline: "INOVASI: Syarikat bioteknologi tempatan berjaya menghasilkan penemuan perubatan baharu!",
            effect: () => {
                for(let i = 30; i <= 39; i++) { stocks[i].price *= (1 + (Math.random() * 0.1 + 0.05)); }
            }
        },
    ];
    const stockNames = [
        "Neurobyte Corp.", "Celixion Technologies", "OrbiSoft Systems", "Vyntrix Dynamics", "Auralink Networks",
        "Q-Synapse Ltd.", "HexaNova Innovations", "ZentraTech Holdings", "ArcVane Cloudworks", "Lunaris Data Group",
        "Solarune Energy", "AetherFuel Dynamics", "Cryonix Power Solutions", "Ironcrest Industries", "Volterra Mechanics",
        "BlueCore Reactors", "TerraForge Mining Co.", "Hydrion Global", "Obsidian Works Ltd.", "PyraCell Energy Corp.",
        "Merrix Capital", "NovaTrust Bank", "Ecliptic Holdings", "PrimeVast Securities", "Aurivest Finance",
        "Zephyr Mutuals", "ChronoCredit Group", "FalconEdge Investments", "Monetra Global", "Viridian Asset Co.",
        "Greenveil BioLabs", "Florantis AgriTech", "BioArdent Sciences", "EdenCore Genetics", "NaturaSynth Organics",
        "TerraNova Growth", "BlueStem Biopharma", "SylvaGene Research", "EcoRite Solutions", "Aureflora Labs",
        "Stratos Motors", "Aeronix Transit", "Velon Drive Systems", "OmniRail Corp.", "Zephair Aerospace",
        "Novion Mobility", "TitanRide Automotive", "AquaJet Marine Ltd.", "Quanta AeroTech", "Eclipta Logistics",
        "Granvia Development", "Aurum Estates", "NovaHaven Realty", "SkyLoom Construction", "Crestfall Properties",
        "UrbanRise Builders", "TerraSpire Holdings", "PillarStone Projects", "ArcHaven Design Co.", "LuminaLand Group",
        "StarVale Studios", "EchoVerse Media", "VelvetRay Entertainment", "HarmonyWave Productions", "LuneCast Networks",
        "Aestora Fashion Group", "Dreamforge Music", "Cyntra Creative Co.", "PetalPixel Visuals", "Auroria Arts Ltd."
    ];
    const stocks = stockNames.map((name, index) => ({
        id: index,
        name,
        price: Math.random() * 450 + 50,
        change: 0,
        owned: 0,
        // Heisenberg properties
        superposition: {
            bullish: Math.random(),
            bearish: Math.random(),
            neutral: Math.random(),
        },
        isObserved: false
    }));

    // --- UI Functions ---
    function animateValue(element, start, end, isCurrency) { /* ... same as before ... */ }
    function displayStocks() {
        stocksContainer.innerHTML = '';
        stocks.forEach(stock => {
            const stockElement = document.createElement('div');
            stockElement.classList.add('stock');
            const changeClass = stock.change >= 0 ? 'positive' : 'negative';

            stockElement.addEventListener('click', (e) => {
                // We only count an observation if the user clicks on the card itself,
                // not the buttons or inputs inside it.
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                    const observations = assetObservations.get(stock.id) || [];
                    observations.push(Date.now());
                    assetObservations.set(stock.id, observations);
                    // Add a visual indicator that the stock has been observed
                    stockElement.classList.add('observed');
                    setTimeout(() => stockElement.classList.remove('observed'), 500);
                }
            });

            stockElement.innerHTML = `
                <h2>${stock.name}</h2>
                <p class="owned">Dimiliki: ${stock.owned}</p>
                <p class="price">RM${stock.price.toFixed(2)}</p>
                <p class="change ${changeClass}">${stock.change.toFixed(2)}%</p>
                <div class="buy-controls">
                    <input type="number" min="1" placeholder="Qty" id="buy-qty-${stock.id}">
                    <button id="buy-btn-${stock.id}">Beli</button>
                </div>
                <div class="sell-controls">
                    <input type="number" min="1" placeholder="Qty" id="sell-qty-${stock.id}">
                    <button id="sell-btn-${stock.id}">Jual</button>
                </div>
            `;
            stocksContainer.appendChild(stockElement);
            document.getElementById(`buy-btn-${stock.id}`).addEventListener('click', (e) => { e.stopPropagation(); buyStock(stock.id, document.getElementById(`buy-qty-${stock.id}`).value); });
            document.getElementById(`sell-btn-${stock.id}`).addEventListener('click', (e) => { e.stopPropagation(); sellStock(stock.id, document.getElementById(`sell-qty-${stock.id}`).value); });
        });
    }

    function updateStats() {
        const portfolioValue = stocks.reduce((total, stock) => total + (stock.price * stock.owned), 0);
        const netWorth = userFunds + portfolioValue - loanAmount;
        animateValue(fundsAmount, lastUserFunds, userFunds, true);
        animateValue(portfolioValueEl, lastPortfolioValue, portfolioValue, true);
        animateValue(netWorthValueEl, lastNetWorth, netWorth, true);
        lastUserFunds = userFunds;
        lastPortfolioValue = portfolioValue;
        lastNetWorth = netWorth;
        creditScoreValueEl.textContent = creditScore;
        interestRateValueEl.textContent = `${interestRate.toFixed(2)}%`;
        loanAmountValueEl.textContent = `RM${loanAmount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function updateLeaderboard() {
        // Simulate AI competitors' net worth changes
        aiCompetitors.forEach(ai => {
            const changePercentage = (Math.random() - 0.45) * 0.1; // AI can win or lose up to 5%
            ai.netWorth *= (1 + changePercentage);
        });

        const playerNetWorth = lastNetWorth;
        const allPlayers = [
            { name: "Anda", netWorth: playerNetWorth },
            ...aiCompetitors
        ];

        allPlayers.sort((a, b) => b.netWorth - a.netWorth);

        let tableHTML = `<table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Kedudukan</th>
                    <th>Nama</th>
                    <th>Nilai Bersih</th>
                </tr>
            </thead>
            <tbody>`;

        allPlayers.forEach((player, index) => {
            const isPlayer = player.name === "Anda";
            tableHTML += `
                <tr class="${isPlayer ? 'player-row' : ''}">
                    <td>${index + 1}</td>
                    <td>${player.name}</td>
                    <td>RM${player.netWorth.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        leaderboardContainer.innerHTML = tableHTML;
    }


    function handleMarketAndStockEvents() {
        // News, Market State, and Dividend logic remains here...

        // --- NEW Price Update Logic using Chaos Theory Engine ---
        stocks.forEach(stock => {
            // Get the base multiplier from the Lorenz attractor
            let priceMultiplier = priceEngine.lorenz_attractor_price();

            // Add a tiny random perturbation (the "butterfly effect")
            priceMultiplier += (Math.random() - 0.5) * 0.01;

            // Adjust for market state (bull/bear markets still have an influence)
            if (marketState === 'bull') {
                priceMultiplier += 0.01;
            } else if (marketState === 'bear') {
                priceMultiplier -= 0.01;
            }

            const oldPrice = stock.price;
            const newPrice = Math.max(1.00, oldPrice * priceMultiplier);
            stock.price = newPrice;
            stock.change = ((newPrice - oldPrice) / oldPrice) * 100;
        });
    }

    function handleBankingEvents() {
        if (Math.random() < 0.1) { interestRate = Math.max(1.0, interestRate + (Math.random() - 0.5)); }
        if (Math.random() < 0.15) {
            const scoreChange = Math.floor(Math.random() * 20) + 10;
            creditScore += (Math.random() < 0.5 ? scoreChange : -scoreChange);
            creditScore = Math.max(300, Math.min(850, creditScore));
        }
        if (Math.random() < 0.08) { userFunds -= Math.floor(Math.random() * 500) + 500; }
        if (loanAmount > 0) {
            const interestPayment = loanAmount * (interestRate / 100 / 12);
            userFunds -= interestPayment;
        }
    }

    function handleInvestmentEvents() {
        if (Math.random() < 0.2 && availableInvestments.length < 3) {
            const potential = investmentOpportunities.filter(p => !availableInvestments.some(a => a.id === p.id));
            if (potential.length > 0) availableInvestments.push(potential[Math.floor(Math.random() * potential.length)]);
        }
        activeInvestments.forEach(inv => {
            inv.turnsRemaining -= 1;
            if (inv.turnsRemaining <= 0) {
                const returnRate = Math.random() * (inv.returnRange[1] - inv.returnRange[0]) + inv.returnRange[0];
                const returnValue = inv.cost * returnRate;
                userFunds += returnValue;
                alert(`✅ Pelaburan Matang! "${inv.name}" memulangkan RM${returnValue.toFixed(2)}.`);
            }
        });
        activeInvestments = activeInvestments.filter(inv => inv.turnsRemaining > 0);
    }

    function handleHeisenbergUncertainty() {
        stocks.forEach(stock => {
            // Check for over-observation
            const observations = assetObservations.get(stock.id) || [];
            if (observations.length > 2) { // Collapse if observed more than twice recently
                const { bullish, bearish, neutral } = stock.superposition;
                const totalProb = bullish + bearish + neutral;
                const outcome = Math.random() * totalProb;

                let collapseMultiplier = 1.0;
                if (outcome < bullish) {
                    collapseMultiplier = 1 + (Math.random() * 0.15 + 0.05); // Strong jump 5-20%
                    alert(`Quantum Collapse! Your observation of ${stock.name} caused a bullish surge!`);
                } else if (outcome < bullish + bearish) {
                    collapseMultiplier = 1 - (Math.random() * 0.15 + 0.05); // Strong crash 5-20%
                    alert(`Quantum Collapse! Your observation of ${stock.name} caused a bearish dive!`);
                } else {
                     alert(`Quantum Collapse! ${stock.name} stabilized unexpectedly after your observation.`);
                }
                stock.price *= collapseMultiplier;
                assetObservations.set(stock.id, []); // Reset observations after collapse
            }

            // Randomly reset superposition states to keep the market fresh
            if(Math.random() < 0.1) {
                stock.superposition = { bullish: Math.random(), bearish: Math.random(), neutral: Math.random() };
            }
        });
    }

    // --- Core Game Logic ---
    function nextRound() {
        handleMarketAndStockEvents();
        handleBankingEvents();
        handleInvestmentEvents();
        handleBonusEvents();
        handleHeisenbergUncertainty(); // Add the new logic to the game loop
        updateStats();
        updateLeaderboard(); // Update the leaderboard each round
        displayStocks();
        displayInvestments();
    }

    function handleBonusEvents() {
        const bonusRNG = Math.random();
        if (bonusRNG < 0.005) { // 0.5% chance for inheritance (was 1%)
            const amount = Math.floor(Math.random() * 1000000) + 500000;
            userFunds += amount;
            alert(`🎉 Warisan Tak Terduga! Anda menerima warisan sebanyak RM${amount.toLocaleString()}!`);
        } else if (bonusRNG < 0.015) { // 1% chance for lottery win (was 2%)
            const amount = Math.floor(Math.random() * 50000) + 10000;
            userFunds += amount;
            alert(`🎉 Tuah Nombor! Anda menemui tiket loteri yang menang bernilai RM${amount.toLocaleString()}!`);
        } else if (bonusRNG < 0.03) { // 1.5% chance for tax audit (was 2%)
            const penalty = Math.floor(Math.random() * 150000) + 50000;
            userFunds -= penalty;
            creditScore -= 20;
            alert(`🚨 Audit Cukai! Lembaga Hasil Dalam Negeri menemui penyelewengan dan anda dikenakan denda sebanyak RM${penalty.toLocaleString()}!`);
        }
    }

    function displayInvestments() {
        specialInvestmentsContainer.innerHTML = '';
        availableInvestments.forEach(inv => {
            const invEl = document.createElement('div');
            invEl.classList.add('investment-opportunity'); // Add a class for styling
            invEl.innerHTML = `<h4>${inv.name}</h4><p>Kos: RM${inv.cost.toLocaleString()}</p><p>Risiko: ${inv.risk}</p><button data-id="${inv.id}">Labur</button>`;
            specialInvestmentsContainer.appendChild(invEl);
        });
        specialInvestmentsContainer.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const invId = parseInt(e.target.dataset.id, 10);
                const investment = availableInvestments.find(i => i.id === invId);
                if (investment && userFunds >= investment.cost) {
                    userFunds -= investment.cost;
                    activeInvestments.push({ ...investment, turnsRemaining: investment.duration });
                    availableInvestments = availableInvestments.filter(i => i.id !== invId);
                    updateStats();
                    displayInvestments();
                } else { alert("Dana tidak mencukupi."); }
            });
        });
    }

    function buyStock(stockId, quantityStr) { /* ... same as before ... */ }
    function sellStock(stockId, quantityStr) { /* ... same as before ... */ }

    // --- Navigation ---
    function showView(targetId) { /* ... same as before ... */ }
    navLinks.forEach(link => { /* ... same as before ... */ });

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => { if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); updateButton.click(); } });

    // --- Event Listeners ---
    updateButton.addEventListener('click', nextRound);

    applyLoanButton.addEventListener('click', () => {
        const requestedAmount = parseInt(loanInputElement.value, 10);
        if (isNaN(requestedAmount) || requestedAmount <= 0) return alert("Sila masukkan jumlah pinjaman yang sah.");

        const approvalProbability = (creditScore - 300) / 550;
        if (Math.random() < approvalProbability) {
            userFunds += requestedAmount;
            loanAmount += requestedAmount;
            alert(`🎉 Pinjaman Diluluskan! RM${requestedAmount.toLocaleString()} telah ditambahkan.`);
        } else {
            creditScore -= 10;
            alert(`😞 Pinjaman Ditolak. Permohonan anda tidak berjaya.`);
        }
        loanInputElement.value = '';
        updateStats();
    });

    // --- Initialisation ---
    showView('market-view');
    displayStocks();
    displayInvestments();
    updateStats();
});
