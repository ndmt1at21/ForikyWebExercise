import { API_KEY, API_URL, ITEM_PER_PAGE } from './config';
import { AJAX } from './helpers';
import RecipeView from './views/RecipeView';

interface Ingredient {
   quantity: number;
   unit: string;
   description: string;
}

export interface Recipe {
   cooking_time: number;
   id: string;
   image_url: string;
   ingredients: Ingredient[];
   publisher: string;
   servings: number;
   source_url: string;
   title: string;
   bookmarked: boolean;
}

export interface Search {
   query: string;
   results: Recipe[];
   currentPage: number;
   nItemPerPage: number;
}

export interface State {
   recipe?: Recipe;
   search?: Search;
   bookmarks?: Recipe[];
}

export const state: State = {};

export const loadRecipe = async function (id: string) {
   const data = await AJAX(`${API_URL}/recipes/${id}`);
   state.recipe = data.recipe;

   if (state.bookmarks.some(bookmark => state.recipe.id === bookmark.id)) {
      state.recipe.bookmarked = true;
   }
};

export const uploadRecipe = async function (dataForm: {
   [key: string]: string;
}) {
   try {
      const safeEntries = Object.keys(dataForm)
         .filter(key => key.trim() !== '' && dataForm[key].trim() !== '')
         .map(key => [key, dataForm[key]]);

      const dataIngrs = safeEntries
         .filter(entry => entry[0].startsWith('ingredient'))
         .map(entry => {
            const ingArr = entry[1].split(',');

            if (ingArr.length !== 3)
               throw Error(
                  'Wrong ingredient fromat! Please use the correct format'
               );

            const [quant, unit, descrip] = ingArr;
            const ingr: Ingredient = {
               quantity: quant ? +quant : null,
               unit: unit,
               description: descrip
            };

            return ingr;
         });

      if (!dataIngrs.length) throw Error('Lack of ingredients');

      // Use data form not safe .?
      const recipe = {
         cooking_time: dataForm.cookingTime,
         image_url: dataForm.image,
         ingredients: dataIngrs,
         publisher: dataForm.publisher,
         servings: dataForm.servings,
         source_url: dataForm.sourceUrl,
         title: dataForm.title
      };

      const res = await AJAX(`${API_URL}/recipes?key=${API_KEY}`, recipe);
      if (res.status === 'fail') throw new Error(res.message);

      state.recipe = res.recipe;
   } catch (error) {
      throw error;
   }
};

export const loadSearchResult = async function (query: string) {
   try {
      if (!query) return;
      state.search.query = query;

      const data = await AJAX(
         `${API_URL}/recipes?search=${state.search.query}`
      );

      if (!data.recipes.length) {
         throw new Error('We cannot find any results match with your keyword');
      }

      state.search.results = data.recipes;
   } catch (error) {
      throw error;
   }
};

export const getSearchResultPage = function (page: number) {
   const numPages = Math.ceil(
      state.search.results.length / state.search.nItemPerPage
   );

   if (page < 1 || page > numPages) return;
   state.search.currentPage = page;

   const startIndex = (page - 1) * state.search.nItemPerPage;
   const endIndex = startIndex + state.search.nItemPerPage;
   const itemsInCurrentPage = state.search.results.slice(startIndex, endIndex);

   return itemsInCurrentPage;
};

export const updateServings = function (newServings: number) {
   if (newServings <= 1 || !Number.isInteger(newServings)) return;

   const ratio = newServings / state.recipe.servings;
   state.recipe.ingredients.forEach(ingr => {
      ingr.quantity *= ratio;
   });

   state.recipe.servings = newServings;
};

const updateBookmarkToLocalStorage = function () {
   window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarkFromLocalStorage = function () {
   const dataFromLS = window.localStorage.getItem('bookmarks');
   if (!dataFromLS) return;

   const bookmarks = JSON.parse(dataFromLS);
   if (!bookmarks) return;

   state.bookmarks = bookmarks;
};

export const addBookmark = function (recipe: Recipe) {
   if (!recipe.id) return;

   // Add to state bookmarks
   const idx = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
   if (idx === -1) state.bookmarks.push(recipe);

   // Mark current recipe bookmarked
   if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

   // Add to local storage
   updateBookmarkToLocalStorage();
};

export const deleteBookmark = function (recipe: Recipe) {
   // Remove from state bookmarks
   const idx = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
   if (idx >= 0) state.bookmarks.splice(idx, 1);

   console.log(idx);

   // Remove mark from current recipe
   if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;

   // Add to local storage
   updateBookmarkToLocalStorage();
};

(function init() {
   state.bookmarks = [];
   state.search = {
      query: '',
      results: [],
      currentPage: 0,
      nItemPerPage: ITEM_PER_PAGE
   };

   loadBookmarkFromLocalStorage();
})();
