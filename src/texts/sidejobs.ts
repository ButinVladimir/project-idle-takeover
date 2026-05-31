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
    overview: () => msg(`Perform random jobs not requiring high qualification. Slightly improves faction influence.`),
  },
  infoBroker: {
    title: () => msg('Information broker'),
    overview: () => msg('Find and deliver useful information for various parties. Slightly improves connectivity.'),
  },
  freelanceProgrammer: {
    title: () => msg('Freelance programmer'),
    overview: () => msg('Write and maintain various programs. Slightly improves codebase points.'),
  },
  computerRepairer: {
    title: () => msg('Computer repairer'),
    overview: () => msg('Repair various electronics. Slight improves computational points.'),
  },
  mediator: {
    title: () => msg('Mediator'),
    overview: () =>
      msg('Find compromises between various parties with profit for yourself. Slightly improves rewards points.'),
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
