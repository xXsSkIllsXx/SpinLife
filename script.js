// --- Player Stats ---
// We'll store player stats in a single object for better organization
let player = {
    age: 0,
    happiness: 100,
    health: 100,
    smarts: 50,
    money: 0
};

// --- DOM Elements (References to HTML elements) ---
// We get references to the HTML elements where we'll display the stats
const ageDisplay = document.getElementById('ageDisplay');
const happinessStat = document.getElementById('happinessStat');
const healthStat = document.getElementById('healthStat');
const smartsStat = document.getElementById('smartsStat');
const moneyStat = document.getElementById('moneyStat');
const advanceTimeButton = document.getElementById('advanceTimeButton');

// --- Core Game Functions ---

/**
 * Initializes player stats for a new game.
 * This function sets the starting values for age, happiness, health, smarts, and money.
 */
function initializeGame() {
    player.age = 0;
    player.happiness = 100;
    player.health = 100;
    player.smarts = 50;
    player.money = 0;
    console.log("Game initialized. Player stats:", player); // For debugging: view in browser console
    updateStatDisplay(); // Update the HTML display with initial stats
}

/**
 * Updates the HTML elements to show the current player stats.
 * This function should be called whenever a stat changes.
 */
function updateStatDisplay() {
    ageDisplay.textContent = player.age;
    happinessStat.textContent = player.happiness;
    healthStat.textContent = player.health;
    smartsStat.textContent = player.smarts;
    moneyStat.textContent = player.money;
}

/**
 * Safely increases or decreases a player stat, ensuring it stays within min/max bounds (0-100 for some).
 * @param {string} statName - The name of the stat to change (e.g., 'happiness', 'health', 'money').
 * @param {number} value - The amount to change the stat by (positive for increase, negative for decrease).
 * @param {number} [min=0] - The minimum allowed value for the stat.
 * @param {number} [max=100] - The maximum allowed value for the stat.
 */
function changeStat(statName, value, min = 0, max = 100) {
    if (player.hasOwnProperty(statName)) { // Check if the stat exists on the player object
        player[statName] += value;

        // Apply bounds for specific stats if they are happiness or health
        if (statName === 'happiness' || statName === 'health' || statName === 'smarts') {
            player[statName] = Math.max(min, Math.min(max, player[statName]));
        } else if (statName === 'money') {
            // Money can go below 0 (debt) but might have a high max or no max
            // For now, no upper limit for money, just lower limit if needed.
            // If you want a floor for money (e.g., not less than -1000), you can add:
            // player[statName] = Math.max(min, player[statName]);
        }
        // Add a console log to see changes for debugging
        console.log(`${statName} changed by ${value}. New value: ${player[statName]}`);
        updateStatDisplay(); // Always update display after changing a stat
    } else {
        console.warn(`Attempted to change non-existent stat: ${statName}`);
    }
}


/**
 * Advances the game by one "turn" (e.g., month/year).
 * This function will be called when the "Next Month" button is clicked.
 */
function advanceTime() {
    player.age++; // Increment age
    console.log("Time advanced. New age:", player.age);
    updateStatDisplay(); // Update age display

    // Example: Small natural stat decay each turn (optional)
    // changeStat('happiness', -1);
    // changeStat('health', -1);

    // Later, we'll add calls to random event system, life stage checks, etc. here.
}

// --- Event Listeners ---
// This line attaches the 'advanceTime' function to the 'click' event of the 'advanceTimeButton'.
advanceTimeButton.addEventListener('click', advanceTime);

// --- Initial Game Setup ---
// Call this function once when the page loads to set up the game
initializeGame();
