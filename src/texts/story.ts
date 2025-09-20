import { msg } from '@lit/localize';
import { MapSpecialEvent } from '@shared/index';

export const STORY_MESSAGES: Record<string, () => string> = {
  disclaimer: () =>
    msg(`Game is currently under development. Some parts of it can change and progress between versions may be lost.`),
  tutorial_1_1: () =>
    msg(`I am an AI, designed by WSA to get into contact with various factions within cities and perform work for them.
To do that I establish a temporary security companies.
My goal is to retrieve as much intel as possible and send it back to WSA.`),
  tutorial_1_2: () =>
    msg(`Today is the day of my field testing.
My task is to get in touch with local WSA branch without disclosing my origins and help them capture the city.`),
  tutorial_1_3: () =>
    msg(`My only tools are basic mainframe, core functionality and program to share mainframe capabilities.
I should start with sharing my mainframe to get funds and check out data from city.`),
  tutorial_2_1: () => msg(`My sharing program cannot keep up with requirements. I should upgrade it.`),
  tutorial_3_1: () => msg(`Starting mainframe hardware isn't enough. It should be upgraded.`),
  tutorial_4_1: () =>
    msg(`Now I have enough capabilities to operate within the city.
I should buy a clone and send to it to some basic job to get used how to work with it.`),
  tutorial_5_1: () => msg(`Necessity to look after clones interrupts me from my task. I should automate it.`),
  tutorial_6_1: () =>
    msg(`At this moment I have enough info about city topology and inhabitants.
It will be useful later.`),
  tutorial_7_1: () =>
    msg(`My control of clones is getting better.
Current city data doesn't provide me enough information, I need to dig deeper.`),
  disclaimer_content_end: () =>
    msg('This is the end of currently planned content. Later features are supposed to unlocked much later.'),
};

export const SPECIAL_EVENTS_MESSAGES = {
  [MapSpecialEvent.factionsAvailable]: () => msg('Factions are now available to join.'),
};
