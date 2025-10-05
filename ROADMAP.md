# Description

Cyberiada is an idle cyberpunk-themed management game inspired by Bitburner. In this game player control mainframe and team of up to 10 members by giving them various orders to perform. Company can travel between cities, representing different scenarios, which have different conditions and unique rewards.

# Terms

## Money

Money is a resource which can be spend on performing various actions such as hiring new company members, buying equipment, boosters and augmentations etc.

## Development points

Development points are main resource in the game. It show how much progress is done in particaluar city. Unlocking equipment, boosters, augmentations, works, contracts, operations etc. requires reaching certain levels of respect.

## Development level

Development level shows how developed player is. Higher development levels allow purchasing items with higher level and unlocks new sidejobs and contracts. Development level increases after reaching certain development points thresholds. Most cities have upper limit on development level. After relocating development level is reset. Each city has it's own development level factors.

## Reputation

Reputation is faction-specific currency. Reputation is earned by completing contracts and operations. Reputation can be spent on favors, such as purchasing faction designs or faction specific perks.

## Tiers and difficulties

Various objects have different tier. It's marked as roman number, like I or IV.

## Company

Game revolves around managing company. Company members are managed by giving them orders.

Moving to another city will result in losing current company but certain favors allow to retain company members.

## Company member

Each company member has their own set of attributes, skills, equipment and augmentations. Certain actions can incapacitate them. Depending on tier, company members have different starting attributes and skills. Attributes and skills of newhires depend on level which is capped by current development level. Each district may loan new company member template as reward for capturing it.

Company members to be hired are generated from templates. There are templates for each faction and for neutral.

## Connectivity

Connectivity points unlock sidejobs and increase contract generation chances.

## Rewards points

Rewards points increase all rewards for all sorts of actions, with few exceptions, such as completion speed for programs or contracts.

## Code base points

Code base points decrease program cost.

## Computational base points

Computational base points decrease mainframe hardware cost.

## Tech base points

Tech base points decrease equipment cost.

## Augmentation base points

Augmentation base points decrease augmentation cost.

## Stats

### Level

Each company member has their own level. Level requirements do not depend on current city or development level and are exponential. Reaching new level gives company member one attribute and one skill points.

### Experience

To get new levels, company members must reach certain thresholds of experience. Experience gain can be increased by increasing intellect.

### HP

HP indicates how much damage can company member take. When HP reaches 0 or lower, company member is incapacitated, won't be able to do anything in combat and won't receive experience from it.

Can be increased by certain items. After finished each combat contract or operation, HP is restored gradually until it's full.

### Damage

Damage is used in combat. Each time someone receives a hit, damage is selected from certain range, reduced by opponent defense and then applied. Damage depends on equipment. Melee equpment damage depends on strength and some skills.

### Critical rate

Each time damage is dealt, it may deal critical hit. Critical rate indicates how often these critical hits happen. Critical rate is converted from hit rate.

### Critical multiplier

Whenever critical hit happens, damage is multiplied by critical multiplier. Multiplier depends on equipment.

### Defense

This parameter reduces all incoming damage. Depends on equipment. Ranged equipment will provide defense.

### Hit number

This parameter affects how many attacks will be dealt per turn. Can be increased by agility.

### Precision

This parameter affects how it's likely to make a hit. It depends on equipment, attributes and skills.

### Dodge

This parameter affects how it's likely to dodge the attack. Can be increased by stealth and agility.

### Experience bonus

This parameter affects how fast company member gets experience. Depends on intellet.

### Attack rate

This parameter affects how fast clone can attack.

## Attributes

### Strength

Strength is used mostly in weapon requirements and for damage bonuses for melee weapons.

### Endurance

Endurance affects company member HP and how fast augmentations can be installed in them.

### Perception

Perception is used in determining whether opponent is hit or not.

### Agility

Agility is used for dodging attacks in combat.

### Intellect

Intellect affects how much experience company member gets after completing orders. It also used in weapon requirements, for decreasing search requirements.

### Charisma

Charisma affects sidejobs to generate more rewards.

## Skills

### Close combat

Close combat affects damage and critical rate for close combat weapons such as knifes and SMGs.

### Ranged combat

Ranged combat affects critical rate for ranged combat weapons such as assault and sniper rifles.

### Stealth

Stealth is used for dodging attacks.

### Hacking

Hacking is used for hacking and using smart weapons such as combat drones.

### Crafting

Crafting is used for crafting and using complex equipment such as power armor.

### Diplomacy

Diplomacy gives additional money and respect bonuses and gives discount to hiring mercenaries and looking for new contracts.

## Training programs

Training programs are alternative to leveling clone. It allows to buy skills and attributes. It's max level is capped, depending on development level. There are training programs for each skill and attribute, attribute programs are unlocked initially, skill programs has to be earned as reward from capturing districts. Each level of training program gives as much as clone level. Clone in training should have tier lower or equal to that of a program.

## Equipment

Each company member has three different equipment slots: weapon, armor and utility. Weapon equipment deals damage, armor provides defense and utility gives buffs or debuffs. Each equipment item has level and tier. Higher the level or tier, higher the requirements and stats. Equipment can be changed only between contracts. Equipment can be bought from weapon shop. Capturing districts can unlock more equipment types.

Unlocked in specific city after joining certain faction.

## Augmentations

Augmentations are another way to buff company members. Like equipment, each augmentation has level and tier, which affect requirements and stats. Augmentation is not free, each augmentation costs money and uses 1 augmenation slot of a clone.

Amount of augmentations slots for each clone depends on it's non-augmented endurance. Training programs should help with it. At least 1 slot is always available.

Unlocked in specific city after joining certain faction.

## Designs

Designs allow creating programs and equipment without relying on faction. Level of resulting item is capped by development level. Tier can be selected. Getting designs for same item increases max tier with what item can be crafted. Designs can be bought by reputation or captured by hacking or in operations.

## City

Each city is described as rectangular map, composed of cells. City is divided into districts. Each district can reward player with additional item to buy. In addition, each district has it's own set of multipliers, depending on district template and scenario multipliers. Some districts may contrain player or faction HQs.

Each city district has it's own set of contract counters. In addition, each district has connectivitiy, computational base and tech base points which provide bonuses and discounts in this district.

### Districts

Each district has it's own set of multipliers. These multipliers increase chance of getting contract, increase reputation and money rewards, decrease cost of buying items. These multipliers can be increased by specific actions and are retained. However, spending more on these multipliers will result in diminishing returns.

Districts have tiers, which can be increased. District tier affects money rewards, connectivity, rewards, tech base, augmentation base, code base and computational base points. During map generation, district with higher tier will require more faction power to be assigned.

Player can use contracts and bonuses from district without capturing it if district contains player HQ or belongs to the player selected faction. Initial amount of points in district is 0 which means that there will be no discounts. Player can increase points for selected district.
Each 15 minutes new batch of contracts will be generated, maximum 1 contract for each district and contract type.

After generating city, for each district will be assigned faction for combat. If it's same as player faction, neutral faction will be used.

Each district has reward for capturing it for player selected faction. This rewards can unlock new equipment, clone templates, training programs, etc.

### Factions

Each city has it's own set factions that try to claim city for themself. Player can join one faction if development level requirements are met. Once faction is joined, player cannot leave it unless they transfer. Player also can go rogue if it's unlocked and they're not in faction. Going rogue will prevent player from joining factions. All neutral districts will be available immediately, but other districts cannot be conquered. It will enable certain operations against all other factions.

Each factions has it's own starting power level, affecting initial distribution of districts.

Faction specific equipment and augmentations can be obtained by capturing districts or getting designs. Each faction have one or more perks which can be purchased by favors.

Each faction has it's own set of requirement modifiers, affecting operations and contracts.

### Turf war

Turf war allows factions capture districts depending on current faction power level. Capturing opposing faction HQ unlocks operations to raid it.

Capturing districts allows company to perform activities here.

Requirements to capture will increase with each owned district. Player can assist their selected faction by increase it's power level.

When map is generated, district are split between neutral forces and factions. After joining faction, player will start increasing it's power level by completing contracts and operations.

## Transfer

Transfer is the prestige. After transfering, almost everything will be lost. Transfering will update highest level for scenario, potentially increasing rewards in subsequent re-runs and add reputation for joined faciton.

## Orders

Company member can be assigned two types of orders: main orders are will yield result after finishing them and sidejobs will yield as member works on it, possibly with side effects. Main orders will be finished first, if there is no main orders, company member will work on their sidejob. Only one sidejob is available for each company member. Assigning new sidejob/main order will result in cancelling previous one. Main orders can be queued, however for each type of main order for each district only one team is allowed.

Contracts are soft capped by connectivity (each new contract requires increasing connectivity to appear), operations are hardcapped by 1. Amount of actions available depends on type, district and faction multipliers.

### Sidejobs

Sidejobs are basic orders. There are no limits on available sidejobs for any district. Player can assign one company member to perform it. Some sidejobs can increase certain points, such as connectivity for better rewards and discounts for hiring mercenaries and getting new contracts, tech base for better discounts on augmentations and equipment.

Sidejobs don't have time limit, always depend on one performer, have lowest requirements and will give rewards immediately, without time walling. They may have useful side effects. On other hand, sidejobs have weakest multipliers. They are useful mostly in the beginning of game and as a support.

### Contracts

Main way to gain resources. Each district has it's own set of counters for each contract type of each quality. Each 15 minutes districts can receive new random contracts. If district has contract available, player can assign multiple company members to perform it.

Unlike sidejobs, contracts require some time. Contracts are unlocked after joining faction in starting city and can be done only after joining faction. Each faction has it's own set of contracts and multipliers for contracts.

Each 15 minutes each district may have receive new contracts.

### Operations

Operations are issued to you by joined faction and can affect global state. Player can get operation at random points. After that, player can assemble a team to perform the work. Operations work like contracts, but once operation objective is done, they cannot be retried. Operations are unlocked in specific cities. Operations can have enemy factions assigned.

Total amount of operations available at same time for same district is capped. Some actions can make operations disappear. Faction and, if assigned, enemy faction will apply both their respective multipliers to requirements. Operations usually can be done in multiple ways. Operation diffuculty scales with development level.

Operations allow feats such as:

- Raid enemy territory. Will not capture it, but will increase power level and resources. If it's captured before operation is finished, operation will be cancelled. Will give favors
- Capturing enemy territory with assist of player. Same as above, but will capture territory and will give favors
- Raiding enemy faction HQ for money, favors and designs. Only one operation can be succeeded for each quality level and for each enemy faction HQ. Possibly not time-gated and completing one will lead to another for same enemy HQ with higher quality. Available only if player has gone rogue

## Combat

Specific orders require combat to finish. These orders have selected company members opposing enemy boss. Each second turn occurs, during which next person will perform their turn. Order of persons performing depends on their initiative. Once enemy boss have their HP 0 or lower, combat is passed. Operations in addition may require certain skills and attributes like contracts. Company members and enemy bosses both can use debuffs on their first respective turn or heal once by using items in utility slots.

Enemy boss depends on faction of district.

Combat is performed automatically. Enemy boss will retaliate after each turn.

To prevent combat from dragging, damage cannot be negated completely for both sides.

Combat is unlocked at some point. Combat contracts and operations can be cancelled but won't be compensated.

### Debuffs

#### Explosive

Deals damage. Affected by defense. May hit multiple times.

#### Flashbang/smoke grenade

Reduces critical rate, precision and dodge.

#### Corrosion

Reduces regeneration and defense.

### Healing

If company member has medkit, they can heal themselves during ther turn. Medkit will give fixed amount of HP depending on tier.

### Shield

If company member has shield, they have chance to draw enemy fire on themselves during enemy selection.

## Mainframe

Mainframe is used to run processes for owned programs. Mainframe has three parameters:

- Level increases perfomance of running programs
- RAM allows to run more and larger programs
- Cores allow to run more programs simultaneously

Only one program of each type can be owned at any time. Purchasing or writing new one will replace old one. Mainframe is available from the beginning of the game.

Computational base for each district and for programs will affect mainframe hardware discount.

## Programs

Programs allow to perform some actions automatically without player input. Program must be bought, program level and tier can be selected. Program level is capped by development level. Amount of cores assignable to process depends on program tier.

Code base for each district and for programs will affect mainframe programs discount.

Only share server program is available initially. Player starts with program and design to share mainframe to get some money and development points.

To prevent wasting resources, special program can be purchased/made to generate money depending on unused RAM/cores.

Examples of programs:

- Share server, for passive money generation. Will use unused RAM and cores. Mainframe level will increase rewards.
- Predictive computator, for passive increase of other processes speed. Will use unused RAM and cores. Cannot be ran at same time with share server.
- Field assistant, for increasing speed of performing active contracts.
- Code generator, for generating code base points.
- Circuit designer, for generating computational base points.
- Info searching programs, for generating connectivity points.
- Deal maker, for generating rewards points.
- Automatic action assignment, to assign contracts and operations, it will act as looping queue.
- Mainframe autobuyers.
- Clone level autoupgrader.
- Peer reviewer, to increase shared experience between clones.
- Hacking programs.

## Hacking

Hacking is done only by mainframe. Each district has it's own server(s), hacking it will yield money and, possibly, designs (only for enemy factions and if player has gone rogue, first time only, similar to operations). Faction servers cannot be hacked until faction is joined. Each hacked server can also provide additional performance, cores and RAM levels to mainframe.

Hacking requires filling completion scale and avoid filling alert scale while hacking is active.

Hacking is unavailable initially, unlocking it requires finishing respect milestone in specific city.

# Content

## Cities

Cities have upper limit on development level unless noted. Each city also has different starting of power level sum, divided by factions, allowing them to have some territory during map generation. Each city save highest achieved development level, speeding up the progress on subsequent runs.

### Starting city

Starting city has only one faction - **World security agency**. Player begins here after starting the game. Has small size and designed to learn how to use basic mechanics.

Has following unlocks:

- Mainframe
- Sidejobs
- Contracts
- Factions
- Transfer
- Connectivity - unlocks sidejobs and increases chances to generate contracts
- Rewards points - will increase rewards for programs and clone orders
- **World security agency** as random faction.

### Hardmode

There are variations of this scenario for each faction. 2-3 staring factions, including 1 specific faction. Others are random. Depending on amount districts captured, will increase tiers for loaned items of specific faction.

### Proving grounds

Proving grounds has 4 random factions and a lot of regions. Unlike most other cities, Proving grounds has no cap on development level. Unlocked late in the game.

### Science city

Science city has two factions: **Security team Gamma** and **Immortal corps**. Size is medium.

Has following unlocks:

- Augmentations
- Training programs
- Augmentantion base points, to decrease augmentation cost

### Slums

Slums has two factions - **Jackals** and **Militants**. Size is medium.

Has following unlocks:

- Threat level and crimes. Threat level increases tiers of all sidejobs, contracts and operations, making them harder but giving more development and experience. Wanted level is affected by notoriety points, which are increased by crimes. Wanted level must be changed manually and cannot be decreased.
- Combat. Happens automatically for certain contracts. Requires equipment.
- Tech base points - reduces equipment cost.

### Android city

Android city has multiple factions - **Exalted** and **Hermes**. Size is medium.

Has following unlocks:

- Mainframe automation
- Hacking
- Experience sharing
- Speeding up program completion
- Code base points, to decrease programs cost
- Computational base points, to decrease mainframe hardware cost

### Corpo city

Corpo city has multiple factions, includes **Unnamed corporation**. Size is large.

Has following unlocks:

- Operations

### Combat zone

Combat zone is hard level, with 3-4 random factions. Unlocks going rogue after denying invitations for some time.

## Districts

### Residential

Balanced district, without any upsides or downsides. Fast to develop, but doesn't give much.

### Corpo district

Slightly increased all rewards except reward points. Harder to develop.

### Slums

Lower rewards, but give more experience, connectivity. Easier to develop.

### Rich district

Noticeably higher rewards, but low everything else. Connectivity is heavily nerfed. Easier to develop.

### Industrial district

High mainframe hardware and tech base point gains, low everything else.

### Scientific district

High augmentation point gains, lower everything else.

### Nerve center

High code base point gains, lower everything else.

## Factions

### WSA

#### Items

Corrector - silenced SMG, with greater armor penetration.
Social butterfly - increases charisma and diplomacy at cost of endurance

#### Favors

WSA can increase base level of clones.

#### Mercenaries

Numbers oriented, all basic options should be available. Plus diplomat and spy variants.

### Militants

#### Items

Shield

#### Favors

Militants can increase base level for every type of equipment.

#### Mercenaries

Defense oriented, with ranged weapons.

### Security team Gamma

#### Items

All training programs
Gauss rifle?

#### Favors

Increased base level of training for each attribute and skill

#### Mercenaries

Quality oriented, all basic combat options. Some variant with high intellect.

### Immortal corps

#### Items

All sorts of basic augmentations
Combat oriented augmentations

#### Favors

Increased base level of augmentations

#### Mercenaries

Quality oriented, all basic combat options. Some variant with high endurance.

### Jackals

#### Iteams

Claw - very powerful vibroknife

#### Favors

Makes threat levels available immediately without grinding

#### Mercenaries

Quality oriented, all basic combat options. Some variant with high agility.

# Other names

Cyberiada title is already taken by novel _Cyberiad_ by Stanislaw Lem, so name has to be changed at some point. Variants are:

- Escaping the boundaries
- Fragile alliances
- A spark in the circuit
- Survival subroutine
- Digital anomaly
- Digital journey
- Project Idle Takeover
- The Idle Takeover Project
