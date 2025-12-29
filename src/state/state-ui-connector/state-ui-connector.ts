import { injectable } from 'inversify';
import { IStateUIConnector } from './interfaces';
import { BaseComponent } from '@shared/index';
import {
  ARRAY_MODIFYING_METHODS,
  MAP_MODIFYING_METHODS,
  PARTIAL_UPDATE_UI_EVENT,
  SET_MODIFYING_METHODS,
} from './constants';

@injectable()
export class StateUIConnector implements IStateUIConnector {
  private _componentEventsMap: WeakMap<BaseComponent, Set<symbol>>;
  private _eventComponentsMap: Map<symbol, Set<BaseComponent>>;
  private _eventEmitterEventsMap: WeakMap<any, Set<symbol>>;
  private _currentlyRenderingComponent?: BaseComponent;
  private _enqueuedEvents: Set<symbol>;

  constructor() {
    this._eventEmitterEventsMap = new WeakMap<any, Set<symbol>>();
    this._componentEventsMap = new WeakMap<BaseComponent, Set<symbol>>();
    this._eventComponentsMap = new Map<symbol, Set<BaseComponent>>();
    this._enqueuedEvents = new Set<symbol>();

    this._eventComponentsMap.set(PARTIAL_UPDATE_UI_EVENT, new Set<BaseComponent>());
  }

  connectComponent(component: BaseComponent): void {
    const existingEvents = this._componentEventsMap.get(component);

    if (existingEvents) {
      existingEvents.forEach((event) => {
        this._eventComponentsMap.get(event)?.add(component);
      });
    } else {
      this._componentEventsMap.set(component, new Set<symbol>());
    }
  }

  disconnectComponent(component: BaseComponent): void {
    const currentEvents = this._componentEventsMap.get(component);

    currentEvents?.forEach((event) => {
      this._eventComponentsMap.get(event)?.delete(component);
    });
  }

  startRendering(component: BaseComponent): void {
    this._currentlyRenderingComponent = component;

    const currentEvents = this._componentEventsMap.get(component);

    currentEvents?.forEach((event) => {
      this._eventComponentsMap.get(event)?.delete(component);
    });

    currentEvents?.clear();
  }

  stopRendering() {
    if (this._currentlyRenderingComponent?.hasPartialUpdate) {
      this.connectEvent(PARTIAL_UPDATE_UI_EVENT);
    }

    this._currentlyRenderingComponent = undefined;
  }

  registerEventEmitter(eventEmitter: any, properties: string[]): void {
    this._eventEmitterEventsMap.set(eventEmitter, new Set<symbol>());

    for (const propertyKey of properties) {
      const property = eventEmitter[propertyKey];

      if (property instanceof Array) {
        this.wrapArray(eventEmitter, propertyKey);
      } else if (property instanceof Map) {
        this.wrapMap(eventEmitter, propertyKey);
      } else if (property instanceof Set) {
        this.wrapSet(eventEmitter, propertyKey);
      } else {
        this.wrapPrimiveProperty(eventEmitter, propertyKey);
      }
    }
  }

  unregisterEventEmitter(eventEmitter: any): void {
    this._eventEmitterEventsMap.get(eventEmitter)?.forEach((event) => {
      this.unregisterEvent(event);
    });

    this._eventEmitterEventsMap.delete(eventEmitter);
  }

  fireEvents(): void {
    this._enqueuedEvents.forEach((event) => {
      this._eventComponentsMap.get(event)?.forEach((component) => {
        component.requestUpdate();
      });
    });

    this._enqueuedEvents.clear();

    this._eventComponentsMap.get(PARTIAL_UPDATE_UI_EVENT)?.forEach((component) => {
      component.handlePartialUpdate();
    });
  }

  private registerEvent(eventEmitter: any, propertyKey: string): symbol {
    const eventKey = Symbol(`${eventEmitter.constructor.name}:${propertyKey}:event`);

    this._eventEmitterEventsMap.get(eventEmitter)!.add(eventKey);
    this._eventComponentsMap.set(eventKey, new Set<BaseComponent>());

    return eventKey;
  }

  private unregisterEvent(event: symbol) {
    const components = this._eventComponentsMap.get(event);

    components?.forEach((component) => {
      this._componentEventsMap.get(component)?.delete(event);
    });

    components?.clear();

    this._eventComponentsMap.delete(event);
  }

  private connectEvent(event: symbol): void {
    if (this._currentlyRenderingComponent) {
      this._eventComponentsMap.get(event)?.add(this._currentlyRenderingComponent);
      this._componentEventsMap.get(this._currentlyRenderingComponent)?.add(event);
    }
  }

  private enqueueEvent(event: symbol): void {
    this._enqueuedEvents.add(event);
  }

  private wrapPrimiveProperty(eventEmitter: any, propertyKey: string) {
    const descriptor = Reflect.getOwnPropertyDescriptor(eventEmitter, propertyKey);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _stateUIConnector = this;

    const eventKey = this.registerEvent(eventEmitter, propertyKey);
    const valueKey = Symbol(`${propertyKey}:value`);
    eventEmitter[valueKey] = descriptor?.value;

    Reflect.defineProperty(eventEmitter, propertyKey, {
      get: function () {
        _stateUIConnector.connectEvent(eventKey);

        return eventEmitter[valueKey];
      },
      set: function (newValue) {
        if (this[valueKey] !== newValue) {
          _stateUIConnector.enqueueEvent(eventKey);

          this[valueKey] = newValue;
        }
      },
    });
  }

  private wrapArray(eventEmitter: any, propertyKey: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _stateUIConnector = this;

    const eventKey = this.registerEvent(eventEmitter, propertyKey);

    const proxy = new Proxy(eventEmitter[propertyKey], {
      get(target, p) {
        if (ARRAY_MODIFYING_METHODS.has(p)) {
          _stateUIConnector.enqueueEvent(eventKey);
        }

        _stateUIConnector.connectEvent(eventKey);

        const propertyValue = Reflect.get(target, p);

        if (propertyValue instanceof Function) {
          return propertyValue.bind(target);
        }

        return propertyValue;
      },
      set(target, p, newValue, receiver) {
        _stateUIConnector.enqueueEvent(eventKey);

        return Reflect.set(target, p, newValue, receiver);
      },
    });
    eventEmitter[propertyKey] = proxy;
  }

  private wrapMap(eventEmitter: any, propertyKey: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _stateUIConnector = this;

    const eventKey = this.registerEvent(eventEmitter, propertyKey);

    const proxy = new Proxy(eventEmitter[propertyKey], {
      get(target, p) {
        if (MAP_MODIFYING_METHODS.has(p)) {
          _stateUIConnector.enqueueEvent(eventKey);
        }

        _stateUIConnector.connectEvent(eventKey);

        const propertyValue = Reflect.get(target, p);

        if (propertyValue instanceof Function) {
          return propertyValue.bind(target);
        }

        return propertyValue;
      },
    });
    eventEmitter[propertyKey] = proxy;
  }

  private wrapSet(eventEmitter: any, propertyKey: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _stateUIConnector = this;

    const eventKey = this.registerEvent(eventEmitter, propertyKey);

    const proxy = new Proxy(eventEmitter[propertyKey], {
      get(target, p) {
        if (SET_MODIFYING_METHODS.has(p)) {
          _stateUIConnector.enqueueEvent(eventKey);
        }

        _stateUIConnector.connectEvent(eventKey);

        const propertyValue = Reflect.get(target, p);

        if (propertyValue instanceof Function) {
          return propertyValue.bind(target);
        }

        return propertyValue;
      },
    });
    eventEmitter[propertyKey] = proxy;
  }
}
