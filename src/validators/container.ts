import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

export const validatorContainer = new Container();
export const validatorDecorators = getDecorators(validatorContainer);
