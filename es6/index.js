'use strict';

import NoInjection from './Injectors/NoInjection';
import ParamListAppender from './Injectors/ParamListAppender';
import ParamListPrepender from './Injectors/ParamListPrepender';
import PrototypePoisoner from './Injectors/PrototypePoisoner';

export {default as Container} from './Container';

const Injectors = {
    NoInjection: NoInjection,
    ParamListAppender: ParamListAppender,
    ParamListPrepender: ParamListPrepender,
    PrototypePoisoner: PrototypePoisoner
};
export {Injectors};