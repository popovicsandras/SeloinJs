'use strict';

import constructorAppender from './injection-strategies/ConstructorAppender.js';
import constructorPrepender from './injection-strategies/ConstructorPrepender.js';
import prototypePoisoner from './injection-strategies/PrototypePoisoner.js';

export {default as Injector} from './Injector.js';
export const Strategies = {
    constructorAppender: constructorAppender,
    constructorPrepender: constructorPrepender,
    prototypePoisoner: prototypePoisoner
};