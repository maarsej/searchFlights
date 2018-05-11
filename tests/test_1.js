const chai = require("chai");
const sinon = require("sinon");
const assert = chai.assert;

const app = require('../app.js')

describe("find seperator", () => {

    it("origin|blah --> |", () => {
        assert.equal(app.findSeperator("origin|blah"), '|');
    });

    it("origin/blah --> /", () => {
        assert.equal(app.findSeperator("origin/blah"), '/');
    });

});

describe("sort by time", () => {

    it("[{depTime: 6/23/2014 21:45:00},{depTime: 6/18/2014 19:47:00}] --> [{depTime: 6/18/2014 19:47:00}, {depTime: 6/23/2014 21:45:00}] ", () => {
        assert.deepEqual(app.sortByTime([{ depTime: "6/23/2014 21:45:00" }, { depTime: "6/18/2014 19:47:00" }]), [{ depTime: "6/18/2014 19:47:00" }, { depTime: "6/23/2014 21:45:00" }])
    });


    it("[{depTime: 6/19/2014 12:45:00}, {depTime: 6/19/2014 12:35:00}] --> [{depTime: 6/19/2014 12:35:00}, {depTime: 6/19/2014 12:45:00}]", () => {
        assert.deepEqual(app.sortByTime([{ depTime: "6/19/2014 12:45:00" }, { depTime: "6/19/2014 12:35:00" }]), [{ depTime: "6/19/2014 12:35:00" }, { depTime: "6/19/2014 12:45:00" }])
    });


    it("[{depTime: 6/18/2014 19:47:00}, {depTime: 6/23/2014 21:45:00}] --> [{depTime: 6/18/2014 19:47:00}, {depTime: 6/23/2014 21:45:00}]  ", () => {
        assert.deepEqual(app.sortByTime([{depTime: "6/18/2014 19:47:00"}, {depTime: "6/23/2014 21:45:00"}]), [{ depTime: "6/18/2014 19:47:00" }, { depTime: "6/23/2014 21:45:00" }])
    });
})


describe ("sort by price", () => {

    it("[{price: $100.00},{price: $80.00}] --> [{price: $80.00},{price: $100.00}]", () => {
        assert.deepEqual(app.sortByPrice([{price: '$100.00'},{price: '$80.00'}]), [{price: '$80.00'},{price: '$100.00'}])
    })

    it("[{id: 1, price: '$100.00'},{id: 2, price: '$100.00'}] --> [{id: 1, price: '$100.00'},{id: 2, price: '$100.00'}]", () => {
        assert.deepEqual(app.sortByPrice([{id: 1, price: '$100.00'},{id: 2, price: '$100.00'}]), [{id: 1, price: '$100.00'},{id: 2, price: '$100.00'}])
    })

    it("[{price: '$80.00'},{price: '$100.00'}] --> [{price: '$80.00'},{price: '$100.00'}]", () => {
        assert.deepEqual(app.sortByPrice([{price: '$80.00'},{price: '$100.00'}]), [{price: '$80.00'},{price: '$100.00'}])
    })
})

describe ("filter", () => {

    it("[origin,title string, YVR,6/18/2014 9:10:00,YYZ,6/18/2014 19:47:00,$1093.00] --> [{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' }]", () => {
        assert.deepEqual(app.filter(["origin,title string\nYVR,6/18/2014 9:10:00,YYZ,6/18/2014 19:47:00,$1093.00"]), [{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' }])
    });
})

describe ("make dates uniform", () => {

    it("[{depTime: '6/18/2014 9:10:00', destTime: '6-19-2014 6:30:00'}] --> [{depTime: '6/18/2014 9:10:00', destTime: '6/19/2014 6:30:00'}]", () => {
        assert.deepEqual(app.makeDatesUniform([{depTime: '6/18/2014 9:10:00', destTime: '6-19-2014 6:30:00'}]), [{depTime: '6/18/2014 9:10:00', destTime: '6/19/2014 6:30:00'}])
    })
})

describe ("correct routes", () => {

    it ("[{orig: 'YYZ', dest: 'YYC'},{orig: 'LAX', dest: 'YYC'}], 'YYZ', 'YYC') --> [{orig: 'YYZ', dest: 'YYC'}]", () => {
        assert.deepEqual(app.correctRoute([{orig: 'YYZ', dest: 'YYC'},{orig: 'LAX', dest: 'YYC'}], 'YYZ', 'YYC'), [{orig: 'YYZ', dest: 'YYC'}])
    })
    it ("[{orig: 'YYZ', dest: 'YYC'},{orig: 'YYC', dest: 'YYC'}], 'YYZ', 'YYC') --> [{orig: 'YYZ', dest: 'YYC'}]", () => {
        assert.deepEqual(app.correctRoute([{orig: 'YYZ', dest: 'YYC'},{orig: 'YYC', dest: 'YYC'}], 'YYZ', 'YYC'), [{orig: 'YYZ', dest: 'YYC'}])
    })
})

describe ("remove dupes", () => {

    it("[{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' },{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' }]) --> [{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' }]", () => {
        assert.deepEqual(app.removeDupes([{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' },{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' }]),[{ orig: 'YVR', depTime: '6/18/2014 9:10:00', dest: 'YYZ', destTime: '6/18/2014 19:47:00', price: '$1093.00' }])
    })
})