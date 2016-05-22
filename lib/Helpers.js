'use strict';

export default function defineReadOnlyProperty(object, propertyName, value) {
    Object.defineProperty(object, propertyName, {
        value: value,
        writable: false
    });
}

export function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
