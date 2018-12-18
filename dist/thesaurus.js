'use strict';

const { CollectionView, Composite, ImageView, Button, NavigationView, Page, TextView, WebView, contentView, ui } = require('tabris');

const ITEM_FETCH_COUNT = 15;

var json = require('../thesaurus.json');
let loading;
let items = [];
let lastId = 0;

const page = new Page({
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
  createCell: type => {
    if (type === 'normal') {
      return createItemCell();
    }
    return createLoadingCell();
  },
  updateCell: (view, index) => {
    const item = items[index];
    if (!item.loading) {
      view.find('#medcineName').set({ text: item.name });
      view.find('#container').first().item = item;
    }
  }
}).on('scroll', ({ target: scrollView, deltaY }) => {
  if (deltaY > 0) {
    const remaining = items.length - scrollView.lastVisibleIndex;
    if (remaining < 10) {
      loadMoreItems();
    }
  }
}).appendTo(page);

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
  }).on('tap', ({ target: view }) => {
    createDetailsPage(view.item);
  }).appendTo(cell);

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
    items.push({ loading: true });
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
  console.log(data);
  const detailsPage = new Page({
    background: 'black',
    title: data.name,
    autoDispose: false
  }).appendTo(navigationView);
  new TextView({
    id: 'ageLabel',
    text: data.structure,
    left: MARGIN,
    width: 120,
    font: "18px",
    top: '#medcineLabel 30'
  }).appendTo(detailsPage);

  if (data.url.substr(-4, 4) === '.jpg') {
    new ImageView({
      left: 0, top: 0, right: 0, bottom: 0,
      image: data.url,
      scaleMode: 'fit',
      zoomEnabled: true
    }).appendTo(detailsPage);
  } else {
    new WebView({
      left: 0, top: 0, right: 0, bottom: 0,
      url: data.url
    }).appendTo(detailsPage);
  }
}

function getNewMedcines() {
  let prevLastId = lastId;
  if (lastId >= json.length) return json.slice(prevLastId, json.length - 1);
  lastId += ITEM_FETCH_COUNT;
  return json.slice(prevLastId, lastId);
}

module.exports = page;