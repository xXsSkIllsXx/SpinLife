// --- Player Stats ---
let player = {
    age: 0,
    happiness: 100,
    health: 100,
    smarts: 50,
    money: 0,
    charisma: 50, // NEW STAT: Charisma
    lifeStage: 'Birth'
};

// --- DOM Elements (References to HTML elements) ---
const ageDisplay = document.getElementById('ageDisplay');
const lifeStageDisplay = document.getElementById('lifeStageDisplay');
const happinessStat = document.getElementById('happinessStat');
const healthStat = document.getElementById('healthStat');
const smartsStat = document.getElementById('smartsStat');
const moneyStat = document.getElementById('moneyStat');
const charismaStat = document.getElementById('charismaStat'); // NEW: Charisma Stat Display
const advanceTimeButton = document.getElementById('advanceTimeButton');

const studyButton = document.getElementById('studyButton');
const workButton = document.getElementById('workButton');
const socializeButton = document.getElementById('socializeButton'); // NEW: Socialize Button


const eventDisplay = document.querySelector('.event-display');
const eventTitle = document.getElementById('eventTitle');
const eventDescription = document.getElementById('eventDescription');
const eventChoices = document.getElementById('eventChoices');


// --- Game State Variables ---
let isGameOver = false; // Flag to track game over state

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
    player.charisma = 50; // Initialize new stat
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
    lifeStageDisplay.textContent = player.lifeStage;
    happinessStat.textContent = player.happiness;
    healthStat.textContent = player.health;
    smartsStat.textContent = player.smarts;
    moneyStat.textContent = player.money;
    charismaStat.textContent = player.charisma; // Update charisma display
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

        // Apply bounds for specific stats (happiness, health, smarts, charisma)
        if (statName === 'happiness' || statName === 'health' || statName === 'smarts' || statName === 'charisma') {
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
 * Simulates a dice roll with a given number of sides, adds a stat bonus, and checks against a difficulty.
 * @param {number} sides - Number of sides on the die (e.g., 20 for a d20).
 * @param {string} statName - The name of the player stat to add as a bonus (e.g., 'smarts', 'health').
 * @param {number} difficulty - The target number to beat or meet for success.
 * @returns {object} An object containing the roll result, stat bonus, total score, and success status.
 */
function rollDice(sides, statName, difficulty) {
    const roll = Math.floor(Math.random() * sides) + 1; // Roll from 1 to 'sides'
    const statBonus = player[statName] || 0; // Get stat value, default to 0 if statName is invalid
    // DIFFICULTY CHANGE: Stat bonus scaled down significantly (e.g., 20 stat points = +1 to roll)
    const effectiveStatBonus = Math.floor(statBonus / 20);
    const totalScore = roll + effectiveStatBonus;
    const isSuccess = totalScore >= difficulty;

    console.log(`--- Skill Check ---`);
    console.log(`Rolling D${sides} for ${statName} (Difficulty: ${difficulty})`);
    console.log(`Roll: ${roll}, ${statName} Bonus: ${effectiveStatBonus}, Total: ${totalScore}`);
    console.log(`Result: ${isSuccess ? 'SUCCESS!' : 'FAILURE!'}`);
    console.log(`-------------------`);

    return { roll, statBonus: effectiveStatBonus, totalScore, isSuccess };
}

/**
 * Calculates the percentage chance of success for a given skill check.
 * Assumes a d20 roll with stat bonus (stat/20).
 * @param {string} statName - The name of the player stat (e.g., 'smarts').
 * @param {number} difficulty - The target number to beat or meet.
 * @returns {object} An object containing the percentage and a color string.
 */
function calculateSuccessChance(statName, difficulty) {
    const statBonus = player[statName] || 0;
    const effectiveStatBonus = Math.floor(statBonus / 20); // Match rollDice scaling

    let requiredRoll = difficulty - effectiveStatBonus;

    let successRolls = 0;
    if (requiredRoll <= 1) {
        successRolls = 20; // Any roll 1-20 succeeds (100%)
    } else if (requiredRoll > 20) {
        successRolls = 0; // No roll 1-20 can succeed (0%)
    } else {
        successRolls = 20 - requiredRoll + 1; // Rolls from requiredRoll to 20 succeed
    }

    const percentage = Math.round((successRolls / 20) * 100);

    // COLOR CHANGE: Using darker, more visible colors
    let color = '#dc3545'; // Bootstrap Danger Red (Hard)
    if (percentage >= 75) { // Adjusted threshold for Green (Easy)
        color = '#28a745'; // Bootstrap Success Green
    } else if (percentage >= 40) { // Adjusted threshold for Orange (Medium)
        color = '#ffc107'; // Bootstrap Warning Yellow/Orange
    }

    return { percentage, color };
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
 * Handles player choosing an action (e.g., Study, Work, Socialize).
 * Applies stat changes based on the action and current life stage.
 * @param {string} actionName - The name of the action performed.
 */
function handleAction(actionName) {
    if (isGameOver) return; // Prevent actions if game is over
    hideEventDisplay(); // Close any open event pop-up

    // Apply effects based on action and current life stage
    if (actionName === 'study') {
        changeStat('smarts', 7); // Slightly more effective
        changeStat('happiness', -5);
        console.log("Player chose to Study.");
    } else if (actionName === 'work') {
        if (player.lifeStage === 'Teenager' || player.lifeStage === 'Young Adult' || player.lifeStage === 'Adult' || player.lifeStage === 'Middle Age' || player.lifeStage === 'Senior') {
            changeStat('money', 25); // Slightly more money
            changeStat('health', -7); // A bit more draining
            changeStat('happiness', -5);
            console.log("Player chose to Work.");
        } else {
            console.log("Too young to work!");
        }
    } else if (actionName === 'socialize') { // NEW ACTION
        changeStat('charisma', 8); // Gain charisma
        changeStat('happiness', 10); // Gain happiness
        changeStat('health', -2); // Maybe a little tiring
        console.log("Player chose to Socialize.");
    }
    checkGameOver(); // Check if actions led to game over (e.g. low health/happiness)
}


// --- Life Stage Management ---

/**
 * Updates action button enabled/disabled state based on current life stage.
 * Disables buttons if the game is over.
 */
function updateActionButtons() {
    studyButton.disabled = false;
    workButton.disabled = true;
    socializeButton.disabled = false; // Socialize generally available

    if (player.lifeStage === 'Birth' || player.lifeStage === 'Infancy' || player.lifeStage === 'Childhood') {
        workButton.disabled = true;
    } else if (player.lifeStage === 'Teenager' || player.lifeStage === 'Young Adult' || player.lifeStage === 'Adult' || player.lifeStage === 'Middle Age' || player.lifeStage === 'Senior') {
        workButton.disabled = false;
    }

    // Disable all action buttons if the game is over
    if (isGameOver) {
        studyButton.disabled = true;
        workButton.disabled = true;
        socializeButton.disabled = true;
    }
}

/**
 * Disables all main game buttons (advance time and action buttons).
 */
function disableGameButtons() {
    advanceTimeButton.disabled = true;
    studyButton.disabled = true;
    workButton.disabled = true;
    socializeButton.disabled = true; // Disable new button too
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
    let newStage = player.lifeStage;

    if (player.age < 1) {
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
        newStage = 'Senior';
    }

    if (newStage !== player.lifeStage) {
        player.lifeStage = newStage;
        console.log(`NEW LIFE STAGE: ${player.lifeStage}`);
        updateStatDisplay();
        updateActionButtons();
    }
}

// --- Game Over Logic ---

/**
 * Checks for game over conditions.
 * Now includes health and happiness thresholds.
 */
function checkGameOver() {
    if (isGameOver) return; // Already game over

    let cause = null;

    if (player.age >= 90) {
        cause = "You lived a long and fulfilling life!";
    } else if (player.health <= 0) {
        cause = "Your health deteriorated completely. Life ended prematurely.";
    } else if (player.happiness <= 0) {
        cause = "You lost all hope and joy. Life became unbearable.";
    } else if (player.money <= -500) { // Example: too much debt
        cause = "You went bankrupt and couldn't recover from crushing debt.";
    }


    if (cause) {
        endGame(cause);
    }
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
    eventDescription.innerHTML = `
        <p>${cause}</p>
        <p>You reached the age of **${player.age}**.</p>
        <p>Final Stats:</p>
        <ul>
            <li>Happiness: ${player.happiness}</li>
            <li>Health: ${player.health}</li>
            <li>Smarts: ${player.smarts}</li>
            <li>Money: $${player.money}</li>
            <li>Charisma: ${player.charisma}</li>
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

// --- Event Data ---
const gameEvents = [
    {
        id: 'earlyLifeEvent1',
        title: "A Stray Cat Approaches!",
        description: "A fluffy cat rubs against your leg, looking for attention. What do you do?",
        choices: [
            {
                text: "Gently pet the cat.",
                statCheck: 'smarts',
                difficulty: 15, // INCREASED DIFFICULTY
                successEffects: { happiness: 15, health: 2, charisma: 5 }, // Added charisma gain
                failureEffects: { happiness: -5 },
                successText: "The cat purrs loudly and rubs against your leg. You feel a warm connection and a little more sociable.",
                failureText: "The cat hisses and scratches you! Ouch. Maybe you weren't gentle enough."
            },
            { text: "Ignore it.", effects: { happiness: -2 } }
        ],
        conditions: (player) => true
    },
    {
        id: 'earlyLifeEvent2',
        title: "Found a Coin!",
        description: "While walking, you spot a shiny coin on the ground.",
        effects: { money: 10 },
        conditions: (player) => true
    },
    {
        id: 'healthEvent1',
        title: "Caught a Cold",
        description: "You've caught a minor cold. It's nothing serious, but you feel a bit under the weather.",
        effects: { health: -15, happiness: -10 }, // Increased impact
        conditions: (player) => player.age >= 5
    },
    {
        id: 'childhoodDiscovery',
        title: "Exploring the Woods",
        description: "You ventured into the woods behind your house and found a hidden stream!",
        effects: { happiness: 15, smarts: 5 },
        conditions: (player) => player.lifeStage === 'Childhood' || player.lifeStage === 'Teenager'
    },
    {
        id: 'schoolProject',
        title: "Tough School Project",
        description: "You have a major school project due soon that requires a lot of research. How do you approach it?",
        choices: [
            {
                text: "Dedicate yourself to extensive research.",
                statCheck: 'smarts',
                difficulty: 18, // INCREASED DIFFICULTY
                successEffects: { smarts: 15, happiness: -5, health: -5 },
                failureEffects: { smarts: 5, happiness: -10, health: -5 },
                successText: "Your hard work paid off! You learned a great deal and excelled at the project.",
                failureText: "Despite your efforts, the project was harder than expected. You passed, but it was tough."
            },
            {
                text: "Wing it and hope for the best.",
                statCheck: 'smarts',
                difficulty: 12, // INCREASED DIFFICULTY
                successEffects: { smarts: 2, happiness: 10 },
                failureEffects: { smarts: -15, happiness: -20, health: -5 }, // Harsher failure
                successText: "Surprisingly, your quick thinking saved the day! You aced it without much effort.",
                failureText: "Your laziness caught up with you. The project was a disaster, and you barely passed."
            }
        ],
        conditions: (player) => ['Childhood', 'Teenager'].includes(player.lifeStage)
    },
    {
        id: 'firstJobOffer',
        title: "First Job Offer!",
        description: "A local shop is looking for part-time help. Are you interested?",
        choices: [
            {
                text: "Take the job.",
                statCheck: 'health',
                difficulty: 16, // INCREASED DIFFICULTY
                successEffects: { money: 25, happiness: 5, health: -5 },
                failureEffects: { money: 10, happiness: -10, health: -15 }, // Harsher failure
                successText: "You handled the work well, though it was tiring. Good pay!",
                failureText: "The job was more demanding than expected, leaving you exhausted and underpaid."
            },
            { text: "Decline, focus on studies.", effects: { smarts: 10, happiness: 0 } }
        ],
        conditions: (player) => player.age >= 16 // Only if old enough
    },
    {
        id: 'adultResponsibility',
        title: "Unexpected Bill!",
        description: "A large, unexpected bill arrives. You need to deal with it.",
        choices: [
            {
                text: "Try to negotiate the bill down.",
                statCheck: 'smarts',
                difficulty: 20, // INCREASED DIFFICULTY (can be very hard without high smarts)
                successEffects: { money: -10, happiness: 5, charisma: 5 }, // Added charisma
                failureEffects: { money: -70, happiness: -20 }, // Harsher failure
                successText: "You successfully negotiated a lower price! Phew.",
                failureText: "Your negotiation failed, and you ended up paying the full, hefty sum."
            },
            {
                text: "Just pay the bill. (No Check)",
                effects: { money: -30, happiness: -10 }
            }
        ],
        conditions: (player) => ['Young Adult', 'Adult', 'Middle Age'].includes(player.lifeStage) && player.money > 50
    },
    // --- NEW EVENTS UTILIZING CHARISMA ---
    {
        id: 'publicSpeakingOpportunity',
        title: "Public Speaking Opportunity",
        description: "You've been asked to give a presentation to a large audience.",
        choices: [
            {
                text: "Embrace the challenge and deliver a powerful speech.",
                statCheck: 'charisma',
                difficulty: 17, // Medium to Hard
                successEffects: { charisma: 15, smarts: 5, happiness: 10 },
                failureEffects: { happiness: -10, smarts: -5 },
                successText: "Your speech was a resounding success! The audience was captivated.",
                failureText: "You fumbled your words and felt embarrassed. It did not go well."
            },
            {
                text: "Decline the offer.",
                effects: { happiness: -5 }
            }
        ],
        conditions: (player) => player.lifeStage === 'Young Adult' || player.lifeStage === 'Adult'
    },
    {
        id: 'socialGathering',
        title: "Invited to a Party",
        description: "A friend invited you to a big social gathering. Will you go?",
        choices: [
            {
                text: "Attend and mingle with everyone.",
                statCheck: 'charisma',
                difficulty: 12, // Easier charisma check
                successEffects: { charisma: 10, happiness: 15, money: 5 }, // Might meet someone who helps with money
                failureEffects: { happiness: -5 },
                successText: "You had a great time and made new connections!",
                failureText: "You felt awkward and left early. Not your scene."
            },
            {
                text: "Stay home and relax.",
                effects: { health: 5, happiness: 2 }
            }
        ],
        conditions: (player) => player.age >= 18
    },
    {
        id: 'unexpectedGift',
        title: "Unexpected Gift!",
        description: "An old acquaintance remembers you fondly and sends you a thoughtful gift.",
        effects: { money: 50, happiness: 10 },
        conditions: (player) => player.age >= 40 && player.charisma >= 60 // More likely if higher charisma
    },
    {
        id: 'careerOpportunity',
        title: "Career Opportunity",
        description: "A challenging but rewarding career opportunity arises. It requires both intellect and social skills.",
        choices: [
            {
                text: "Pursue the opportunity. (Smarts & Charisma Check - Difficulty 17)",
                statCheck: 'smarts', // Primary check
                secondaryStatCheck: 'charisma', // NEW: Secondary check example (handled in logic, not choice)
                difficulty: 17,
                successEffects: { money: 100, smarts: 10, charisma: 10, happiness: 15 },
                failureEffects: { money: -10, happiness: -10, health: -5 },
                successText: "You landed the position! It's challenging but incredibly rewarding.",
                failureText: "You tried, but it didn't work out. It was a stressful experience."
            },
            {
                text: "Stick with your current path.",
                effects: { happiness: 5 }
            }
        ],
        conditions: (player) => ['Young Adult', 'Adult'].includes(player.lifeStage) && player.smarts >= 50 && player.charisma >= 50
    }
];

/**
 * Selects and displays a random eligible event.
 * This version is updated to filter events based on potential conditions.
 * Prevents new events if the game is over.
 */
function triggerRandomEvent() {
    if (isGameOver) return; // Don't trigger events if game is over

    // Filter events based on conditions (e.g., age, stats)
    const eligibleEvents = gameEvents.filter(event => !event.conditions || event.conditions(player));

    if (eligibleEvents.length === 0) {
        console.log("No eligible events to trigger for current conditions.");
        hideEventDisplay(); // Ensure event display is hidden if no eligible events
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
            choiceButton.classList.add('event-choice-button'); // Add a class for potential styling

            let choiceText = choice.text;
            if (choice.statCheck) {
                const { percentage, color } = calculateSuccessChance(choice.statCheck, choice.difficulty);
                // Corrected: Using ${variable} syntax inside the style attribute
                choiceText += ` <span style="color: ${color}; font-weight: bold;">(${percentage}%)</span>`;
            }
            // NEW: Adding hint for secondary checks
            if (choice.secondaryStatCheck) {
                choiceText += ` <span style="font-style: italic; opacity: 0.8;">(Also consider ${choice.secondaryStatCheck})</span>`;
            }
            choiceButton.innerHTML = choiceText; // Use innerHTML to render the span correctly

            choiceButton.onclick = () => { // When this button is clicked
                // Always hide the event display first, then re-show with results if it's a check
                hideEventDisplay(); // Clear and hide previous event details immediately

                if (choice.statCheck) {
                    // This is a skill check choice
                    const { roll, statBonus, totalScore, isSuccess } = rollDice(20, choice.statCheck, choice.difficulty);
                    let outcomeMessage = '';
                    let finalSuccess = isSuccess;

                    // NEW: Handle secondary stat check if it exists
                    if (choice.secondaryStatCheck && finalSuccess) { // Only if primary succeeded
                        const { roll: secondaryRoll, statBonus: secondaryStatBonus, totalScore: secondaryTotalScore, isSuccess: secondaryIsSuccess } = rollDice(20, choice.secondaryStatCheck, choice.difficulty); // Use same difficulty for simplicity, could be different
                        console.log(`--- Secondary Skill Check (${choice.secondaryStatCheck}) ---`);
                        console.log(`Roll: ${secondaryRoll}, Bonus: ${secondaryStatBonus}, Total: ${secondaryTotalScore}`);
                        console.log(`Result: ${secondaryIsSuccess ? 'SUCCESS!' : 'FAILURE!'}`);
                        finalSuccess = finalSuccess && secondaryIsSuccess; // Both must pass
                    }

                    if (finalSuccess) {
                        if (choice.successEffects) {
                            for (const stat in choice.successEffects) {
                                changeStat(stat, choice.successEffects[stat]);
                            }
                        }
                        outcomeMessage = choice.successText || "You succeeded!";
                    } else {
                        if (choice.failureEffects) {
                            for (const stat in choice.failureEffects) {
                                changeStat(stat, choice.failureEffects[stat]);
                            }
                        }
                        outcomeMessage = choice.failureText || "You failed!";
                    }

                    // SIMPLIFIED Outcome Message
                    eventTitle.textContent = `${event.title} - Outcome`;
                    eventDescription.innerHTML = `
                        <p>${outcomeMessage}</p>
                        <p><em>(Original event: ${event.description})</em></p>
                    `;
                    eventChoices.innerHTML = ''; // Clear choice buttons

                    const continueButton = document.createElement('button');
                    continueButton.textContent = "Continue";
                    continueButton.classList.add('event-continue-button');
                    continueButton.onclick = hideEventDisplay;
                    eventChoices.appendChild(continueButton);

                    showEventDisplay();

                } else {
                    // This is a standard choice (no skill check)
                    if (choice.effects) {
                        for (const stat in choice.effects) {
                            changeStat(stat, choice.effects[stat]);
                        }
                    }
                    hideEventDisplay();
                }
                checkGameOver(); // Always check game over after an action/event resolution
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
        continueButton.onclick = hideEventDisplay;
        eventChoices.appendChild(continueButton);
    }

    showEventDisplay(); // Make the event display visible
}

/**
 * Advances the game by one "turn" (e.g., month/year).
 * This is the main game loop called by the "Next Month" button.
 */
function advanceTime() {
    if (isGameOver) return;

    hideEventDisplay();

    player.age++;
    console.log("Time advanced. New age:", player.age);
    updateStatDisplay();

    checkLifeStage();
    checkGameOver(); // Check for game over conditions after age/stat changes

    if (isGameOver) {
        return;
    }

    // NEW: Random stat changes each turn to add dynamic difficulty
    // Health decay over time, especially at older ages
    if (player.age > 60) {
        changeStat('health', -Math.floor(Math.random() * 3), 0, 100); // 0 to 2 health loss
    } else {
        changeStat('health', -Math.floor(Math.random() * 2), 0, 100); // 0 to 1 health loss
    }

    // Slight happiness fluctuation
    changeStat('happiness', Math.floor(Math.random() * 5) - 2, 0, 100); // -2 to +2 happiness

    // Only trigger random event if game is not over and no "End of Life" message is showing
    if (Math.random() < 0.6) { // Slightly increased chance for an event (60%)
        triggerRandomEvent();
    } else {
        hideEventDisplay();
    }
}

// --- Event Listeners ---
advanceTimeButton.addEventListener('click', advanceTime);

studyButton.addEventListener('click', () => handleAction('study'));
workButton.addEventListener('click', () => handleAction('work'));
// NEW: Event listener for Socialize button
socializeButton.addEventListener('click', () => handleAction('socialize'));


// --- Initial Game Setup ---
initializeGame();
