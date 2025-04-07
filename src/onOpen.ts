function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('scripts').addItem('Somar intervalo', 'sumValuesInRange').addToUi();
}

(globalThis as any).onOpen = onOpen;
