# Search Flight by Jacob Maarse

This project was designed/outlined as well as written for tripstack

## quick start

After cloning this repository and changing into its main directory, run the following commands:

```
npm install

npm start

```

Following those commands you will find the app running at localhost:8080

Example search (as a url): http://localhost:8080/searchFlights/YYZ/YYC

This search will return results in the command line, this output will be sorted by price followed by departure date,
continuing with our example the output would be as follows: 

```
YYZ --> YYC (6/15/2014 6:45:00 --> 6/15/2014 8:54:00) - $578.00
YYZ --> YYC (6/22/2014 12:00:00 --> 6/22/2014 14:09:00) - $630.00
YYZ --> YYC (6/26/2014 12:00:00 --> 6/26/2014 14:09:00) - $630.00
```

## test suite

This app is supported with test suite coverage, that automates checking the functions that the app is built on, these functions were modularized to improve testability as well as versatility

To run the test suite:

```
npm test
```