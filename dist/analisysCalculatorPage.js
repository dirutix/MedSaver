'use strict';

/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Composite, Page, TextView, Picker, Button, ui, TextInput, ScrollView } = require('tabris');

const MARGIN = 15;

let trayState = 'down';
let trayHeight;
let dragOffset;

const page = new Page({
  id: 'title',
  title: 'Калькулятор аналізів',
  autoDispose: false
});

const analysisList = [{
  name: "Проба Реберга",
  params: ["Вага(кг):", "Конц. креатиніну у сечі(результат аналізатора ммоль/л):", "Конц. креатиніну у сироватці(мкмоль/л):", "Добовий діурез(мл/добу):"],
  result: (weight, piss, serum, dobe) => {
    let res = [];
    let pDobe = piss * (dobe / 1000);
    res.push({ name: "Креатинін в сечі(добовий)", value: pDobe, measure: "ммоль/доба" });
    let min = dobe / 1440;
    res.push({ name: "Хвилинний діурез(за 1 хв)", value: min, measure: "мл/хв" });
    let s = (weight * 4 + 7) / (weight + 90);
    res.push({ name: "Площа поверхні тіла", value: s, measure: "" });
    let c = piss * 1000 * min / serum;
    let ck = c * 1.73 / s;
    res.push({ name: "Кліренс", value: ck, measure: "мл/хв" });
    let r = (ck - min) / ck * 100;
    res.push({ name: "Канальцева реабсорбція", value: r, measure: "%" });
    return res;
  }
}, {
  name: "Загальний білок та білкові фракції",
  params: ["Загальний білок(г/л):", "Альбуміни(%):", "Глобуліни(%):", "Альфа-1-глобуліни(%):", "Альфа-2-глобуліни(%):", "Бета-глобуліни(%):", "Гамма-глобуліни(%):"],
  result: (gen, alb, gl, alf1, alf2, beta, gamma) => {
    let res = [];
    let coef = gen / 100;
    res.push({ name: "Альбуміни", value: coef * alb, measure: "г/л" });
    res.push({ name: "Глобуліни", value: coef * gl, measure: "г/л" });
    res.push({ name: "Фракція альфа-1-глобулінів(Alpha 1)", value: coef * alf1, measure: "г/л" });
    res.push({ name: "Фракція альфа-2-глобулінів(Alpha 2)", value: coef * alf2, measure: "г/л" });
    res.push({ name: "Фракція бета-глобулінів(Beta)", value: coef * beta, measure: "г/л" });
    res.push({ name: "Фракція гамма-глобулінів(Gamma)", value: coef * gamma, measure: "г/л" });
    return res;
  }
}, {
  name: "Кальцій іонізований",
  params: ["Кальцій:", "Aльбумін крові(од)):"],
  result: (ca, alb) => {
    return [{
      name: "Кальцій іонізований",
      value: ca * 878 / (alb * 15.05 + 1053),
      measure: "моль/літр"
    }];
  }
}, {
  name: "Лейкоцитарний індекс інтоксикації",
  params: ["Міелоцити:", "Метаміелоцити:", "Паличкоядерні:", "Сегментоядерні:", "Площа клітини:", "Лімфоцити:", "Моноцити:", "Еозинофіли:"],
  result: (mi, met, branch, seg, square, limf, mon, eos) => {
    return [{
      name: "Лейкоцитарний індекс інтоксикації",
      value: (4 * mi + 3 * met + 2 * branch + seg) * (square + 1) / ((limf + mon) * (eos + 1)),
      measure: "од."
    }];
  }
}, {
  name: "Концентрація гемоглобіну в еритроциті",
  params: ["Гемоглобін(г/дл):", "Гематокрит(%):"],
  result: (hb, ht) => {
    return [{
      name: "Концентрація гемоглобіну в еритроциті",
      value: hb * 100 / ht,
      measure: "г/дл"
    }];
  }
}];

new TextView({
  id: 'analysisLabel',
  left: MARGIN,
  top: '#title 18',
  width: 120,
  font: 'bold 19px',
  text: 'Аналіз:'
}).appendTo(page);

new Picker({
  id: 'analysisPicker',
  left: '#analysisLabel 15',
  right: MARGIN,
  baseline: '#analysisLabel',
  itemCount: analysisList.length,
  itemText: index => analysisList[index].name
}).on('select', ({ index }) => {
  let block = page.find("#parameters");
  block.children().dispose();
  analysisList[index].params.forEach((value, index, arr) => {
    new TextView({
      id: 'argument' + index,
      top: '#argument' + (index - 1) + ' 10',
      width: 200,
      font: '17px',
      text: value
    }).appendTo(block);

    new TextInput({
      alignment: 'left',
      left: '#argument' + index + ' 10',
      top: '#argument' + (index - 1),
      width: 80,
      borderColor: '#FFA700',
      message: 'Type here',
      keyboard: 'number'
    }).appendTo(block);
  });
}).appendTo(page);

new Composite({
  id: 'parameters',
  left: MARGIN,
  top: '#analysisPicker 10',
  right: MARGIN
}).appendTo(page);

new Button({
  id: 'calculateButton',
  text: 'Порахувати',
  top: '#parameters 18',
  height: 50,
  width: 140,
  centerX: 0
}).on('select', () => {
  calculate();
}).appendTo(page);

new TextView({
  id: "horizontalStripe",
  left: 0,
  right: 0,
  top: '#calculateButton 15',
  font: "2px",
  background: "#FFA700",
  width: 2
}).appendTo(page);

let scrollView = new ScrollView({
  left: 0, right: 0, top: '#horizontalStripe 5', bottom: 0,
  direction: 'vertical'
}).appendTo(page);

let message = new TextView({
  id: "message",
  left: 0, right: 0,
  font: "bold 19px",
  textColor: "#FFA700"
}).appendTo(scrollView);

function calculate() {
  let params = page.find(TextInput);
  let map = Array.prototype.map;
  let index = page.find("#analysisPicker").get('selectionIndex');
  let analys = analysisList[index];
  params = map.call(params, function (item) {
    return parseFloat(item.text);
  });
  params = params.filter(function (n) {
    return n !== '';
  });
  if (params.length < analys.params.length) {
    message.text = "Шо";
  } else {
    message.text = "";
    let res = analys.result(...params);
    for (let out of res) {
      message.text += out.name + " = " + out.value.toFixed(3) + " " + out.measure + "\n";
    }
  }
}

module.exports = page;