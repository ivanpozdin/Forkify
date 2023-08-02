import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _closeFormBtn = document.querySelector('.btn--close-modal');
  _openFormBtn = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  hideAddRecipeView() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _changeVisibilityOfAddRecipeWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._openFormBtn.addEventListener(
      'click',
      this._changeVisibilityOfAddRecipeWindow.bind(this),
    );
  }

  _addHandlerHideWindow() {
    this._overlay.addEventListener(
      'click',
      function () {
        this._changeVisibilityOfAddRecipeWindow();
      }.bind(this),
    );

    this._closeFormBtn.addEventListener(
      'click',
      function (e) {
        if (e.target.closest('.btn--close-modal')) {
          this._changeVisibilityOfAddRecipeWindow();
        }
      }.bind(this),
    );
  }

  _generateMarkup() {}

  addHandlerUploadNewRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const newRecipe = Object.fromEntries([...new FormData(this)]);
      handler(newRecipe);
    });
  }
}

export default new AddRecipeView();
