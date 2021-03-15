import View from './View';

class AddRecipeView extends View {
   parentElement = document.querySelector('.upload') as HTMLFormElement;

   protected overlay = document.querySelector('.overlay') as HTMLElement;
   protected addWindow = document.querySelector('.add-recipe-window');
   protected btnOpenWindow = document.querySelector('.nav__btn--add-recipe');
   protected btnCloseWindow = document.querySelector('.btn--close-modal');

   protected generateMarkup(): string {
      throw new Error('Method not implemented.');
   }

   constructor() {
      super();
      this.handlerOpenWindow();
      this.handlerCloseWindow();
   }

   toggleWindow = () => {
      this.overlay.classList.toggle('hidden');
      this.addWindow.classList.toggle('hidden');
   };

   private handlerOpenWindow() {
      this.btnOpenWindow.addEventListener(
         'click',
         this.toggleWindow.bind(this)
      );
   }

   private handlerCloseByEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') this.toggleWindow();
   }

   private handlerCloseWindow() {
      this.btnCloseWindow.addEventListener(
         'click',
         this.toggleWindow.bind(this)
      );
      this.overlay.addEventListener('click', this.toggleWindow.bind(this));

      document.addEventListener(
         'keydown',
         this.handlerCloseByEscape.bind(this)
      );
   }

   addHandlerUpload(handler: (formData: { [key: string]: string }) => void) {
      this.parentElement.addEventListener('submit', function (e) {
         e.preventDefault();

         const formData = [...new FormData(this)];
         let objData: { [key: string]: string } = {};

         formData.map(data => (objData[data[0]] = data[1].toString()));
         handler(objData);
      });
   }
}

export default new AddRecipeView();
