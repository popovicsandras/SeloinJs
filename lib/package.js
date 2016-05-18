'use strict';

import Injector from './Injector.js';
import constructorAppender from './injection-strategies/ConstructorAppender.js';
import constructorPrepender from './injection-strategies/ConstructorPrepender.js';
import prototypePoisoner from './injection-strategies/PrototypePoisoner.js';
import CommonJSLoader from './loaders/CommonJSLoader.js';

export default {
    Injector: Injector,
    Strategies: {
        constructorAppender: constructorAppender,
        constructorPrepender: constructorPrepender,
        prototypePoisoner: prototypePoisoner
    },
    Loaders: {
        CommonJS: CommonJSLoader
    }
};
