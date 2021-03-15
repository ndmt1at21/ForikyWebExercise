import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
    constructor() {
        super(...arguments);
        this.parentElement = document.querySelector('.pagination');
    }
    hasNextPage() {
        const numPages = Math.ceil(this.data.results.length / this.data.nItemPerPage);
        if (this.data.currentPage >= numPages)
            return false;
        return true;
    }
    hasPrevPage() {
        if (this.data.currentPage <= 1)
            return false;
        return true;
    }
    generateMarkup() {
        let html = '';
        if (this.hasPrevPage()) {
            html += `
          <button data-goto= "${this.data.currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this.data.currentPage - 1}</span>
         </button>`;
        }
        if (this.hasNextPage()) {
            html += `
            <button data-goto= "${this.data.currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this.data.currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
        }
        return html;
    }
    addHandlerPageClicked(handler) {
        if (typeof handler !== 'function')
            return;
        this.parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const target = e.target.closest('.btn--inline');
            const page = +target.dataset.goto;
            if (typeof page === 'number')
                handler(page);
        });
    }
}
export default new PaginationView();
