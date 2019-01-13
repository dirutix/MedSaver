/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const {Composite, Page, TextView, Picker, Button, ui, TextInput, NavigationView, ScrollView} = require('tabris');

const MARGIN = 15;

let trayState = 'down';
let trayHeight;
let dragOffset;

const page = new Page({
  id: 'title',
  title: 'Калькулятор аналізів',
  autoDispose: false
}).on('appear', () => {
  //ui.navigationBar.displayMode = "hide";
})

const analysisList = [
  {
    name: "Проба Реберга",
    params: ["Вага(кг):", "Конц. креатиніну у сечі(результат аналізатора ммоль/л):", "Конц. креатиніну у сироватці(мкмоль/л):", "Добовий діурез(мл/добу):"],
    result: (weight, piss, serum, dobe) => {
      let pDobe = piss * (dobe/1000);
      let min = dobe/1440;
      let s = (4 * weight + 7)/(weight + 90);
      let c = (piss * 1000 * min)/serum;
      let ck = c * 1.73 / s;
      let r = (ck - min)/ck * 100;
      return min;
    },
    measure: "од."
  },
  {
    name: "Кальцій іонізований",
    params: ["Кальцій:", "Aльбумін крові(од)):"],
    result: (ca, alb) => {
      return ca * 878/(alb * 15.05 + 1053);
    },
    measure: "моль/літр"
  },
  {
    name: "Лейкоцитарний індекс інтоксикації",
    params: ["Міелоцити:", "Метаміелоцити:", "Паличкоядерні:", "Сегментоядерні:", "Площа клітини:", "Лімфоцити:", "Моноцити:", "Еозинофіли:"],
    result: (mi, met, branch, seg, square, limf, mon, eos) => {
      return (4 * mi + 3 * met + 2 * branch + seg) * (square + 1)/((limf + mon)*(eos + 1));
    },
    measure: "од."
  },
  {
    name: "Середній об'єм еритроцита",
    params: ["Гематокрит(%):", "Кількість еритроцитів(10^12/л):"],
    result: (hem, quant) => {
      return hem * 10/quant;
    },
    measure: "фл(фемолітр)"
  },
  {
    name: "Концентрація гемоглобіну в еритроциті",
    params: ["Гемоглобін(г/дл):", "Гематокрит(%):"],
    result: (hb, ht) => {
      return hb * 100/ht;
    },
    measure: "г/дл"
  }

]

new TextView({
  id: 'analysisLabel',
  left: MARGIN, 
  top:   '#title 18', 
  width: 120,
  font: '18px bold',
  text: 'Аналіз:'
}).appendTo(page);

new Picker({
  id: 'analysisPicker',
  left: '#analysisLabel 15', 
  right: MARGIN, 
  baseline: '#analysisLabel',
  itemCount: analysisList.length,
  itemText: index => analysisList[index].name
}).on('select', ({index}) => {
  let block = page.find("#parameters");
  block.children().dispose();
  analysisList[index].params.forEach((value, index, arr) => {
    new TextView({
      id: 'argument' + index,
      top: '#argument' + (index-1) + ' 10',
      width: 150,
      font: '18px',
      text: value
    }).appendTo(block);

    new TextInput({
      alignment: 'left',
      left: '#argument' + index + ' 10',
      top: '#argument' + (index-1),
      width: 80,
      borderColor: 'yellow',
      message: 'Type here',
      keyboard: 'number'
    }).appendTo(block);
  })
})
.appendTo(page);

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
  top: '#calculateButton 30',
  font: "2px",
  background: "#009AFD",
  width: 2
}).appendTo(page);

let message = new TextView({
  id: "message",
  left: MARGIN, 
  right: MARGIN, 
  top: '#horizontalStripe 5',
  font: "bold 20px",
  textColor: "#009AFD"
}).appendTo(page);

function calculate() {
  let params = page.find(TextInput);
  let map = Array.prototype.map;
  let index = page.find("#analysisPicker").get('selectionIndex');
  let analys = analysisList[index];
  params = map.call(params, function(item) {return item.text});
  params = params.filter(function(n) {return n !== ''});
  if(params.length < analys.params.length){
    message.text = "Шо";
  } else {
    message.text = analys.name + " = " + analys.result(...params).toFixed(3) + " " + analys.measure;
  }

}

module.exports = page;
