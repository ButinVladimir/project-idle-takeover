import { BaseController } from '@shared/index';
import { IProcess } from '@state/mainframe-state';

export class ProcessesListFilterController extends BaseController {
  listProcesses(): IProcess[] {
    return this.mainframeState.processes.listProcesses();
  }
}
