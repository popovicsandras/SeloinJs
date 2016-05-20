'use strict';

export default function defineReadOnlyProperty(object, propertyName, value) {
    Object.defineProperty(object, propertyName, {
        value: value,
        writable: false
    });
}
