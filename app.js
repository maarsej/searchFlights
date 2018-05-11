const readline = require('readline');
const fs = require('fs');
const dir = './data';
const path = require('path');

const promiseAll = function (items, cb) {
    var promises = [];
    items.forEach(function (item, index) {
        promises.push(function (item, i) {
            return new Promise(function (resolve, reject) {
                return cb.apply(this, [item, index, resolve, reject]);
            });
        }(item, index))
    });
    return Promise.all(promises);
}
const readFiles = function (dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, function (err, filenames) {
            if (err) return reject(err);
            promiseAll(filenames,
                (filename, index, resolve, reject) => {
                    fs.readFile(path.resolve(dirname, filename), 'utf-8', function (err, content) {
                        if (err) return reject(err);
                        return resolve({ filename: filename, contents: content });
                    });
                })
                .then(results => {
                    return resolve(results);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    });
}

const findSeperator = function (dataBlock) {
    return dataBlock.substring(6, 7)
}

const sortByTime = function (array) {
    array.sort(function (a, b) {
        return new Date(a.depTime) - new Date(b.depTime);
    });
    return array
}

const sortByPrice = function (array) {
    array.sort(comparePrice)
    return array
}

const comparePrice = function (a, b) {
    if (Number(a.price.substring(1)) < Number(b.price.substring(1))) {
        return -1;
    } if (Number(a.price.substring(1)) > Number(b.price.substring(1))) {
        return 1;
    } else {
        return 0;
    }
}

const formatFlights = function (sortedFlights) {
    let output = []
    sortedFlights.forEach((flight) => {
        let flightString = `${flight.orig} --> ${flight.dest} (${flight.depTime} --> ${flight.destTime}) - ${flight.price}`
        output.push(flightString)
    })
    return output;
}

const correctRoute = function (filteredArray, origin, destination) {
    let valid = [];
    filteredArray.forEach((flight) => {
        if (flight.orig === origin && flight.dest === destination) {
            if (!valid.includes(flight)) {
                valid.push(flight)
            }
        }
    })
    return valid;
}

const filter = function (unfilteredArray) {
    let filtered = [];
    unfilteredArray.forEach((dataSet) => {
        let seperator = findSeperator(dataSet);
        let lines = dataSet.split('\n');
        for (let i = 1; i < lines.length; i++) {
            let items = lines[i].split(seperator);
            let output = { orig: items[0], depTime: items[1], dest: items[2], destTime: items[3], price: items[4] }
            filtered.push(output);
        }
    })
    return filtered;
}

const makeDatesUniform = function (filteredArray) {
    let uniformlyDated = []
    filteredArray.forEach((flight) => {
        let dep = flight.depTime.split('-').join('/');
        let dest = flight.destTime.split('-').join('/');
        let output = { ...flight, depTime: dep, destTime: dest }
        uniformlyDated.push(output);
    })
    return uniformlyDated;
}

const removeDupes = function (flightsArray) {
    flightsArray = flightsArray.filter((flights, index, self) =>
        index === self.findIndex((f) => (
            f.orig === flights.orig && f.depTime === flights.depTime && f.dest === flights.dest && f.destTime === flights.destTime && f.price === flights.price
        ))
    )
    return flightsArray;
}

const searchFlights = function (origin, destination) {
    const unfiltered = []
    readFiles("./data").then(files => {
        files.forEach((item, index) => {
            unfiltered.push(item.contents)
        });
        return unfiltered;
    }).then((unfiltered) => {
        return filter(unfiltered)
    }).then((filtered) => {
        return makeDatesUniform(filtered)
    }).then((filteredWithUniformDates) => {
        return correctRoute(filteredWithUniformDates, origin, destination)
    }).then((validFlights) => {
        return removeDupes(validFlights);
    }).then((noDuplicateFlights) => {
        return sortByPrice(sortByTime(noDuplicateFlights));
    }).then((sortedFlights) => {

        formattedOutput = formatFlights(sortedFlights)
        
        if (formattedOutput.length > 0) {
            formattedOutput.forEach((flight) => {
                console.log(flight)
            })
        } else {
            console.log(`No Flights Found for ${origin} --> ${destination}`)
        }

    }).catch(error => {
        console.log(error);
    });
}

appFunctions = {
    searchFlights: searchFlights,
    findSeperator: findSeperator,
    sortByTime: sortByTime,
    sortByPrice: sortByPrice,
    filter: filter,
    makeDatesUniform: makeDatesUniform,
    correctRoute: correctRoute,
    removeDupes: removeDupes,
    formatFlights: formatFlights
}

module.exports = appFunctions;