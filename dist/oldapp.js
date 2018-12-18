'use strict';

const dozesCalculatorPage = require('./dozesCalculator');
const analisysPage = require('./analisysCalculatorPage');
const thesaurusPage = require('./thesaurus');
const { Button, NavigationView, Page, contentView, ui } = require('tabris');

// blue = #009AFD
// yellow = #FFA700
// green = #00BC6F

const navigationView = new NavigationView({
    left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

const mainPage = new Page({
    title: 'MedSaver'
}).appendTo(navigationView);

new Button({
    left: 8, top: 'prev() 8', right: 8,
    height: 190,
    textColor: "white",
    font: "bold 30px",
    background: "#009AFD",
    text: dozesCalculatorPage.title
}).on('select', () => dozesCalculatorPage.appendTo(navigationView)).appendTo(mainPage);

new Button({
    left: 8, top: 'prev() 8', right: 8,
    height: 190,
    textColor: "white",
    background: "#FFA700",
    font: "bold 30px",
    text: analisysPage.title
}).on('select', () => analisysPage.appendTo(navigationView)).appendTo(mainPage);

new Button({
    left: 8, top: 'prev() 8', right: 8,
    height: 190,
    textColor: "white",
    font: "bold 30px",
    background: "#00BC6F",
    text: thesaurusPage.title
}).on('select', () => thesaurusPage.appendTo(navigationView)).appendTo(mainPage);