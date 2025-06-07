// --- DOM Elements ---
const ageDisplay = document.getElementById('ageDisplay');
const lifeStageDisplay = document.getElementById('lifeStageDisplay');
const happinessStat = document.getElementById('happinessStat');
const healthStat = document.getElementById('healthStat');
const smartsStat = document.getElementById('smartsStat');
const moneyStat = document.getElementById('moneyStat');
const charismaStat = document.getElementById('charismaStat');

const advanceTimeButton = document.getElementById('advanceTimeButton');
const studyButton = document.getElementById('studyButton');
const workButton = document.getElementById('workButton');
const socializeButton = document.getElementById('socializeButton');

const eventDisplay = document.querySelector('.event-display');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const eventChoices = document.getElementById('eventChoices');

// Get the main game sections to hide/show
const statsDisplay = document.querySelector('.stats-grid'); // Changed from .stats-display
const actionButtonsContainer = document.querySelector('.action-buttons'); // The container for Study, Work, Socialize
const mainAdvanceButton = document.getElementById('advanceTimeButton'); // The main advance time button

// --- Game State ---
let player = {
    age: 0,
    lifeStage: 'Birth',
    happiness: 100,
    health: 100,
    smarts: 50,
    money: 0,
    charisma: 50,
    // Add a month counter to track detailed age progression
    months: 0
};

// --- Game Settings / Constants ---
const LIFE_STAGES = {
    'Birth': { minAge: 0, maxMonths: 60, nextStage: 'Childhood' }, // 0-5 years
    'Childhood': { minAge: 5, maxMonths: 144, nextStage: 'Teenager' }, // 5-12 years
    'Teenager': { minAge: 12, maxMonths: 216, nextStage: 'Young Adult' }, // 12-18 years
    'Young Adult': { minAge: 18, maxMonths: 360, nextStage: 'Adult' }, // 18-30 years
    'Adult': { minAge: 30, maxMonths: 720, nextStage: 'Elderly' }, // 30-60 years
    'Elderly': { minAge: 60, maxMonths: Infinity, nextStage: null } // 60+ years
};

// --- Events (More complex structure for choices) ---
const EVENTS = [
    {
        title: "A Stray Cat Appears!",
        description: "A cute, fluffy cat wanders into your path. It looks hungry and lonely.",
        choices: [
            {
                text: "Pet the cat (Happiness +10)",
                consequence: () => {
                    player.happiness += 10;
                    updateStatsDisplay();
                    return "The cat purrs happily. You feel a warmth in your heart.";
                },
                statChecks: [] // No stat checks needed for this choice
            },
            {
                text: "Ignore it (No effect)",
                consequence: () => {
                    return "You walk past the cat. It continues on its way.";
                },
                statChecks: []
            },
            {
                text: "Give it some food (Money -5, Happiness +15)",
                consequence: () => {
                    if (player.money >= 5) {
                        player.money -= 5;
                        player.happiness += 15;
                        updateStatsDisplay();
                        return "The cat devours the food and looks at you gratefully. You feel wonderful!";
                    } else {
                        return "You don't have enough money to feed the cat. You feel a pang of sadness.";
                    }
                },
                statChecks: [{ stat: 'money', threshold: 5, type: 'min' }]
            }
        ]
    },
    {
        title: "Unexpected Pop Quiz!",
        description: "Your teacher announces a surprise pop quiz. Your mind races.",
        choices: [
            {
                text: "Try your best (Smarts check)",
                consequence: () => {
                    if (player.smarts >= 60) {
                        player.smarts += 5;
                        player.happiness += 5;
                        return "You ace the quiz! Your smarts and confidence grow.";
                    } else {
                        player.smarts -= 5;
                        player.happiness -= 10;
                        return "You struggled with the quiz. It was a tough one, but you learned a lesson.";
                    }
                },
                statChecks: [{ stat: 'smarts', threshold: 60, type: 'check' }]
            },
            {
                text: "Pretend to be sick (Health -5)",
                consequence: () => {
                    player.health -= 5;
                    player.happiness -= 5; // A bit of guilt
                    updateStatsDisplay();
                    return "You fake a cough and get sent home. You avoided the quiz, but feel a bit unwell.";
                },
                statChecks: []
            }
        ]
    },
    {
        title: "Community Service Opportunity",
        description: "There's a local park cleanup organized. It's a chance to help out.",
        choices: [
            {
                text: "Join the cleanup (Charisma +10, Health +5)",
                consequence: () => {
                    player.charisma += 10;
                    player.health += 5;
                    player.happiness += 5;
                    updateStatsDisplay();
                    return "You contributed to cleaning the park. You met new people and feel great!";
                },
                statChecks: []
            },
            {
                text: "Stay home and relax (No effect)",
                consequence: () => {
                    return "You decide to relax at home. Sometimes a quiet day is best.";
                },
                statChecks: []
            }
        ]
    }
];


// --- Functions ---
function updateStatsDisplay() {
    ageDisplay.textContent = player.age;
    lifeStageDisplay.textContent = player.lifeStage;
    // Apply Math.floor() for clean integers, strictly no decimals
    happinessStat.textContent = Math.floor(player.happiness);
    healthStat.textContent = Math.floor(player.health);
    smartsStat.textContent = Math.floor(player.smarts);
    moneyStat.textContent = Math.floor(player.money);
    charismaStat.textContent = Math.floor(player.charisma);
}

function advanceTime(months = 1) {
    player.months += months;
    player.age = Math.floor(player.months / 12); // 12 months in a year

    // Update life stage
    let currentStageName = player.lifeStage;
    let currentStage = LIFE_STAGES[currentStageName];

    if (player.months >= currentStage.maxMonths && currentStage.nextStage) {
        player.lifeStage = currentStage.nextStage;
    }

    // Basic stat decay/changes per month/year (adjust as needed)
    // Example: Health slowly decreases with age
    if (player.age >= 18) { // Start health decline in adulthood
        player.health = Math.max(0, player.health - 0.1 * months); // Gradual decline
    }
    // Happiness might fluctuate
    player.happiness = Math.min(100, Math.max(0, player.happiness - 0.05 * months));

    // Ensure stats don't go below 0 or above 100 (except money)
    player.happiness = Math.min(100, Math.max(0, player.happiness));
    player.health = Math.min(100, Math.max(0, player.health));
    player.smarts = Math.min(100, Math.max(0, player.smarts));
    player.charisma = Math.min(100, Math.max(0, player.charisma));

    updateStatsDisplay();
    checkGameEndConditions(); // Check for game over
    maybeTriggerEvent(); // Check for events after time advances
}

function checkGameEndConditions() {
    if (player.health <= 0) {
        triggerGameOver("Your health has dwindled to nothing. Game Over!");
    } else if (player.happiness <= 0 && player.age >= 18) { // Can't be unhappy and a baby
        triggerGameOver("Life became too overwhelming, and your happiness reached rock bottom. Game Over!");
    }
    // Add more conditions as needed (e.g., old age, bankruptcy)
}

function triggerGameOver(message) {
    eventDisplay.style.display = 'block';
    eventTitle.textContent = "Game Over!";
    eventDescription.innerHTML = `${message}<br><br>You lived for ${player.age} years.`;
    eventChoices.innerHTML = `<button class="new-game-button">Play Again?</button>`;

    // Hide main game UI
    statsDisplay.style.display = 'none';
    actionButtonsContainer.style.display = 'none';
    mainAdvanceButton.style.display = 'none';

    document.querySelector('.new-game-button').addEventListener('click', resetGame);
}

function resetGame() {
    player = {
        age: 0,
        lifeStage: 'Birth',
        happiness: 100,
        health: 100,
        smarts: 50,
        money: 0,
        charisma: 50,
        months: 0 // Reset months as well
    };
    updateStatsDisplay();

    // Show main game UI again
    statsDisplay.style.display = 'grid'; // Re-show as grid
    actionButtonsContainer.style.display = 'flex'; // Re-show as flex column
    mainAdvanceButton.style.display = 'block';

    eventDisplay.style.display = 'none'; // Hide event display
}

function maybeTriggerEvent() {
    // Only trigger events if an event is NOT currently displayed
    if (eventDisplay.style.display === 'none' && Math.random() < 0.25) { // 25% chance of an event each month
        const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        displayEvent(randomEvent);
    }
}

function displayEvent(event) {
    // Hide main game UI to focus on the event
    statsDisplay.style.display = 'none';
    actionButtonsContainer.style.display = 'none';
    mainAdvanceButton.style.display = 'none';

    eventDisplay.style.display = 'block';
    eventTitle.textContent = event.title;
    eventDescription.textContent = event.description;
    eventChoices.innerHTML = ''; // Clear previous choices

    event.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.classList.add('event-choice-button');
        button.textContent = choice.text;

       // Handle disabling and basic text for stat checks
if (choice.statChecks && choice.statChecks.length > 0) {
    choice.statChecks.forEach(check => {
        if (check.type === 'min' && player[check.stat] < check.threshold) {
            button.disabled = true; // Disable if player doesn't meet minimum
            button.textContent += ` (Requires ${check.stat} ${check.threshold})`;
            button.style.backgroundColor = 'var(--button-disabled-bg)';
            button.style.color = 'var(--button-disabled-text)';
        }
        // For 'check' type, we won't add text directly to the button for now to avoid complexity
        // The consequence function itself will handle the result message
    });
}
// The button's initial text is already set above


        button.addEventListener('click', () => {
            // Execute consequence and get the result message
            const resultMessage = choice.consequence();
            eventDescription.innerHTML = event.description + `<br><br><b>${resultMessage}</b>`; // Append result
            eventChoices.innerHTML = '<button class="event-continue-button">Continue</button>'; // Change to continue button

            document.querySelector('.event-continue-button').addEventListener('click', hideEvent);
        });
        eventChoices.appendChild(button);
    });
}

function hideEvent() {
    eventDisplay.style.display = 'none'; // Hide event display
    // Show main game UI again
    statsDisplay.style.display = 'flex'; // Use flex now as per new CSS
    actionButtonsContainer.style.display = 'flex';
    mainAdvanceButton.style.display = 'block';
}

// --- Event Listeners ---
advanceTimeButton.addEventListener('click', () => advanceTime(1)); // Advance by 1 month
studyButton.addEventListener('click', () => {
    player.smarts = Math.min(100, player.smarts + 5);
    player.happiness = Math.max(0, player.happiness - 2); // Study can be tiring!
    updateStatsDisplay();
    advanceTime(1); // Advance time when studying
});

workButton.addEventListener('click', () => {
    // Money gain scales with smarts/charisma
    const moneyGain = Math.floor(5 + player.smarts / 10 + player.charisma / 10);
    player.money += moneyGain;
    player.happiness = Math.max(0, player.happiness - 5); // Work can be draining!
    player.health = Math.max(0, player.health - 2); // Work can be tiring!
    updateStatsDisplay();
    advanceTime(1); // Advance time when working
});

socializeButton.addEventListener('click', () => {
    player.charisma = Math.min(100, player.charisma + 5);
    player.happiness = Math.min(100, player.happiness + 5); // Socializing is fun!
    updateStatsDisplay();
    advanceTime(1); // Advance time when socializing
});

// Initial setup
updateStatsDisplay();
