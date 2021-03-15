var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { API_KEY, API_URL, ITEM_PER_PAGE } from './config';
import { AJAX } from './helpers';
export const state = {};
export const loadRecipe = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield AJAX(`${API_URL}/recipes/${id}`);
        state.recipe = data.recipe;
        if (state.bookmarks.some(bookmark => state.recipe.id === bookmark.id)) {
            state.recipe.bookmarked = true;
        }
    });
};
export const uploadRecipe = function (dataForm) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const safeEntries = Object.keys(dataForm)
                .filter(key => key.trim() !== '' && dataForm[key].trim() !== '')
                .map(key => [key, dataForm[key]]);
            const dataIngrs = safeEntries
                .filter(entry => entry[0].startsWith('ingredient'))
                .map(entry => {
                const ingArr = entry[1].split(',');
                if (ingArr.length !== 3)
                    throw Error('Wrong ingredient fromat! Please use the correct format');
                const [quant, unit, descrip] = ingArr;
                const ingr = {
                    quantity: quant ? +quant : null,
                    unit: unit,
                    description: descrip
                };
                return ingr;
            });
            if (!dataIngrs.length)
                throw Error('Lack of ingredients');
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
            const res = yield AJAX(`${API_URL}/recipes?key=${API_KEY}`, recipe);
            if (res.status === 'fail')
                throw new Error(res.message);
            state.recipe = res.recipe;
        }
        catch (error) {
            throw error;
        }
    });
};
export const loadSearchResult = function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!query)
                return;
            state.search.query = query;
            const data = yield AJAX(`${API_URL}/recipes?search=${state.search.query}`);
            if (!data.recipes.length) {
                throw new Error('We cannot find any results match with your keyword');
            }
            state.search.results = data.recipes;
        }
        catch (error) {
            throw error;
        }
    });
};
export const getSearchResultPage = function (page) {
    const numPages = Math.ceil(state.search.results.length / state.search.nItemPerPage);
    if (page < 1 || page > numPages)
        return;
    state.search.currentPage = page;
    const startIndex = (page - 1) * state.search.nItemPerPage;
    const endIndex = startIndex + state.search.nItemPerPage;
    const itemsInCurrentPage = state.search.results.slice(startIndex, endIndex);
    return itemsInCurrentPage;
};
export const updateServings = function (newServings) {
    if (newServings <= 1 || !Number.isInteger(newServings))
        return;
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
    if (!dataFromLS)
        return;
    const bookmarks = JSON.parse(dataFromLS);
    if (!bookmarks)
        return;
    state.bookmarks = bookmarks;
};
export const addBookmark = function (recipe) {
    if (!recipe.id)
        return;
    // Add to state bookmarks
    const idx = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
    if (idx === -1)
        state.bookmarks.push(recipe);
    // Mark current recipe bookmarked
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
    // Add to local storage
    updateBookmarkToLocalStorage();
};
export const deleteBookmark = function (recipe) {
    // Remove from state bookmarks
    const idx = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
    if (idx >= 0)
        state.bookmarks.splice(idx, 1);
    console.log(idx);
    // Remove mark from current recipe
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = false;
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
