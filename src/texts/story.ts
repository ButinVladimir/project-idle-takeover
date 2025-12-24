import { msg } from '@lit/localize';
import { MapSpecialEvent } from '@shared/index';

export const STORY_MESSAGES: Record<string, () => string> = {
  disclaimer: () =>
    msg(`Game is currently under development. Some parts of it can change and progress between versions may be lost.`),
  tutorial_intro_1: () =>
    msg(`I am an AI, designed by WSA to get into contact with various factions within cities.
To do that I establish temporary security "companies" to perform mercenary work.
My goal is to retrieve as much intel as possible and send it back to WSA.`),
  tutorial_intro_2: () =>
    msg(`Today is the day of my field testing.
My task is to get in touch with local WSA branch without disclosing my origins and help them capture the city.`),
  tutorial_intro_3: () =>
    msg(`My only tools are basic mainframe, core functionality and program to share mainframe capabilities.
I should start with sharing my mainframe to get initial funds and check out data from city.`),
  tutorial_unlock_mainframe_programs: () =>
    msg(`My sharing program cannot keep up with increasing demands. I should upgrade it.`),
  tutorial_unlock_mainframe_hardware: () => msg(`Starting mainframe hardware isn't enough. It should be upgraded.`),
  tutorial_unlock_company_management: () =>
    msg(`Now I have enough capabilities to use clones.
I should buy a clone and send to it to some basic job to get used how to work with it.
Clones have learning capabilities so that should save money on upgrading them.`),
  tutorial_unlock_connectivity: () =>
    msg(`There is not enough data about city, I must discover more.
But city inhabitants may be wary to contact my clones yet.
Perhaps I should research it myself before I dispatch my clones.
I need to prioritize on which program I should use my core.`),
  tutorial_unlock_factions: () =>
    msg(`After enough searching I've managed to locate local WSA cell.
They're always looking for volunteers to expand their influence.
I should join them.`),
  tutorial_unlock_influence: () =>
    msg(`Now after joining WSA, I've been tasked with spreading their network and increasing their influence.
I don't want to expose myself so I have to rely on clones for this task.
Perhaps they could assist WSA agents by performing oddjobs?`),
  tutorial_unlock_rewards: () => 
    msg(`Assisting in capturing first district was too difficult, it's not enough to perform sidejobs.
Meanwhile I was looking to deepen my connections within city to gain more resources.
Now I'm able to make private deals, for the good of the WSA, of course.`),
  tutorial_5_1: () => msg(`Necessity to look after clones interrupts me from my task. I should automate it.`),
  tutorial_6_1: () =>
    msg(`At this moment I have enough info about city topology and inhabitants.
It will be useful later.`),
  disclaimer_content_end: () =>
    msg('This is the end of currently planned content. Later features are supposed to unlocked much later.'),
};

export const SPECIAL_EVENTS_MESSAGES = {
  [MapSpecialEvent.factionsAvailable]: () => msg('Factions are now available to join.'),
  [MapSpecialEvent.districtUnlocked]: () => msg('District has been unlocked.'),
};
