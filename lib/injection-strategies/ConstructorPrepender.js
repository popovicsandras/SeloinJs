module.exports = function(injector, Service, ...args) {
    return new Service(injector, ...args);
};