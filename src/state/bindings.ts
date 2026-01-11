import { IStateUIConnector, StateUIConnector } from '@state/state-ui-connector';
import { App, IApp } from '@state/app';
import { AppState, IAppState } from '@state/app-state';
import { ScenarioState, IScenarioState, IStoryEventsState, StoryEventsState } from '@state/scenario-state';
import { IFactionState, FactionState } from '@state/faction-state';
import {
  IReachedMilestonesState,
  ReachedMilestonesState,
  IAvailableCategoryItemsState,
  AvailableProgramsState,
  AvailableCloneTemplatesState,
  IAvailableItemsState,
  AvailableItemsState,
  AvailableActivitiesState,
  IAvailableActivitiesState,
  AvailableSidejobsState,
  IAvailableCategoryActivitiesState,
  IUnlockState,
  UnlockState,
  AvailableContractsState,
} from '@state/unlock-state';
import {
  IGlobalState,
  GlobalState,
  ITimeState,
  TimeState,
  IDevelopmentState,
  DevelopmentState,
  IMoneyState,
  MoneyState,
  IMultiplierState,
  IConnectivityState,
  CodeBaseState,
  ComputationalBaseState,
  ConnectivityState,
  RewardsState,
  IMultipliersState,
  MultipliersState,
  IThreatState,
  ThreatState,
  ISynchronizationState,
  SynchronizationState,
  IExperienceShareState,
  ExperienceShareState,
  IProcessCompletionSpeedState,
  ProcessCompletionSpeedState,
  IRewardsState,
} from '@state/global-state';
import {
  IGrowthState,
  GrowthState,
  IMoneyGrowthState,
  MoneyGrowthState,
  IDevelopmentGrowthState,
  DevelopmentGrowthState,
  IMultiplierGrowthState,
  CodeBaseGrowthState,
  ComputationalBaseGrowthState,
  ConnectivityGrowthState,
  RewardsGrowthState,
  IMultipliersGrowthState,
  MultipliersGrowthState,
  IConnectivityGrowthState,
  IInfluenceGrowthState,
  InfluenceGrowthState,
  IExperienceGrowthState,
  ExperienceGrowthState,
} from '@state/growth-state';
import { SettingsState, ISettingsState } from '@state/settings-state';
import {
  CityState,
  DistrictConnectionGraphGenerator,
  DistrictFactionsGenerator,
  DistrictInfoGenerator,
  ICityState,
  IDistrictConnectionGraphGenerator,
  IDistrictFactionsGenerator,
  IDistrictInfoGenerator,
  IMapLayoutGenerator,
  MapLayoutGenerator,
} from '@state/city-state';
import { IMessageLogState, MessageLogState } from '@state/message-log-state';
import {
  IProgramFactory,
  ProgramFactory,
  IMainframeHardwareState,
  MainframeHardwareState,
  IMainframeProgramsState,
  MainframeProgramsState,
  IMainframeProcessesState,
  MainframeProcessesState,
  IMainframeState,
  MainframeState,
  ProgramName,
  IMainframeProgramsUpgrader,
  MainframeProgramsUpgrader,
  IMainframeHardwareUpgrader,
  MainframeHardwareUpgrader,
  IMainframeHardwareParameter,
  MainframeHardwarePerformance,
  MainframeHardwareRam,
  MainframeHardwareCores,
} from '@state/mainframe-state';
import {
  IMainframeHardwareAutomationState,
  MainframeHardwareAutomationState,
  IMainframeProgramsAutomationState,
  MainframeProgramsAutomationState,
  ICloneLevelAutomationState,
  CloneLevelAutomationState,
  IAutomationState,
  AutomationState,
  IContractsAutomationState,
  ContractsAutomationState,
  IContractAssignmentsStarter,
  ContractAssignmentsStarter,
} from '@state/automation-state';
import { INotificationsState, NotificationsState } from '@state/notifications-state';
import { IFormatter, Formatter } from '@shared/index';
import {
  ICloneFactory,
  CloneFactory,
  IOwnedClonesState,
  OwnedClonesState,
  IClonesState,
  ClonesState,
  IOwnedClonesLevelUpgrader,
  OwnedClonesLevelUpgrader,
} from '@state/clones-state';
import {
  IActivityState,
  ActivityState,
  ISidejobsActivityState,
  SidejobsActivityState,
  ISidejobsFactory,
  SidejobsFactory,
  ISidejobActivityValidator,
  SidejobActivityValidator,
  IContractsFactory,
  ContractsFactory,
  IContractActivityValidator,
  ContractActivityValidator,
  IPrimaryActivityQueue,
} from '@state/activity-state';
import { TYPES } from './types';
import { container } from './container';
import { PrimaryActivityQueue } from './activity-state/states/primary-activity-queue/primary-activity-queue';

container.bind<IStateUIConnector>(TYPES.StateUIConnector).to(StateUIConnector).inSingletonScope().whenDefault();

container.bind<IApp>(TYPES.App).to(App).inSingletonScope().whenDefault();

container.bind<IAppState>(TYPES.AppState).to(AppState).inSingletonScope().whenDefault();

container.bind<IScenarioState>(TYPES.ScenarioState).to(ScenarioState).inSingletonScope().whenDefault();

container.bind<IFactionState>(TYPES.FactionState).to(FactionState).inSingletonScope().whenDefault();

container.bind<IStoryEventsState>(TYPES.StoryEventsState).to(StoryEventsState).inSingletonScope().whenDefault();

container.bind<ITimeState>(TYPES.TimeState).to(TimeState).inSingletonScope().whenDefault();

container.bind<IDevelopmentState>(TYPES.DevelopmentState).to(DevelopmentState).inSingletonScope().whenDefault();

container.bind<IMoneyState>(TYPES.MoneyState).to(MoneyState).inSingletonScope().whenDefault();

container.bind<IMultiplierState>(TYPES.CodeBaseState).to(CodeBaseState).inSingletonScope().whenDefault();

container
  .bind<IMultiplierState>(TYPES.ComputationalBaseState)
  .to(ComputationalBaseState)
  .inSingletonScope()
  .whenDefault();

container.bind<IConnectivityState>(TYPES.ConnectivityState).to(ConnectivityState).inSingletonScope().whenDefault();

container.bind<IRewardsState>(TYPES.RewardsState).to(RewardsState).inSingletonScope().whenDefault();

container.bind<IMultipliersState>(TYPES.MultipliersState).to(MultipliersState).inSingletonScope().whenDefault();

container.bind<IThreatState>(TYPES.ThreatState).to(ThreatState).inSingletonScope().whenDefault();

container
  .bind<ISynchronizationState>(TYPES.SynchronizationState)
  .to(SynchronizationState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IExperienceShareState>(TYPES.ExperienceShareState)
  .to(ExperienceShareState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IProcessCompletionSpeedState>(TYPES.ProcessCompletionSpeedState)
  .to(ProcessCompletionSpeedState)
  .inSingletonScope()
  .whenDefault();

container.bind<IGlobalState>(TYPES.GlobalState).to(GlobalState).inSingletonScope().whenDefault();

container
  .bind<IReachedMilestonesState>(TYPES.ReachedMilestonesState)
  .to(ReachedMilestonesState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IAvailableCategoryItemsState<ProgramName>>(TYPES.AvailableProgramsState)
  .to(AvailableProgramsState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IAvailableCategoryItemsState<string>>(TYPES.AvailableCloneTemplatesState)
  .to(AvailableCloneTemplatesState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IAvailableItemsState>(TYPES.AvailableItemsState)
  .to(AvailableItemsState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IAvailableCategoryActivitiesState>(TYPES.AvailableSidejobsState)
  .to(AvailableSidejobsState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IAvailableCategoryActivitiesState>(TYPES.AvailableContractsState)
  .to(AvailableContractsState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IAvailableActivitiesState>(TYPES.AvailableActivitiesState)
  .to(AvailableActivitiesState)
  .inSingletonScope()
  .whenDefault();

container.bind<IUnlockState>(TYPES.UnlockState).to(UnlockState).inSingletonScope().whenDefault();

container.bind<IMoneyGrowthState>(TYPES.MoneyGrowthState).to(MoneyGrowthState).inSingletonScope().whenDefault();

container
  .bind<IDevelopmentGrowthState>(TYPES.DevelopmentGrowthState)
  .to(DevelopmentGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMultiplierGrowthState>(TYPES.CodeBaseGrowthState)
  .to(CodeBaseGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMultiplierGrowthState>(TYPES.ComputationalBaseGrowthState)
  .to(ComputationalBaseGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMultiplierGrowthState>(TYPES.RewardsGrowthState)
  .to(RewardsGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMultipliersGrowthState>(TYPES.MultipliersGrowthState)
  .to(MultipliersGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IConnectivityGrowthState>(TYPES.ConnectivityGrowthState)
  .to(ConnectivityGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IInfluenceGrowthState>(TYPES.InfluenceGrowthState)
  .to(InfluenceGrowthState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IExperienceGrowthState>(TYPES.ExperienceGrowthState)
  .to(ExperienceGrowthState)
  .inSingletonScope()
  .whenDefault();

container.bind<IGrowthState>(TYPES.GrowthState).to(GrowthState).inSingletonScope().whenDefault();

container.bind<ISettingsState>(TYPES.SettingsState).to(SettingsState).inSingletonScope().whenDefault();

container.bind<IMapLayoutGenerator>(TYPES.MapLayoutGenerator).to(MapLayoutGenerator).inRequestScope().whenDefault();

container
  .bind<IDistrictInfoGenerator>(TYPES.DistrictInfoGenerator)
  .to(DistrictInfoGenerator)
  .inRequestScope()
  .whenDefault();

container
  .bind<IDistrictConnectionGraphGenerator>(TYPES.DistrictConnectionGraphGenerator)
  .to(DistrictConnectionGraphGenerator)
  .inRequestScope()
  .whenDefault();

container
  .bind<IDistrictFactionsGenerator>(TYPES.DistrictFactionsGenerator)
  .to(DistrictFactionsGenerator)
  .inSingletonScope()
  .whenDefault();

container.bind<ICityState>(TYPES.CityState).to(CityState).inSingletonScope().whenDefault();

container.bind<IMessageLogState>(TYPES.MessageLogState).to(MessageLogState).inSingletonScope().whenDefault();

container.bind<INotificationsState>(TYPES.NotificationsState).to(NotificationsState).inSingletonScope().whenDefault();

container.bind<IProgramFactory>(TYPES.ProgramFactory).to(ProgramFactory).inSingletonScope().whenDefault();

container
  .bind<IMainframeHardwareParameter>(TYPES.MainframeHardwarePerformance)
  .to(MainframeHardwarePerformance)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeHardwareParameter>(TYPES.MainframeHardwareRam)
  .to(MainframeHardwareRam)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeHardwareParameter>(TYPES.MainframeHardwareCores)
  .to(MainframeHardwareCores)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeProgramsUpgrader>(TYPES.MainframeProgramsUpgrader)
  .to(MainframeProgramsUpgrader)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeHardwareUpgrader>(TYPES.MainframeHardwareUpgrader)
  .to(MainframeHardwareUpgrader)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeHardwareState>(TYPES.MainframeHardwareState)
  .to(MainframeHardwareState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeProgramsState>(TYPES.MainframeProgramsState)
  .to(MainframeProgramsState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeProcessesState>(TYPES.MainframeProcessesState)
  .to(MainframeProcessesState)
  .inSingletonScope()
  .whenDefault();

container.bind<IMainframeState>(TYPES.MainframeState).to(MainframeState).inSingletonScope().whenDefault();

container
  .bind<IMainframeHardwareAutomationState>(TYPES.MainframeHardwareAutomationState)
  .to(MainframeHardwareAutomationState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IMainframeProgramsAutomationState>(TYPES.MainframeProgramsAutomationState)
  .to(MainframeProgramsAutomationState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<ICloneLevelAutomationState>(TYPES.CloneLevelAutomationState)
  .to(CloneLevelAutomationState)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IContractAssignmentsStarter>(TYPES.ContractAssignmentsStarter)
  .to(ContractAssignmentsStarter)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IContractsAutomationState>(TYPES.ContractsAutomationState)
  .to(ContractsAutomationState)
  .inSingletonScope()
  .whenDefault();

container.bind<IAutomationState>(TYPES.AutomationState).to(AutomationState).inSingletonScope().whenDefault();

container.bind<IFormatter>(TYPES.Formatter).to(Formatter).inSingletonScope().whenDefault();

container.bind<ICloneFactory>(TYPES.CloneFactory).to(CloneFactory).inSingletonScope().whenDefault();

container.bind<IOwnedClonesState>(TYPES.OwnedClonesState).to(OwnedClonesState).inSingletonScope().whenDefault();

container
  .bind<IOwnedClonesLevelUpgrader>(TYPES.OwnedClonesLevelUpgrader)
  .to(OwnedClonesLevelUpgrader)
  .inSingletonScope()
  .whenDefault();

container.bind<IClonesState>(TYPES.ClonesState).to(ClonesState).inSingletonScope().whenDefault();

container
  .bind<ISidejobActivityValidator>(TYPES.SidejobActivityValidator)
  .to(SidejobActivityValidator)
  .inSingletonScope()
  .whenDefault();

container.bind<ISidejobsFactory>(TYPES.SidejobsFactory).to(SidejobsFactory).inSingletonScope().whenDefault();

container
  .bind<ISidejobsActivityState>(TYPES.SidejobsActivityState)
  .to(SidejobsActivityState)
  .inSingletonScope()
  .whenDefault();

container.bind<IContractsFactory>(TYPES.ContractsFactory).to(ContractsFactory).inSingletonScope().whenDefault();

container
  .bind<IPrimaryActivityQueue>(TYPES.PrimaryActivityQueue)
  .to(PrimaryActivityQueue)
  .inSingletonScope()
  .whenDefault();

container
  .bind<IContractActivityValidator>(TYPES.ContractActivityValidator)
  .to(ContractActivityValidator)
  .inSingletonScope()
  .whenDefault();

container.bind<IActivityState>(TYPES.ActivityState).to(ActivityState).inSingletonScope().whenDefault();
