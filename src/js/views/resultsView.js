import View from './View';
import previewView from './previewView';
class ResultView extends View {
    constructor() {
        super(...arguments);
        this.parentElement = document.querySelector('.results');
    }
    generateMarkup() {
        const html = this.data
            .map(recipe => previewView.render(recipe, false))
            .join('');
        return html;
    }
    addHandlerClickResult(handler) {
        this.parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const target = e.target.closest('.preview');
            if (!target)
                return;
            handler();
        });
    }
}
export default new ResultView();
