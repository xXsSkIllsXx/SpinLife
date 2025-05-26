// --- Player Stats ---
let player = {
    age: 0,
    happiness: 100,
    health: 100,
    smarts: 50,
    money: 0
};

// --- DOM Elements (References to HTML elements) ---
const ageDisplay = document.getElementById('ageDisplay');
const happinessStat = document.getElementById('happinessStat');
const healthStat = document.getElementById('healthStat');
const smartsStat = document.getElementById('smartsStat');
const moneyStat = document.getElementById('moneyStat');
const advanceTimeButton = document.getElementById('advanceTimeButton');

// NEW: References to our new action buttons
const studyButton = document.getElementById('studyButton');
const workButton = document.getElementById('workButton');

// NEW: References for the event display area
const eventDisplay = document.querySelector('.event-display'); // Use querySelector for class
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const eventChoices = document.getElementById('eventChoices');


// --- Core Game Functions ---

function initializeGame() {
    player.age = 0;
    player.happiness = 100;
    player.health = 100;
    player.smarts = 50;
    player.money = 0;
    console.log("Game initialized. Player stats:", player);
    updateStatDisplay();
    hideEventDisplay(); // Ensure event display is hidden at start
}

function updateStatDisplay() {
    ageDisplay.textContent = player.age;
    happinessStat.textContent = player.happiness;
    healthStat.textContent = player.health;
    smartsStat.textContent = player.smarts;
    moneyStat.textContent = player.money;
}

function changeStat(statName, value, min = 0, max = 100) {
    if (player.hasOwnProperty(statName)) {
        player[statName] += value;

        if (statName === 'happiness' || statName === 'health' || statName === 'smarts') {
            player[statName] = Math.max(min, Math.min(max, player[statName]));
        }
        // Money currently has no upper limit
        console.log(`${statName} changed by ${value}. New value: ${player[statName]}`);
        updateStatDisplay();
    } else {
        console.warn(`Attempted to change non-existent stat: ${statName}`);
    }
}

// NEW: Function to show the event display
function showEventDisplay() {
    eventDisplay.style.display = 'block'; // Makes the hidden div visible
}

// NEW: Function to hide the event display
function hideEventDisplay() {
    eventDisplay.style.display = 'none'; // Hides the div
    // Clear previous event content
    eventTitle.textContent = '';
    eventDescription.textContent = '';
    eventChoices.innerHTML = ''; // Clears any dynamically added buttons
}

// NEW: Handle player choosing an action (e.g., Study, Work)
function handleAction(actionName) {
    // First, hide any open events
    hideEventDisplay();

    // Apply effects based on action
    if (actionName === 'study') {
        changeStat('smarts', 5);
        changeStat('happiness', -5); // Study can be tiring!
        console.log("Player chose to Study.");
    } else if (actionName === 'work') {
        changeStat('money', 20);
        changeStat('health', -5); // Work can be draining!
        changeStat('happiness', -5);
        console.log("Player chose to Work.");
    }
    // No time progression for actions, 'Next Month' button handles that.
}


// NEW: Define sample events
// Event structure: { id, title, description, choices (optional), effects (if no choices) }
const gameEvents = [
    {
        id: 'earlyLifeEvent1',
        title: "A Stray Cat Approaches!",
        description: "A fluffy cat rubs against your leg, looking for attention. What do you do?",
        choices: [
            { text: "Pet the cat.", effects: { happiness: 10 } },
            { text: "Ignore it.", effects: { happiness: -2 } }
        ]
    },
    {
        id: 'earlyLifeEvent2',
        title: "Found a Coin!",
        description: "While walking, you spot a shiny coin on the ground.",
        effects: { money: 10 } // Direct effect, no choices
    },
    {
        id: 'healthEvent1',
        title: "Caught a Cold",
        description: "You've caught a minor cold. It's nothing serious, but you feel a bit under the weather.",
        effects: { health: -10, happiness: -5 }
    },
    // More events will be added here later!
];

/**
 * Selects and displays a random eligible event.
 * For now, it just picks a random one from the list.
 */
function triggerRandomEvent() {
    if (gameEvents.length === 0) {
        console.log("No events defined to trigger.");
        return;
    }

    // For now, simply pick a random event (later we'll add eligibility checks)
    const randomIndex = Math.floor(Math.random() * gameEvents.length);
    const event = gameEvents[randomIndex];

    eventTitle.textContent = event.title;
    eventDescription.textContent = event.description;
    eventChoices.innerHTML = ''; // Clear previous choices

    if (event.choices) {
        event.choices.forEach(choice => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice.text;
            choiceButton.classList.add('event-choice-button'); // Add a class for potential styling
            choiceButton.onclick = () => { // When this button is clicked
                if (choice.effects) {
                    for (const stat in choice.effects) {
                        changeStat(stat, choice.effects[stat]);
                    }
                }
                hideEventDisplay(); // Hide event after choice
                // IMPORTANT: We don't advance time here, that's for advanceTimeButton
            };
            eventChoices.appendChild(choiceButton);
        });
    } else if (event.effects) {
        // If no choices, apply effects directly and add a "Continue" button
        for (const stat in event.effects) {
            changeStat(stat, event.effects[stat]);
        }
        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.classList.add('event-continue-button');
        continueButton.onclick = hideEventDisplay; // Hide event when continue is clicked
        eventChoices.appendChild(continueButton);
    }

    showEventDisplay(); // Make the event display visible
}


function advanceTime() {
    player.age++;
    console.log("Time advanced. New age:", player.age);
    updateStatDisplay();

    // Chance to trigger a random event on each turn (e.g., 50% chance)
    if (Math.random() < 0.5) { // 0.5 means 50% chance
        triggerRandomEvent();
    } else {
        hideEventDisplay(); // Ensure event display is hidden if no event triggered
    }

    // Later: check for life stage transitions, game over conditions
    // checkLifeStage();
    // checkGameOver();
}

// --- Event Listeners ---
advanceTimeButton.addEventListener('click', advanceTime);

// NEW: Add event listeners for the new action buttons
studyButton.addEventListener('click', () => handleAction('study'));
workButton.addEventListener('click', () => handleAction('work'));

// --- Initial Game Setup ---
initializeGame();
