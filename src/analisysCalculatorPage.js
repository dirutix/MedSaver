const {Composite, Page, TextView, Picker, Slider, Button, ScrollView} = require('tabris');

const MARGIN = 15;
const TEXT = 'There was nothing so very remarkable in that; nor did Alice ' +
  'think it so very much out of the way to hear the Rabbit say to itself, ‘Oh ' +
  'dear! Oh dear! I shall be late!’ (when she thought it over afterwards, it ' +
  'occurred to her that she ought to have wondered at this, but at the time ' +
  'it all seemed quite natural); but when the Rabbit actually took a watch ' +
  'out of its waistcoat-pocket, and looked at it, and then hurried on, Alice ' +
  'started to her feet, for it flashed across her mind that she had never ' +
  'before seen a rabbit with either a waistcoat-pocket, or a watch to take ' +
  'out of it, and burning with curiosity, she ran across the field after it, ' +
  'and fortunately was just in time to see it pop down a large rabbit-hole ' +
  'under the hedge.';

let trayState = 'down';
let trayHeight;
let dragOffset;

const page = new Page({
  id: 'title',
  title: 'Калькулятор штамів',
  autoDispose: false
});

const medcineList = [
  {
    name: "Анальгін",
    child: true,
    adult: true,
    kilogramsDozing: false,
    childKgLimit: null,
    mlPerKgList: [],
    childAgeRangeEl: [12, 14, 18],
    childDozes: ["½ таблетки", "½-1 таблетка"],
    adultDoze: "½-1 таблетка"
  },
  {
    name: "Анаприлін",
    child: true,
    adult: true,
    kilogramsDozing: true,
    childKgLimit: null,
    childAgeRangeEl: [3, 18],
    mlPerKgList: [0,25],
    childDozes: [],
    adultDoze: "40 мг"
  },
  {
    name: "Аспаркам",
    child: false,
    adult: true,
    kilogramsDozing: false,
    childKgLimit: null,
    childAgeRangeEl: [],
    mlPerKgList: [],
    childDozes: [],
    adultDoze: "1 таблетка"
  },
  {
    name: "Аугментин",
    child: true,
    adult: true,
    kilogramsDozing: true,
    childKgLimit: 40,
    childAgeRangeEl: [0, 18],
    mlPerKgList: [25],
    childDozes: [],
    adultDoze: "1 таблетка"
  },
  {
    name: "Бісопролол",
    child: false,
    adult: true,
    kilogramsDozing: false,
    childKgLimit: null,
    childAgeRangeEl: [],
    mlPerKgList: [],
    childDozes: [],
    adultDoze: "1,25 мг"
  },
  {
    name: "Ванкоміцин",
    child: false,
    adult: true,
    kilogramsDozing: false,
    childKgLimit: null,
    childAgeRangeEl: [0, 12, 18],
    mlPerKgList: [],
    childDozes: [10, 500],
    adultDoze: "500 мг"
  }

]

const MEDCINE = ['Аспаркам',
'Біфрен',
'Гропринозин',
'Ереспал',
'Ібупрофен',
'Ікервис',
'Клотримазол',
'Магне-В6',
'Мукалтин',
'Німесил',
'Новірин',
'Но-шпа',
'Олембік-Н',
'Омез',
'Парацетамол',
'Синупрет',
'Тіотриазолін',
'Фарлінекс',
'Флуконазол',
'Целіста'];

new TextView({
  id: 'medcineLabel',
  left: MARGIN, 
  top:   '#title 18', 
  width: 120,
  text: 'Препарат:'
}).appendTo(page);

new Picker({
  id: 'medcinePicker',
  left: '#medcineLabel 15', 
  right: MARGIN, 
  baseline: '#medcineLabel',
  itemCount: medcineList.length,
  itemText: index => medcineList[index].name
}).appendTo(page);

new TextView({
  id: 'ageLabel',
  text: 'Вік:',
  left: MARGIN,
  width: 120,
  top: '#medcineLabel 18'
}).appendTo(page);

const AGE = [];
for(let i = 0; i < 100; i++)
  AGE[i] = String(i);

new Picker({
  id: 'agePicker',
  right: MARGIN,
  baseline: '#ageLabel',
  left: '#ageLabel 15',
  itemCount: AGE.length,
  itemText: index => AGE[index]
}).appendTo(page);

new Composite({
  id: 'weightPanel',
  left: MARGIN, 
  top: '#ageLabel 18', 
  right: MARGIN
}).append(
  new TextView({
    id: 'weightLabel',
    left: 0, 
    centerY: 0, 
    width: 120,
    text: 'Маса тіла:'
  })
).append(
  new TextView({
    id: 'weight',
    right: MARGIN, 
    centerY: 0, 
    width: 50,
    text: '0 Кг'
  })
).append(
  new Slider({
    id: 'weightSlider',
    left: '#weightLabel 15', 
    right: '#weight 15', 
    centerY: 0
  }).on('selectionChanged', ({value}) => {
    page.find('#weight').set('text', value + ' Кг');
  })
).appendTo(page);

new Button({
  id: 'calculateButton',
  text: 'Порахувати',
  top: '#weightPanel 18',
  height: 50,
  width: 140,
  centerX: 0
}).on('select', () => {
  calculate();
}).appendTo(page);

function calculate() {
  /* message.text = [
    'Flight booked for: ' + page.children('#nameInput').first().text,
    'Destination: ' + AGE[page.children('#countryPicker').first().selectionIndex],
    'Seating: ' + createSeating(),
    'Luggage: ' + createWeight(),
    'Meal: ' + createMeal(),
    'Redeem miles: ' + createFrequentFlyerInfo()
  ].join('\n') + '\n';*/
}
/*
function createSeating() {
  let seating = 'Anywhere';
  scrollView.children('RadioButton').forEach((button) => {
    if (button.checked) {
      seating = button.text;
    }
  });
  seating += ', ' + PILLS[scrollView.children('#classPicker').first().selectionIndex];
  return seating;
}

function createWeight() {
  let panel = scrollView.children('#luggagePanel');
  return panel.children('#luggageSlider').first().selection + ' kg';
}

function createMeal() {
  return scrollView.children('#veggieChoice').first().checked ? 'Vegetarian' : 'Standard';
}
*/
module.exports = page;