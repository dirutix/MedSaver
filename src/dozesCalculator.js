const {Composite, Page, TextView, Picker, Slider, Button, ScrollView} = require('tabris');

const MARGIN = 15;

const page = new Page({
  id: 'title',
  title: 'Калькулятор дозувань',
  autoDispose: false
});

const medcineList = [
  {
    name: "Анальгін",
    child: true,
    adult: true,
    kilogramsDozing: false,
    childKgLimit: null,
    mlPerKg: null,
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
    mlPerKg: 0.25,
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
    mlPerKg: 0,
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
    mlPerKg: 25,
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
    mlPerKg: null,
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
    mlPerKg: null,
    childDozes: [10, 500],
    adultDoze: "500 мг"
  }

]


new TextView({
  id: 'medcineLabel',
  left: MARGIN, 
  top:   '#title 30', 
  width: 120,
  font: "18px",
  text: 'Препарат:'
}).appendTo(page);

new Picker({
  id: 'medcinePicker',
  left: '#medcineLabel 15', 
  right: MARGIN, 
  font: "18px",
  baseline: '#medcineLabel',
  itemCount: medcineList.length,
  itemText: index => medcineList[index].name
}).on('select', ({value}) => {
  page.find('#message').set('text', '');
}).appendTo(page);

new TextView({
  id: 'ageLabel',
  text: 'Вік:',
  left: MARGIN,
  width: 120,
  font: "18px",
  top: '#medcineLabel 30'
}).appendTo(page);

const AGE = [];
for(let i = 0; i < 100; i++)
  AGE[i] = String(i);

new Picker({
  id: 'agePicker',
  right: MARGIN,
  baseline: '#ageLabel',
  left: '#ageLabel 15',
  font: "18px",
  itemCount: AGE.length,
  itemText: index => AGE[index]
}).appendTo(page);

new Composite({
  id: 'weightPanel',
  left: MARGIN, 
  top: '#ageLabel 30', 
  right: MARGIN
}).append(
  new TextView({
    id: 'weightLabel',
    left: 0, 
    centerY: 0, 
    width: 120,
    font: "18px",
    text: 'Маса тіла:'
  })
).append(
  new TextView({
    id: 'weight',
    right: MARGIN, 
    centerY: 0, 
    width: 50,
    text: '0 Кг',
    font: "18px"
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
  top: '#weightPanel 30',
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
  top: '#horizontalStripe 30',
  font: "bold 24px",
  textColor: "#009AFD"
}).appendTo(page);

// НЕ РАБОТАЮТ РЕНДЖИ И НЕ ПРОВЕРЯЮТСЯ ВОЗРАСТ + НЕ РАБОТАЕТ childDozes
function calculate() {
  let medcine = medcineList[page.children('#medcinePicker').first().selectionIndex];
  let age = AGE[page.children('#agePicker').first().selectionIndex];
  let weight = getWeight();
  
  if (age >= 18 && medcine.adult){
    message.text = medcine.adultDoze;
  }
  else if(age >= 18 && !medcine.adult){
    message.text = "Препарат для застосування до дітей";
  }
  else{ // the person is a child
    if(!medcine.child)
      message.text = "Застосування препарату дітям протипоказано";
    else{ // child could use
      if(medcine.kilogramsDozing){
        let i = 0;
        for(let rangeLimit of medcine.childAgeRangeEl)
        {
          if (rangeLimit >= age)
          {
            break;
          }

          i++;
        }

        if(i != 0 || (i == 0 && medcine.childAgeRangeEl[i] == age))
        {
          if (!medcine.childKgLimit){
            message.text = medcine.mlPerKg * weight + " мг";
          }
          else {
            if (weight <= medcine.childKgLimit)
              message.text = medcine.mlPerKg * weight + " мг";
            else
              message.text = "Застосування препарату дітьми, чия вага вища за " + weight + " не є ефективним.";
            
          }
        }
        else
        {
          message.text = "Застосування препарату дітьми, дозволено з " + 
                        medcine.childAgeRangeEl[0] + 
                        "-ти річного віку.";
        }
        
      }
      else{
        // тут нужно добавить проверку диапазонов
        let i = 0; 
        for(let rangeLimit of medcine.childAgeRangeEl)
        {
          if (rangeLimit >= age)
          {
            break;
          }

          i++;
        }

        if(i != 0)
        {
          message.text = medcine.childDozes[i-1];
        }
        else if(i == 0 && medcine.childAgeRangeEl[i] == age)
        {
          message.text = medcine.childDozes[i];
        }
        else
        {
          message.text = "Застосування препарату дітьми, дозволено з " + 
                         medcine.childAgeRangeEl[0] + 
                         "-ти річного віку.";
        }
      }
        
    }
  }

  /* message.text = [
    'Flight booked for: ' + page.children('#nameInput').first().text,
    'Destination: ' + AGE[page.children('#countryPicker').first().selectionIndex],
    'Seating: ' + createSeating(),
    'Luggage: ' + createWeight(),
    'Meal: ' + createMeal(),
    'Redeem miles: ' + createFrequentFlyerInfo()
  ].join('\n') + '\n';*/
}

function getWeight() {
  let panel = page.children('#weightPanel');
  return parseInt(panel.children('#weightSlider').first().selection);
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



function createMeal() {
  return scrollView.children('#veggieChoice').first().checked ? 'Vegetarian' : 'Standard';
}
*/
module.exports = page;