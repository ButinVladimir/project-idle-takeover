import { msg } from '@lit/localize';

export const SIDEJOB_TEXTS: Record<
  string,
  {
    title: () => string;
    overview: () => string;
  }
> = {
  oddjob: {
    title: () => msg('Oddjob'),
    overview: () => msg(`Perform random jobs not requiring high qualification.`),
  },
  infoBroker: {
    title: () => msg('Information broker'),
    overview: () => msg('Find and deliver useful information for various parties.'),
  },
  freelanceProgrammer: {
    title: () => msg('Freelance programmer'),
    overview: () => msg('Write and maintain various programs.'),
  },
  computerRepairer: {
    title: () => msg('Computer repairer'),
    overview: () => msg('Repair various electronics.'),
  },
  mediator: {
    title: () => msg('Mediator'),
    overview: () => msg('Find compromises between various parties with profit for yourself.'),
  },
  mainframeRelay: {
    title: () => msg('Mainframe relay'),
    overview: () =>
      msg(`Act as mainframe relay to speed up process completion speed. 
Stacks additively within same district and multiplicatively between different districts.`),
  },
  feedAnalyzer: {
    title: () => msg('Feed analyzer'),
    overview: () =>
      msg(`Analyze feed from other clones to improve shared experience. 
Stacks additively within same district and multiplicatively between different districts.`),
  },
};
