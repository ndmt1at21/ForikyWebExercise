import View from './View';
class AddRecipeView extends View {
    constructor() {
        super();
        this.parentElement = document.querySelector('.upload');
        this.overlay = document.querySelector('.overlay');
        this.addWindow = document.querySelector('.add-recipe-window');
        this.btnOpenWindow = document.querySelector('.nav__btn--add-recipe');
        this.btnCloseWindow = document.querySelector('.btn--close-modal');
        this.toggleWindow = () => {
            this.overlay.classList.toggle('hidden');
            this.addWindow.classList.toggle('hidden');
        };
        this.handlerOpenWindow();
        this.handlerCloseWindow();
    }
    generateMarkup() {
        throw new Error('Method not implemented.');
    }
    handlerOpenWindow() {
        this.btnOpenWindow.addEventListener('click', this.toggleWindow.bind(this));
    }
    handlerCloseByEscape(e) {
        if (e.key === 'Escape')
            this.toggleWindow();
    }
    handlerCloseWindow() {
        this.btnCloseWindow.addEventListener('click', this.toggleWindow.bind(this));
        this.overlay.addEventListener('click', this.toggleWindow.bind(this));
        document.addEventListener('keydown', this.handlerCloseByEscape.bind(this));
    }
    addHandlerUpload(handler) {
        this.parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = [...new FormData(this)];
            let objData = {};
            formData.map(data => (objData[data[0]] = data[1].toString()));
            handler(objData);
        });
    }
}
export default new AddRecipeView();
