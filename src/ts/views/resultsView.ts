import { Recipe } from '../model';
import View from './View';
import previewView from './previewView';

class ResultView extends View {
   parentElement = document.querySelector('.results') as HTMLElement;
   data: Recipe[];

   protected generateMarkup(): string {
      const html = this.data
         .map(recipe => previewView.render(recipe, false))
         .join('');
      return html;
   }

   addHandlerClickResult(handler: () => void) {
      this.parentElement.addEventListener('click', function (e) {
         e.preventDefault();

         const target = (<HTMLElement>e.target).closest(
            '.preview'
         ) as HTMLElement;
         if (!target) return;

         handler();
      });
   }
}

export default new ResultView();
