var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as model from './model';
import addRecipeView from './views/addRecipeView';
import bookmarkView from './views/bookmarkView';
import paginationView from './views/paginationView';
import recipeView from './views/RecipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const showRecipe = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = window.location.hash.slice(1);
            if (!id)
                return;
            // Add loading animation
            recipeView.addLoadingAnimation();
            // Mark item in result view selected
            resultsView.update(model.getSearchResultPage(model.state.search.currentPage));
            // Mark item in bookmark view selected
            bookmarkView.update(model.state.bookmarks);
            // Loading recipe
            yield model.loadRecipe(id);
            // Render recipe view
            recipeView.render(model.state.recipe);
        }
        catch (error) {
            recipeView.showError(error);
        }
    });
};
const controlSearchResults = function (page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = searchView.getTextContent();
            if (!query)
                return;
            resultsView.addLoadingAnimation();
            yield model.loadSearchResult(query);
            const itemsInPage = model.getSearchResultPage(page);
            // Render init pagination (page = 1)
            paginationView.render(model.state.search);
            // Render results view with items
            resultsView.render(itemsInPage);
        }
        catch (error) {
            resultsView.showError(error.message);
        }
    });
};
const controlPagination = function (page) {
    const numPages = Math.ceil(model.state.search.results.length / model.state.search.nItemPerPage);
    if (page <= 1 && page > numPages)
        return;
    resultsView.render(model.getSearchResultPage(page));
    paginationView.render(model.state.search);
};
const controlUpdateServings = function (newServings) {
    // Update state
    model.updateServings(newServings);
    // Update DOM
    recipeView.update(model.state.recipe);
};
const controlChangeStateBookmark = function () {
    // Update state curent recipe
    model.state.recipe.bookmarked = !model.state.recipe.bookmarked;
    // Add local storage
    if (model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    }
    // Add from local storage
    if (!model.state.recipe.bookmarked) {
        model.deleteBookmark(model.state.recipe);
    }
    // Update view recipe & bookmark
    recipeView.update(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
};
const controlBookmark = () => {
    bookmarkView.render(model.state.bookmarks);
};
const controlUploadRecipe = function (formData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Upload recipe, set to current recipe
            yield model.uploadRecipe(formData);
            // Load recipe
            recipeView.render(model.state.recipe);
            // Change url
            window.history.pushState(null, '', `#${model.state.recipe.id}`);
            // Close window
            setTimeout(addRecipeView.toggleWindow, 1000);
        }
        catch (error) {
            addRecipeView.showError(error);
        }
    });
};
(function init() {
    bookmarkView.addHandlerRender(controlBookmark);
    searchView.addHandlerSearchSubmit(controlSearchResults);
    recipeView.addHandlerRender(showRecipe);
    recipeView.addHandlerUpdateServings(controlUpdateServings);
    recipeView.addHandlerBookmark(controlChangeStateBookmark);
    paginationView.addHandlerPageClicked(controlPagination);
    addRecipeView.addHandlerUpload(controlUploadRecipe);
})();
