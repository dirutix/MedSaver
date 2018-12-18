const dozesCalculatorPage = require('./dozesCalculator');
const analisysPage = require('./analisysCalculatorPage');
// const thesaurusPage = require('./thesaurus');
const {Button, NavigationView, Page, contentView, ui, ScrollView, CollectionView, Composite, TextView} = require('tabris');

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
}).on('select', () => dozesCalculatorPage.appendTo(navigationView))
.appendTo(mainPage);

new Button({
    left: 8, top: 'prev() 8', right: 8,
    height: 190,
    textColor: "white",
    background: "#FFA700",
    font: "bold 30px",
    text: analisysPage.title
}).on('select', () => analisysPage.appendTo(navigationView))
.appendTo(mainPage);




const ITEM_FETCH_COUNT = 15;

var json = require('../thesaurus.json');
let loading;
let items = [];
let lastId = 0;


const thesaurusPage = new Page({
  id: 'title',
  title: 'Довідник',
  autoDispose: false
});

const collectionView = new CollectionView({
  left: 0, top: 0, right: 0, bottom: 0,
  background: '#f5f5f5',
  refreshEnabled: true,
  cellHeight: 96,
  cellType: index => items[index].loading ? 'loading' : 'normal',
  createCell: (type) => {
    if (type === 'normal') {
      return createItemCell();
    }
    return createLoadingCell();
  },
  updateCell: (view, index) => {
    const item = items[index];
    if (!(item.loading)) {
      view.find('#medcineName').set({text: item.name});
      view.find('#container').first().item = item;
    }
  }
})
  .on('scroll', ({target: scrollView, deltaY}) => {
    if (deltaY > 0) {
      const remaining = items.length - scrollView.lastVisibleIndex;
      if (remaining < 10) {
        loadMoreItems();
      }
    }
  }).appendTo(thesaurusPage);

loadInitialItems();

function createLoadingCell() {
  return new TextView({
    centerY: 0,
    alignment: 'center',
    text: 'Loading...'
  });
}

function createItemCell() {
  const cell = new Composite();
  const container = new Composite({
    id: 'container',
    left: 16, right: 16, top: 8, bottom: 8,
    cornerRadius: 2,
    elevation: 2,
    background: 'white',
    highlightOnTouch: true
  }).on('tap', ({target: view}) => {
    createDetailsPage(view.item)})
    .appendTo(cell);
    
  new TextView({
    id: 'medcineName',
    top: 8, left: ['#itemImage', 16], right: 16,
    textColor: '#202020',
    background: 'white',
    font: 'medium 24px',
    maxLines: 2
  }).appendTo(container);
  return cell;
}

function createLoadingCell() {
  return new TextView({
    centerY: 0,
    alignment: 'center',
    text: 'Loading...'
  });
}

function loadInitialItems() {
  collectionView.refreshIndicator = true;
  items = getNewMedcines();
  collectionView.itemCount = items.length;
  collectionView.refreshIndicator = false;
}

function loadMoreItems() {
  if (!loading) {
    loading = true;
    // insert placeholder item
    items.push({loading: true});
    collectionView.insert(items.length, 1);
    loading = false;
    // remove placeholder item
    items.splice(items.length - 1, 1);
    collectionView.remove(-1);
    // insert new items
    const insertionIndex = items.length;
    items = items.concat(getNewMedcines());
    collectionView.insert(insertionIndex, ITEM_FETCH_COUNT);
  }
}

function createDetailsPage(data) {
  const detailsPage = new Page({
    id: 'title',
    title: data.name,
    autoDispose: false
  }).appendTo(navigationView);

  let scrollView = new ScrollView({
    left: 0, right: 0, top: 0, bottom: 0,
    direction: 'vertical'
  }).appendTo(detailsPage);

  new TextView({
    id: 'structureLabel',
    top:   '#title 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Состав"
  }).appendTo(scrollView);

  new TextView({
    id: 'structureText',
    top:   '#structureLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.structure
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe1",
    left: 0, 
    right: 0, 
    top: '#structureText 10',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'pharmacologicalActionLabel',
    top:   '#horizontalStripe1 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Фармакологическое действие"
  }).appendTo(scrollView);

  new TextView({
    id: 'pharmacologicalAction',
    top:   '#pharmacologicalActionLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.pharmacologicalAction
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe2",
    left: 0, 
    right: 0, 
    top: '#pharmacologicalAction 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'indicationsLabel',
    top:   '#horizontalStripe2 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Показания к применению"
  }).appendTo(scrollView);

  new TextView({
    id: 'indications',
    top:   '#indicationsLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.indications
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe3",
    left: 0, 
    right: 0, 
    top: '#indications 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'usageLabel',
    top:   '#horizontalStripe3 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Способ применения"
  }).appendTo(scrollView);

  new TextView({
    id: 'usage',
    top: '#usageLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.usage
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe4",
    left: 0, 
    right: 0, 
    top: '#usage 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'sideEffectsLabel',
    top:   '#horizontalStripe4 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Побочные действия"
  }).appendTo(scrollView);

  new TextView({
    id: 'sideEffects',
    top:   '#sideEffectsLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.sideEffects
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe5",
    left: 0, 
    right: 0, 
    top: '#sideEffects 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'contradictionsLabel',
    top:   '#horizontalStripe5 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Противопоказания"
  }).appendTo(scrollView);

  new TextView({
    id: 'contradictions',
    top:   '#contradictionsLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.contradictions
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe6",
    left: 0, 
    right: 0, 
    top: '#contradictions 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'overdozeLabel',
    top:   '#horizontalStripe6 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Передозировка"
  }).appendTo(scrollView);

  new TextView({
    id: 'overdoze',
    top:   '#overdozeLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.overdoze
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe7",
    left: 0, 
    right: 0, 
    top: '#overdoze 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'termsOfStorageLabel',
    top:   '#horizontalStripe7 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Условия хранения"
  }).appendTo(scrollView);

  new TextView({
    id: 'termsOfStorage',
    top:   '#termsOfStorageLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.termsOfStorage
  }).appendTo(scrollView);

  new TextView({
    id: "horizontalStripe8",
    left: 0, 
    right: 0, 
    top: '#termsOfStorage 15',
    font: "2px",
    background: "#FFA700",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'activeElementsLabel',
    top:   '#horizontalStripe8 4', 
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Действующие вещества"
  }).appendTo(scrollView);

  new TextView({
    id: 'activeElements',
    top:   '#activeElementsLabel 4', 
    left: 15,
    right: 15,
    font: "18px",
    text: data.activeElements
  }).appendTo(scrollView);

  
}

function getNewMedcines() {
  let prevLastId = lastId;
  if (lastId >= json.length)
    return json.slice(prevLastId, json.length - 1);
  lastId += ITEM_FETCH_COUNT;
  return json.slice(prevLastId, lastId);
}

new Button({
  left: 8, top: 'prev() 8', right: 8,
  height: 190,
  textColor: "white",
  font: "bold 30px",
  background: "#00BC6F",
  text: thesaurusPage.title
}).on('select', () => thesaurusPage.appendTo(navigationView))
.appendTo(mainPage);