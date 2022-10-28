"use strict";

function randomSeed() {
    return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function getRandomArbitrary() {
    return Math.abs(randomSeed());
}

exports.getRandomArbitrary = getRandomArbitrary;