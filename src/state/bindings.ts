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

container.bind<IStateUIConnector>(TYPES.StateUIConnector).to(StateUIConnector).inSingletonScope().whenTargetIsDefault();

container.bind<IApp>(TYPES.App).to(App).inSingletonScope().whenTargetIsDefault();

container.bind<IAppState>(TYPES.AppState).to(AppState).inSingletonScope().whenTargetIsDefault();

container.bind<IScenarioState>(TYPES.ScenarioState).to(ScenarioState).inSingletonScope().whenTargetIsDefault();

container.bind<IFactionState>(TYPES.FactionState).to(FactionState).inSingletonScope().whenTargetIsDefault();

container.bind<IStoryEventsState>(TYPES.StoryEventsState).to(StoryEventsState).inSingletonScope().whenTargetIsDefault();

container.bind<ITimeState>(TYPES.TimeState).to(TimeState).inSingletonScope().whenTargetIsDefault();

container.bind<IDevelopmentState>(TYPES.DevelopmentState).to(DevelopmentState).inSingletonScope().whenTargetIsDefault();

container.bind<IMoneyState>(TYPES.MoneyState).to(MoneyState).inSingletonScope().whenTargetIsDefault();

container.bind<IMultiplierState>(TYPES.CodeBaseState).to(CodeBaseState).inSingletonScope().whenTargetIsDefault();

container
  .bind<IMultiplierState>(TYPES.ComputationalBaseState)
  .to(ComputationalBaseState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IConnectivityState>(TYPES.ConnectivityState)
  .to(ConnectivityState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IRewardsState>(TYPES.RewardsState).to(RewardsState).inSingletonScope().whenTargetIsDefault();

container.bind<IMultipliersState>(TYPES.MultipliersState).to(MultipliersState).inSingletonScope().whenTargetIsDefault();

container.bind<IThreatState>(TYPES.ThreatState).to(ThreatState).inSingletonScope().whenTargetIsDefault();

container
  .bind<ISynchronizationState>(TYPES.SynchronizationState)
  .to(SynchronizationState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IExperienceShareState>(TYPES.ExperienceShareState)
  .to(ExperienceShareState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IProcessCompletionSpeedState>(TYPES.ProcessCompletionSpeedState)
  .to(ProcessCompletionSpeedState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IGlobalState>(TYPES.GlobalState).to(GlobalState).inSingletonScope().whenTargetIsDefault();

container
  .bind<IReachedMilestonesState>(TYPES.ReachedMilestonesState)
  .to(ReachedMilestonesState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IAvailableCategoryItemsState<ProgramName>>(TYPES.AvailableProgramsState)
  .to(AvailableProgramsState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IAvailableCategoryItemsState<string>>(TYPES.AvailableCloneTemplatesState)
  .to(AvailableCloneTemplatesState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IAvailableItemsState>(TYPES.AvailableItemsState)
  .to(AvailableItemsState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IAvailableCategoryActivitiesState>(TYPES.AvailableSidejobsState)
  .to(AvailableSidejobsState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IAvailableCategoryActivitiesState>(TYPES.AvailableContractsState)
  .to(AvailableContractsState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IAvailableActivitiesState>(TYPES.AvailableActivitiesState)
  .to(AvailableActivitiesState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IUnlockState>(TYPES.UnlockState).to(UnlockState).inSingletonScope().whenTargetIsDefault();

container.bind<IMoneyGrowthState>(TYPES.MoneyGrowthState).to(MoneyGrowthState).inSingletonScope().whenTargetIsDefault();

container
  .bind<IDevelopmentGrowthState>(TYPES.DevelopmentGrowthState)
  .to(DevelopmentGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMultiplierGrowthState>(TYPES.CodeBaseGrowthState)
  .to(CodeBaseGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMultiplierGrowthState>(TYPES.ComputationalBaseGrowthState)
  .to(ComputationalBaseGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMultiplierGrowthState>(TYPES.RewardsGrowthState)
  .to(RewardsGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMultipliersGrowthState>(TYPES.MultipliersGrowthState)
  .to(MultipliersGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IConnectivityGrowthState>(TYPES.ConnectivityGrowthState)
  .to(ConnectivityGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IInfluenceGrowthState>(TYPES.InfluenceGrowthState)
  .to(InfluenceGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IExperienceGrowthState>(TYPES.ExperienceGrowthState)
  .to(ExperienceGrowthState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IGrowthState>(TYPES.GrowthState).to(GrowthState).inSingletonScope().whenTargetIsDefault();

container.bind<ISettingsState>(TYPES.SettingsState).to(SettingsState).inSingletonScope().whenTargetIsDefault();

container
  .bind<IMapLayoutGenerator>(TYPES.MapLayoutGenerator)
  .to(MapLayoutGenerator)
  .inRequestScope()
  .whenTargetIsDefault();

container
  .bind<IDistrictInfoGenerator>(TYPES.DistrictInfoGenerator)
  .to(DistrictInfoGenerator)
  .inRequestScope()
  .whenTargetIsDefault();

container
  .bind<IDistrictConnectionGraphGenerator>(TYPES.DistrictConnectionGraphGenerator)
  .to(DistrictConnectionGraphGenerator)
  .inRequestScope()
  .whenTargetIsDefault();

container
  .bind<IDistrictFactionsGenerator>(TYPES.DistrictFactionsGenerator)
  .to(DistrictFactionsGenerator)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<ICityState>(TYPES.CityState).to(CityState).inSingletonScope().whenTargetIsDefault();

container.bind<IMessageLogState>(TYPES.MessageLogState).to(MessageLogState).inSingletonScope().whenTargetIsDefault();

container
  .bind<INotificationsState>(TYPES.NotificationsState)
  .to(NotificationsState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IProgramFactory>(TYPES.ProgramFactory).to(ProgramFactory).inSingletonScope().whenTargetIsDefault();

container
  .bind<IMainframeHardwareParameter>(TYPES.MainframeHardwarePerformance)
  .to(MainframeHardwarePerformance)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeHardwareParameter>(TYPES.MainframeHardwareRam)
  .to(MainframeHardwareRam)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeHardwareParameter>(TYPES.MainframeHardwareCores)
  .to(MainframeHardwareCores)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeProgramsUpgrader>(TYPES.MainframeProgramsUpgrader)
  .to(MainframeProgramsUpgrader)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeHardwareUpgrader>(TYPES.MainframeHardwareUpgrader)
  .to(MainframeHardwareUpgrader)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeHardwareState>(TYPES.MainframeHardwareState)
  .to(MainframeHardwareState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeProgramsState>(TYPES.MainframeProgramsState)
  .to(MainframeProgramsState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeProcessesState>(TYPES.MainframeProcessesState)
  .to(MainframeProcessesState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IMainframeState>(TYPES.MainframeState).to(MainframeState).inSingletonScope().whenTargetIsDefault();

container
  .bind<IMainframeHardwareAutomationState>(TYPES.MainframeHardwareAutomationState)
  .to(MainframeHardwareAutomationState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IMainframeProgramsAutomationState>(TYPES.MainframeProgramsAutomationState)
  .to(MainframeProgramsAutomationState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<ICloneLevelAutomationState>(TYPES.CloneLevelAutomationState)
  .to(CloneLevelAutomationState)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IContractsAutomationState>(TYPES.ContractsAutomationState)
  .to(ContractsAutomationState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IAutomationState>(TYPES.AutomationState).to(AutomationState).inSingletonScope().whenTargetIsDefault();

container.bind<IFormatter>(TYPES.Formatter).to(Formatter).inSingletonScope().whenTargetIsDefault();

container.bind<ICloneFactory>(TYPES.CloneFactory).to(CloneFactory).inSingletonScope().whenTargetIsDefault();

container.bind<IOwnedClonesState>(TYPES.OwnedClonesState).to(OwnedClonesState).inSingletonScope().whenTargetIsDefault();

container
  .bind<IOwnedClonesLevelUpgrader>(TYPES.OwnedClonesLevelUpgrader)
  .to(OwnedClonesLevelUpgrader)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IClonesState>(TYPES.ClonesState).to(ClonesState).inSingletonScope().whenTargetIsDefault();

container
  .bind<ISidejobActivityValidator>(TYPES.SidejobActivityValidator)
  .to(SidejobActivityValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<ISidejobsFactory>(TYPES.SidejobsFactory).to(SidejobsFactory).inSingletonScope().whenTargetIsDefault();

container
  .bind<ISidejobsActivityState>(TYPES.SidejobsActivityState)
  .to(SidejobsActivityState)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IContractsFactory>(TYPES.ContractsFactory).to(ContractsFactory).inSingletonScope().whenTargetIsDefault();

container
  .bind<IPrimaryActivityQueue>(TYPES.PrimaryActivityQueue)
  .to(PrimaryActivityQueue)
  .inSingletonScope()
  .whenTargetIsDefault();

container
  .bind<IContractActivityValidator>(TYPES.ContractActivityValidator)
  .to(ContractActivityValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind<IActivityState>(TYPES.ActivityState).to(ActivityState).inSingletonScope().whenTargetIsDefault();
