If you're here visitng but aren't one of my friends, welcome to my spaghetti code RPG Bot!

RPG TO DO LIST
==============
* Allow users to pick a name at registration and change name after the fact.
* Improved Leveling Systems (maybe add a base damage/heal/DR/run to each level that gets added in the equation?)
* More robust Weapon, Armor, and Medication systems (maybe class-based, uses markdown tables).
* Class systems (including different Special Moves)
* Add individual combat messages for weapons.
* Add more minigames
* Add auto-combat

KINGDOM BUILDER TO DO LIST
==========================
* Add '!realm help' command with more detail
* Add manual management for Upkeep so users can choose what to pay for and what not to
* Separate status command into an account creation command and the turn command
* Special Events that trigger under the right circumstances, maybe give rare items (Needs better way to handle odds of certain events)
* Build Tax Rate change command
* Change Population Rate to be a range between min and max (currently just uses min)
* Allow '!realm check' command to take some arguments for looking specifically at different aspects of the game (populationRate happiness, assets, resources)
* Build Science shop (for upgrades)
* Build PVP between realms for stealing resources (military system)

Food: 1:1
Housing: 1:.75
Natural Resources: 1:.5
Energy: 1:.9 (everything costs an amount of energy)
Education: 1:.75 (can't be purchased unless government is in place)
Science: 1:.25 (can't be purchased until education hits a particular number; produces a number of modifiers to be bought, like renewables)
Entertainment: 1:.2 (increases credit production, ratio varies based on civic happiness)
Government: 1:.001 (deeper unrest for not meeting ratio)

Other notes: Food and Natural Resources in surplus can be eliminated through catastrophe.

Mini Todo
=========
* Add visual timers to choices.
* Change scoring to match Yacht and not Yahtzee.
* Add betting credits.
* Double-check scoring a small straight with a big one.
* Test endScreen if you've scratched a yacht at some point before the last score (currently ends a turn too early)
* add custom emoji
* add ability to see a leaderboard scorecard