import { msg } from '@lit/localize';
import { SidejobName } from '@state/company-state';

export const SIDEJOB_TEXTS = {
  [SidejobName.oddjob]: {
    title: () => msg('Oddjob'),
    overview: () => msg(`Performing random jobs not requiring high qualification.`),
  },
  [SidejobName.infoBroker]: {
    title: () => msg('Information broker'),
    overview: () => msg('Finding and delivering useful information for various parties.'),
  },
  [SidejobName.freelanceProgrammer]: {
    title: () => msg('Freelance programmer'),
    overview: () => msg('Writing and maintaining various programs.'),
  },
  [SidejobName.computerRepairer]: {
    title: () => msg('Computer repairer'),
    overview: () => msg('Repairing various electronics.'),
  },
  [SidejobName.mediator]: {
    title: () => msg('Mediator'),
    overview: () => msg('Finding compromises between various parties with profit for yourself.'),
  },
  [SidejobName.mainframeRelay]: {
    title: () => msg('Mainframe relay'),
    overview: () =>
      msg(`Acting as mainframe relay to speed up process completion speed. 
Stacks additively within same district and multiplicatively between different districts.`),
  },
};
