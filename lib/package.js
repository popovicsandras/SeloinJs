'use strict';

import SimpleResolver from './resolvers/SimpleResolver';
import ParamListAppender from './resolvers/ParamListAppender';
import ParamListPrepender from './resolvers/ParamListPrepender';
import PrototypePoisoner from './resolvers/PrototypePoisoner';

export {default as Injector} from './Injector.js';
export const Resolvers = {
    SimpleResolver: SimpleResolver,
    ParamListAppender: ParamListAppender,
    ParamListPrepender: ParamListPrepender,
    PrototypePoisoner: PrototypePoisoner
};