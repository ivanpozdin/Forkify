import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { state } from './model.js';
import { MODAL_CLOSE_SEC } from './config';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.showSpinner();
    // Loading recipe
    await model.loadRecipe(id);
    // Rendering recipe
    recipeView.render(model.state.recipe);
    resultsView.update(model.loadSearchResultsForPage());
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.showSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.loadSearchResultsForPage());
    paginationView.render(state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.loadSearchResultsForPage(goToPage));
  paginationView.render(state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddNewBookmark = function () {
  if (model.state.recipe.bookmarked) model.deleteBookmark();
  else model.addBookmark();
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.showSpinner.bind(addRecipeView)();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.hideAddRecipeView.bind(addRecipeView)();
      addRecipeView._addHandlerShowWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (e) {
    addRecipeView.renderError(e.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddNewBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUploadNewRecipe(controlAddRecipe);
  model.loadBookmarks();
  bookmarksView.render(model.state.bookmarks);
};
init();
