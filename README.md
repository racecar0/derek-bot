If you're here visitng but aren't one of my friends, welcome to my spaghetti code RPG Bot!

RPG TO DO LIST
==============
~~Redo Monster array to either pull from the DB or a JSON (haven't decided yet, probably latter).~~
~~Add experience/credit gain after monster death. Credit loss after player death.~~
~~Fix player/monster damage equation. Keeps doing more damage in print than it should.~~
~~Healing is especially forked up. Keeps healing for more than it even says it does on print.~~
~~Leveling isn't triggering when xp equals the new level. Might need a new DB pull.~~
~~Shop systems.~~
~~Better formatting for combat, bars or lines or something~~
~~Change "shield" icon to "run" icon and revamp run system.~~
* Allow users to pick a name at registration and change name after the fact.
* Improved Leveling Systems (maybe add a base damage/heal/DR/run to each level that gets added in the equation?)
* More robust Weapon, Armor, and Medication systems (maybe class-based, uses markdown tables).
* Class systems (including different Special Moves)
* Add individual combat messages for weapons.
* Add more minigames
* Add auto-combat

KINGDOM BUILDER TO DO LIST
==========================
~~Build basic resource management engine~~
~~Build timer system for AFK resource building~~
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

Three currencies: credits, energy, resources

1440 minutes in a day.
Daily Growth Rates:


