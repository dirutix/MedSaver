'use strict';

const {
  Button, CheckBox, Composite, TextView, TextInput, Picker, RadioButton, ScrollView, Slider, Switch, ui
} = require('tabris');

let scrollView = new ScrollView({ left: 0, top: 0, right: 0, bottom: 0 }).appendTo(ui.contentView);

const AGE = [];
const PILLS = ['Аспаркам', 'Біфрен', 'Гропринозин', 'Ереспал', 'Ібупрофен', 'Ікервис', 'Клотримазол', 'Магне-В6', 'Мукалтин', 'Німесил', 'Новірин', 'Но-шпа', 'Олембік-Н', 'Омез', 'Парацетамол', 'Синупрет', 'Тіотриазолін', 'Фарлінекс', 'Флуконазол', 'Целіста'];

for (let i = 0; i < 100; i++) AGE[i] = String(i);

new TextView({
  id: 'ageLabel',
  text: 'Вік:'
}).appendTo(scrollView);

new Picker({
  id: 'agePicker',
  itemCount: AGE.length,
  itemText: index => AGE[index]
}).appendTo(scrollView);

new TextView({
  id: 'pillsLabel',
  text: 'Препарат:'
}).appendTo(scrollView);

new Picker({
  id: 'pillsPicker',
  itemCount: PILLS.length,
  itemText: index => PILLS[index]
}).appendTo(scrollView);

new Composite({
  id: 'luggagePanel'
}).append(new TextView({
  id: 'luggageLabel',
  text: 'Маса тіла:'
})).append(new TextView({
  id: 'weight',
  text: '0 Kg'
})).append(new Slider({
  id: 'weightSlider'
}).on('selectionChanged', ({ value }) => {
  scrollView.find('#weight').set('text', value + ' Kg');
})).appendTo(scrollView);

new Button({
  id: 'countButton',
  text: 'Порахувати',
  background: '#8b0000',
  textColor: 'white'
}).on('select', () => {
  updateMessage();
}).appendTo(scrollView);

let message = new TextView({
  left: 10, right: 10, top: '#countButton 10'
}).appendTo(scrollView);

scrollView.apply({
  '#ageLabel': { left: 10, top: 50, width: 120 },
  '#agePicker': { left: '#ageLabel 10', right: 10, baseline: '#ageLabel' },
  '#pillsLabel': { left: 10, top: '#ageLabel 18', width: 120 },
  '#pillsPicker': { left: '#pillsLabel 10', right: 10, baseline: '#pillsLabel' },
  '#weight': { right: 10, centerY: 0, width: 50 },
  '#weightSlider': { left: '#pillsLabel 10', right: '#weight 10', centerY: 0 },
  '#countButton': { left: 10, right: 10, top: '#weightSlider 18' }
});

function updateMessage() {
  message.text = ['Flight booked for: ' + scrollView.children('#nameInput').first().text, 'Destination: ' + AGE[scrollView.children('#agePicker').first().selectionIndex], 'Seating: ' + createSeating(), 'Luggage: ' + createWeight(), 'Meal: ' + createMeal(), 'Redeem miles: ' + createFrequentFlyerInfo()].join('\n') + '\n';
}

function createSeating() {
  let seating = 'Anywhere';
  scrollView.children('RadioButton').forEach(button => {
    if (button.checked) {
      seating = button.text;
    }
  });
  seating += ', ' + PILLS[scrollView.children('#pillsPicker').first().selectionIndex];
  return seating;
}

function createWeight() {
  let panel = scrollView.children('#luggagePanel');
  return panel.children('#weightSlider').first().selection + ' kg';
}

function createMeal() {
  return scrollView.children('#veggieChoice').first().checked ? 'Vegetarian' : 'Standard';
}

function createFrequentFlyerInfo() {
  let panel = scrollView.children('#milesPanel');
  let info = panel.children('#milesSwitch').first().checked ? 'Yes' : 'No';
  info += ', acct: ' + scrollView.children('#flyerNumberInput').first().text;
  return info;
}