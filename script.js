// --- Player Stats ---
let player = {
    age: 0,
    happiness: 100,
    health: 100,
    smarts: 50,
    money: 0,
    // NEW: Track current life stage
    lifeStage: 'Birth'
};

// --- DOM Elements (References to HTML elements) ---
const ageDisplay = document.getElementById('ageDisplay');
const lifeStageDisplay = document.getElementById('lifeStageDisplay'); // NEW: Reference for life stage
const happinessStat = document.getElementById('happinessStat');
const healthStat = document.getElementById('healthStat');
const smartsStat = document.getElementById('smartsStat');
const moneyStat = document.getElementById('moneyStat');
const advanceTimeButton = document.getElementById('advanceTimeButton');

const studyButton = document.getElementById('studyButton');
const workButton = document.getElementById('workButton');

const eventDisplay = document.querySelector('.event-display');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const eventChoices = document.getElementById('eventChoices');


// --- Game State Variables ---
let isGameOver = false; // NEW: Flag to track game over state

// --- Core Game Functions ---

/**
 * Initializes player stats for a new game.
 * This function sets the starting values for age, happiness, health, smarts, and money.
 * It also resets the game over flag and updates the UI.
 */
function initializeGame() {
    player.age = 0;
    player.happiness = 100;
    player.health = 100;
    player.smarts = 50;
    player.money = 0;
    player.lifeStage = 'Birth'; // Reset life stage
    isGameOver = false; // Reset game over flag

    console.log("Game initialized. Player stats:", player);
    updateStatDisplay();
    hideEventDisplay(); // Ensure event display is hidden at start
    updateActionButtons(); // Update button states based on initial life stage
    enableGameButtons(); // Ensure main game buttons are enabled
}

/**
 * Updates the HTML elements to show the current player stats.
 * This function should be called whenever a stat changes.
 */
function updateStatDisplay() {
    ageDisplay.textContent = player.age;
    lifeStageDisplay.textContent = player.lifeStage; // Update life stage display
    happinessStat.textContent = player.happiness;
    healthStat.textContent = player.health;
    smartsStat.textContent = player.smarts;
    moneyStat.textContent = player.money;
}

/**
 * Safely increases or decreases a player stat, ensuring it stays within min/max bounds (0-100 for some).
 * Prevents stat changes if the game is over.
 * @param {string} statName - The name of the stat to change (e.g., 'happiness', 'health', 'money').
 * @param {number} value - The amount to change the stat by (positive for increase, negative for decrease).
 * @param {number} [min=0] - The minimum allowed value for the stat.
 * @param {number} [max=100] - The maximum allowed value for the stat.
 */
function changeStat(statName, value, min = 0, max = 100) {
    if (isGameOver) return; // Don't change stats if game is over

    if (player.hasOwnProperty(statName)) { // Check if the stat exists on the player object
        player[statName] += value;

        // Apply bounds for specific stats (happiness, health, smarts)
        if (statName === 'happiness' || statName === 'health' || statName === 'smarts') {
            player[statName] = Math.max(min, Math.min(max, player[statName]));
        }
        // Money currently has no upper limit or negative limit, adjust as needed.
        console.log(`${statName} changed by ${value}. New value: ${player[statName]}`);
        updateStatDisplay(); // Always update display after changing a stat
    } else {
        console.warn(`Attempted to change non-existent stat: ${statName}`);
    }
}

/**
 * Shows the event display area.
 */
function showEventDisplay() {
    eventDisplay.style.display = 'block'; // Makes the hidden div visible
}

/**
 * Hides the event display area and clears its content.
 */
function hideEventDisplay() {
    eventDisplay.style.display = 'none'; // Hides the div
    // Clear previous event content
    eventTitle.textContent = '';
    eventDescription.textContent = '';
    eventChoices.innerHTML = ''; // Clears any dynamically added buttons
}

/**
 * Handles player choosing an action (e.g., Study, Work).
 * Applies stat changes based on the action and current life stage.
 * @param {string} actionName - The name of the action performed.
 */
function handleAction(actionName) {
    if (isGameOver) return; // Prevent actions if game is over
    hideEventDisplay(); // Close any open event pop-up

    // Apply effects based on action and current life stage
    if (actionName === 'study') {
        // Can study at any age, but might be more effective later
        changeStat('smarts', 5);
        changeStat('happiness', -5); // Study can be tiring!
        console.log("Player chose to Study.");
    } else if (actionName === 'work') {
        // Only allow working if player is at least 'Teenager'
        if (player.lifeStage === 'Teenager' || player.lifeStage === 'Young Adult' || player.lifeStage === 'Adult' || player.lifeStage === 'Middle Age' || player.lifeStage === 'Senior') {
            changeStat('money', 20);
            changeStat('health', -5); // Work can be draining!
            changeStat('happiness', -5);
            console.log("Player chose to Work.");
        } else {
            console.log("Too young to work!");
            // Optional: provide user feedback in UI if too young
            // eventTitle.textContent = "Too Young!";
            // eventDescription.textContent = "You need to be older to work.";
            // showEventDisplay();
        }
    }
}


// --- Life Stage Management ---

/**
 * Updates action button enabled/disabled state based on current life stage.
 * Disables buttons if the game is over.
 */
function updateActionButtons() {
    // Default states for common actions
    studyButton.disabled = false; // Study generally available
    workButton.disabled = true; // Default to disabled for young ages

    // Logic based on life stage
    if (player.lifeStage === 'Birth' || player.lifeStage === 'Infancy' || player.lifeStage === 'Childhood') {
        workButton.disabled = true; // Cannot work as a child
    } else if (player.lifeStage === 'Teenager' || player.lifeStage === 'Young Adult' || player.lifeStage === 'Adult' || player.lifeStage === 'Middle Age' || player.lifeStage === 'Senior') {
        workButton.disabled = false; // Can work from teenager onwards
    }

    // Disable all action buttons if the game is over
    if (isGameOver) {
        studyButton.disabled = true;
        workButton.disabled = true;
    }
}

/**
 * Disables all main game buttons (advance time and action buttons).
 */
function disableGameButtons() {
    advanceTimeButton.disabled = true;
    studyButton.disabled = true;
    workButton.disabled = true;
    // Add other action buttons here as you add them
}

/**
 * Enables all main game buttons.
 * Note: Action buttons specific enabling/disabling is handled by updateActionButtons().
 */
function enableGameButtons() {
    advanceTimeButton.disabled = false;
    updateActionButtons(); // Re-evaluate action button states
}


/**
 * Checks the player's age and updates their life stage.
 * This should be called after age increments.
 */
function checkLifeStage() {
    let newStage = player.lifeStage; // Start with current stage

    if (player.age < 1) { // 0 years old
        newStage = 'Birth';
    } else if (player.age < 5) {
        newStage = 'Infancy';
    } else if (player.age < 13) {
        newStage = 'Childhood';
    } else if (player.age < 18) {
        newStage = 'Teenager';
    } else if (player.age < 30) {
        newStage = 'Young Adult';
    } else if (player.age < 60) {
        newStage = 'Adult';
    } else if (player.age < 80) {
        newStage = 'Middle Age';
    } else {
        newStage = 'Senior'; // For ages 80+
    }

    if (newStage !== player.lifeStage) {
        player.lifeStage = newStage;
        console.log(`NEW LIFE STAGE: ${player.lifeStage}`);
        updateStatDisplay(); // Update display for new stage
        updateActionButtons(); // Update button availability for new stage
        // Potentially trigger stage-specific events or stat changes here
    }
}

// --- Game Over Logic ---

/**
 * Checks for game over conditions.
 * Currently, game ends when player reaches age 90.
 */
function checkGameOver() {
    // Game Over condition: reaching 90 years old
    if (player.age >= 90) {
        endGame("You lived a long and fulfilling life!");
    }
    // Future: add conditions for low health, happiness, or specific events
    // if (player.health <= 0) {
    //     endGame("Your health gave out...");
    // }
    // if (player.happiness <= 0) {
    //     endGame("You ran out of joy...");
    // }
    // if (player.money < -1000) { // Example: too much debt
    //     endGame("You went bankrupt and couldn't recover...");
    // }
}

/**
 * Ends the game and displays a summary.
 * Disables interaction and provides a restart option.
 * @param {string} cause - The reason for the game ending.
 */
function endGame(cause) {
    isGameOver = true;
    hideEventDisplay(); // Ensure no events are showing
    disableGameButtons(); // Disable all interactive buttons

    // Dynamically create and display the end-of-life summary
    eventTitle.textContent = "Life Ended!";
    // CORRECTED: Using ${variable} for embedding variables in template literals
    eventDescription.innerHTML = `
        <p>${cause}</p>
        <p>You reached the age of **${player.age}**.</p>
        <p>Final Stats:</p>
        <ul>
            <li>Happiness: ${player.happiness}</li>
            <li>Health: ${player.health}</li>
            <li>Smarts: ${player.smarts}</li>
            <li>Money: $${player.money}</li>
        </ul>
        <p>Click "New Life" to spin again!</p>
    `;
    // Add a "New Life" button to restart the game
    const newLifeButton = document.createElement('button');
    newLifeButton.textContent = "New Life";
    newLifeButton.classList.add('new-game-button'); // Add class for styling
    newLifeButton.onclick = initializeGame; // Restarts the game when clicked
    eventChoices.appendChild(newLifeButton);
    showEventDisplay(); // Show the end-of-life summary
}
// --- Event Data (Same as before, but note event conditions will be added later) ---
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
        effects: { money: 10 }
    },
    {
        id: 'healthEvent1',
        title: "Caught a Cold",
        description: "You've caught a minor cold. It's nothing serious, but you feel a bit under the weather.",
        effects: { health: -10, happiness: -5 }
    },
    // More events will be added here later!
    // EXAMPLE OF AGE-SPECIFIC EVENT (will be properly implemented in next phase)
    {
        id: 'childhoodDiscovery',
        title: "Exploring the Woods",
        description: "You ventured into the woods behind your house and found a hidden stream!",
        effects: { happiness: 15, smarts: 5 },
        // conditions: (player) => player.lifeStage === 'Childhood' // This is how we'll add conditions later
    }
];

/**
 * Selects and displays a random eligible event.
 * This version is updated to filter events based on potential conditions (though conditions aren't fully applied yet).
 * Prevents new events if the game is over.
 */
function triggerRandomEvent() {
    if (isGameOver) return; // Don't trigger events if game is over

    // Filter events based on conditions (e.g., age, stats) - for future use
    // const eligibleEvents = gameEvents.filter(event => !event.conditions || event.conditions(player));
    // For now, all events are eligible
    const eligibleEvents = gameEvents;


    if (eligibleEvents.length === 0) {
        console.log("No eligible events to trigger.");
        hideEventDisplay(); // Ensure event display is hidden if no events
        return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
    const event = eligibleEvents[randomIndex];

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
        continueButton.classList.add('event-continue-button'); // Add class for styling
        continueButton.onclick = hideEventDisplay; // Hide event when continue is clicked
        eventChoices.appendChild(continueButton);
    }

    showEventDisplay(); // Make the event display visible
}

/**
 * Advances the game by one "turn" (e.g., month/year).
 * This is the main game loop called by the "Next Month" button.
 */
function advanceTime() {
    if (isGameOver) return; // Prevent advancing time if game is over

    hideEventDisplay(); // Hide any existing event before starting a new turn

    player.age++;
    console.log("Time advanced. New age:", player.age);
    updateStatDisplay();

    checkLifeStage(); // Check for life stage transitions after age increment
    checkGameOver(); // Check for game over conditions

    // If game is over after checks, stop further execution
    if (isGameOver) {
        return;
    }

    // Only trigger random event if game is not over and no "End of Life" message is showing
    if (Math.random() < 0.5) { // 50% chance for an event
        triggerRandomEvent();
    } else {
        // If no event triggered, ensure display is hidden (in case previous was an event)
        hideEventDisplay();
    }
}

// --- Event Listeners ---
// Attaches the 'advanceTime' function to the 'click' event of the 'advanceTimeButton'.
advanceTimeButton.addEventListener('click', advanceTime);

// Add event listeners for the new action buttons
studyButton.addEventListener('click', () => handleAction('study'));
workButton.addEventListener('click', () => handleAction('work'));


// --- Initial Game Setup ---
// Call this function once when the page loads to set up the game
initializeGame();
```
