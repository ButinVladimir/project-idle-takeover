import { CodeGeneratorDescriptionEffectRenderer } from './code-generator-description-effect-renderer';
import { CircuitDesignerDescriptionEffectRenderer } from './circuit-designer-description-effect-renderer';
import { DealMakerDescriptionEffectRenderer } from './deal-maker-description-effect-renderer';
import { InformationCollectorDescriptionEffectRenderer } from './information-collector-description-effect-renderer';
import { MainframeHardwareAutobuyerDescriptionEffectRenderer } from './mainframe-hardware-autobuyer-description-effect-renderer';
import { MainframeProgramsAutobuyerDescriptionEffectRenderer } from './mainframe-programs-autobuyer-description-effect-renderer';
import { CloneLevelAutoupgraderDescriptionEffectRenderer } from './clone-level-autoupgrader-description-effect-renderer';
import { ShareServerDescriptionEffectRenderer } from './share-server-description-effect-renderer';
import { PredictiveComputatorDescriptionEffectRenderer } from './predictive-computator-description-effect-renderer';
import { PeerReviewerDescriptionEffectRenderer } from './peer-reviewer-description-effect-renderer';
import { MultiplierProgramName, AutobuyerProgramName, OtherProgramName } from '@state/mainframe-state';

export const rendererMap = {
  [MultiplierProgramName.codeGenerator]: CodeGeneratorDescriptionEffectRenderer,
  [MultiplierProgramName.circuitDesigner]: CircuitDesignerDescriptionEffectRenderer,
  [MultiplierProgramName.dealMaker]: DealMakerDescriptionEffectRenderer,
  [MultiplierProgramName.informationCollector]: InformationCollectorDescriptionEffectRenderer,
  [AutobuyerProgramName.mainframeHardwareAutobuyer]: MainframeHardwareAutobuyerDescriptionEffectRenderer,
  [AutobuyerProgramName.mainframeProgramsAutobuyer]: MainframeProgramsAutobuyerDescriptionEffectRenderer,
  [AutobuyerProgramName.cloneLevelAutoupgrader]: CloneLevelAutoupgraderDescriptionEffectRenderer,
  [OtherProgramName.shareServer]: ShareServerDescriptionEffectRenderer,
  [OtherProgramName.predictiveComputator]: PredictiveComputatorDescriptionEffectRenderer,
  [OtherProgramName.peerReviewer]: PeerReviewerDescriptionEffectRenderer,
};
