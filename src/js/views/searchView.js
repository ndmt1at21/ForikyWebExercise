class SearchView {
    constructor() {
        this.parentElement = document.querySelector('.search');
        this.inputField = this.parentElement.querySelector('.search__field');
    }
    getTextContent() {
        return this.inputField.value;
    }
    clear() {
        this.inputField.value = '';
    }
    addHandlerSearchSubmit(handler) {
        this.parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }
}
export default new SearchView();
