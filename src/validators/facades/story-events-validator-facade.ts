import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import storyEventsSchema from '@configs/schemas/story-events.json';
import { typedStoryEvents } from '@state/scenario-state';
import { type IStoryEventsValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class StoryEventsValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.StoryEventsValidator)
  private _storyEventsValidator!: IStoryEventsValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Story events validation has started');

    await this.validateSchema(ajv);
    this.validateStoryEvents();

    console.log('Story events validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'story events schema')}`);

    const validate = await ajv.compile(storyEventsSchema);

    if (!validate(typedStoryEvents)) {
      console.log(`\t\t${styleText('cyanBright', 'Story events schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateStoryEvents() {
    Object.keys(typedStoryEvents).forEach((storyEvent) => {
      this._storyEventsValidator.validate(storyEvent);
    });
  }
}
