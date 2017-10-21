import { ToAngularPage } from './app.po';

describe('to-angular App', () => {
  let page: ToAngularPage;

  beforeEach(() => {
    page = new ToAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
