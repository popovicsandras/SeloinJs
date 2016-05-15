'use strict';

const Container = require('../../lib/Container.js');

describe('Service Locator container', function (){
    
    it('first dummy test', function() {
        expect(new Container()).to.be.ok;            
    });
});