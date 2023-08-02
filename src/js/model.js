import { API_URL, API_KEY, RES_PER_PAGE, START_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: { query: '', results: [], page: START_PAGE, numberOfPages: 0 },
  bookmarks: [],
};

const convertRecipeToCamelCase = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
    let { recipe } = data.data;
    state.recipe = convertRecipeToCamelCase(recipe);
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === state.recipe.id,
    );
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const { data } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.results = data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));
    state.search.numberOfPages = Math.ceil(
      state.search.results.length / RES_PER_PAGE,
    );
    state.search.page = START_PAGE;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResultsForPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ingredient => (ingredient.quantity *= newServings / state.recipe.servings),
  );
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe = state.recipe) {
  if (state.bookmarks.some(bookmark => bookmark.id === recipe.id)) return;
  state.bookmarks.push(recipe);
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }
  saveBookmarksToLocalStorage();
};

export const deleteBookmark = function (recipe = state.recipe) {
  const bookmarkIndex = state.bookmarks.findIndex(
    bookmark => bookmark.id === recipe.id,
  );
  if (bookmarkIndex === -1) return;
  state.bookmarks.splice(bookmarkIndex, 1);
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = false;
  }
  saveBookmarksToLocalStorage();
};

const saveBookmarksToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadBookmarks = function () {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
};
loadBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1])
      .map(entry => {
        const ingredientArr = entry[1]
          .split(',')
          .map(ingredientAttr => ingredientAttr);
        if (ingredientArr.length !== 3)
          throw new Error(
            'Wrong ingredients format! Please, use the correct one ;)',
          );
        let [quantity, unit, description] = ingredientArr;
        quantity = quantity ? +quantity : null;
        return { quantity: quantity, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    console.log(recipe);

    const { data } = await getJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = convertRecipeToCamelCase(data.recipe);
    addBookmark(state.recipe);
    console.log(data);
  } catch (e) {
    throw e;
  }
};
