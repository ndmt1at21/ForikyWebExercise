import previewView from './previewView';
import View from './View';

class BookmarkView extends View {
   parentElement = document.querySelector('.bookmarks') as HTMLElement;

   private generateBookmarkRow(recipe: any): string {
      return `
        <li class="preview">
            <a class="preview__link" href="#${recipe.id}">
                <figure class="preview__fig">
                    <img src="${recipe.image_url}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">
                        ${recipe.title}
                    </h4>
                    <p class="preview__publisher">
                        ${recipe.publisher}
                    </p>
                </div>
            </a>
        </li>`;
   }

   protected generateMarkup(): string {
      const htmlEmptyBookmark = `
            <div class="message">
                <div>
                    <svg>
                    <use
                        href="src/img/icons.svg#icon-smile"
                    ></use>
                    </svg>
                </div>
                <p>
                    No bookmarks yet. Find a nice recipe and
                    bookmark it :)
                </p>
            </div>`;

      if (!this.data.length) {
         return htmlEmptyBookmark;
      }

      return this.data
         .map(bookmark => previewView.render(bookmark, false))
         .join('');
   }

   addHandlerRender(handler: () => void) {
      window.addEventListener('load', handler);
   }
}

export default new BookmarkView();
