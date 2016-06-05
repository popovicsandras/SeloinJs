'use strict';

import SimpleResolver from './Resolvers/SimpleResolver';
import ParamListAppender from './Resolvers/ParamListAppender';
import ParamListPrepender from './Resolvers/ParamListPrepender';
import PrototypePoisoner from './Resolvers/PrototypePoisoner';

export {default as Injector} from './Injector.js';
export const Resolvers = {
    SimpleResolver: SimpleResolver,
    ParamListAppender: ParamListAppender,
    ParamListPrepender: ParamListPrepender,
    PrototypePoisoner: PrototypePoisoner
};