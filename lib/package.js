'use strict';

import constructorAppender from './injection-strategies/ConstructorAppender.js';
import constructorPrepender from './injection-strategies/ConstructorPrepender.js';
import prototypePoisoner from './injection-strategies/PrototypePoisoner.js';
import CommonJSLoader from './loaders/CommonJSLoader.js';

export {default as Injector} from './Injector.js';
export const Strategies = {
    constructorAppender: constructorAppender,
    constructorPrepender: constructorPrepender,
    prototypePoisoner: prototypePoisoner
};
export const Loaders = {
    CommonJS: CommonJSLoader
};
