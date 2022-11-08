#!/usr/bin/env node

//import neccesary packages
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";

//create arguement to use minimist
const args = minimist(process.argv.slice(2));

// help text
if (args.h) {
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE')
    console.log('     -h            Show this help message and exit.')
    console.log('     -n, -s        Latitude: N positive; S negative.')
    console.log('     -e, -w           Longitude: E positive; W negative.')
    console.log('     -z           Time zone: uses tz.guess() from moment-timezone by default.')
    console.log('     -d 0-6           Day to retrieve weather: 0 is today; defaults to 1.')
    console.log('     -j           Echo pretty JSON from open-mateo API and exit.')
    process.exit(0);
}

// declare timezone, lattitude, and longitude variables
var timezone = moment.tz.guess();
var latitude;
var longitude;

//ensure values are within the range
if(args.n || args.e) {
  if(args.e < 0) {
    console.log("Longitude must be in range")
    process.exit(0)
  }
  if (args.n < 0 ) {
      console.log("Latitude must be in range")
      process.exit(0)
    }

}

if(args.s || args.s) {
  if(args.w > 0) {
      console.log("Longitude must be in range")
      process.exit(0)
    }
  if (args.s > 0) {
    console.log("Latitude must be in range")
    process.exit(0)
  }
}


if(args.n) { latitude = args.n; }
if(args.s) { latitude = args.s * -1; }

if(args.e) { longitude = args.e; }
if(args.w) { longitude = args.w * -1; }

if(args.t) { timezone = args.t; }
timezone.replace("/", "%2");

if(!latitude) {
  console.log("Latitude must be in range")
  process.exit(0)
} else if (!longitude) {
  console.log("Longitude must be in range")
  process.exit(0)
}

//request
var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) + '&longitude=' + String(longitude) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone;
//response and data
const response = await fetch(url);
const data = await response.json();

if(args.j) {
    console.log(data);
    process.exit(0);
}

const days = args.d

//displays if you need ur galoshed or not
if (data.daily.precipitation_hours[days] == 0) {
  console.log("You don't need your galoshes ")
} else {
  console.log("You may need your galoshes ")
}

//displays the correct of days
if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

// exit
process.exit(0);
