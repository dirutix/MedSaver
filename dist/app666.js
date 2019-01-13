'use strict';

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
    top: '#title 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Состав"
  }).appendTo(scrollView);

  new TextView({
    id: 'structureText',
    top: '#structureLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'pharmacologicalActionLabel',
    top: '#horizontalStripe1 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Фармакологическое действие"
  }).appendTo(scrollView);

  new TextView({
    id: 'pharmacologicalAction',
    top: '#pharmacologicalActionLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'indicationsLabel',
    top: '#horizontalStripe2 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Показания к применению"
  }).appendTo(scrollView);

  new TextView({
    id: 'indications',
    top: '#indicationsLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'usageLabel',
    top: '#horizontalStripe3 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'sideEffectsLabel',
    top: '#horizontalStripe4 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Побочные действия"
  }).appendTo(scrollView);

  new TextView({
    id: 'sideEffects',
    top: '#sideEffectsLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'contradictionsLabel',
    top: '#horizontalStripe5 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Противопоказания"
  }).appendTo(scrollView);

  new TextView({
    id: 'contradictions',
    top: '#contradictionsLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'overdozeLabel',
    top: '#horizontalStripe6 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Передозировка"
  }).appendTo(scrollView);

  new TextView({
    id: 'overdoze',
    top: '#overdozeLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'termsOfStorageLabel',
    top: '#horizontalStripe7 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Условия хранения"
  }).appendTo(scrollView);

  new TextView({
    id: 'termsOfStorage',
    top: '#termsOfStorageLabel 4',
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
    background: "#00BC6F",
    width: 2
  }).appendTo(scrollView);

  new TextView({
    id: 'activeElementsLabel',
    top: '#horizontalStripe8 4',
    left: 15,
    right: 15,
    font: "24px bold",
    text: "Действующие вещества"
  }).appendTo(scrollView);

  new TextView({
    id: 'activeElements',
    top: '#activeElementsLabel 4',
    left: 15,
    right: 15,
    font: "18px",
    text: data.activeElements
  }).appendTo(scrollView);
}