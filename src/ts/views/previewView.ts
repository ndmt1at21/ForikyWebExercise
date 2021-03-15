import View from './View';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
   parentElement = undefined;

   protected generateMarkup(): string {
      const currID = window.location.hash.slice(1);

      return `
        <li class="preview">
            <a class="preview__link ${
               currID === this.data.id ? 'preview__link--active' : ''
            }"  href="#${this.data.id}">
                <figure class="preview__fig">
                    <img src="${this.data.image_url}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">
                        ${this.data.title}
                    </h4>
                    <p class="preview__publisher">${this.data.publisher}</p>
                    <div class="preview__user-generated">
                        <svg>
                            <use href="${icons}#icon-user"></use>
                        </svg>
                    </div>
                </div>
            </a>
        </li>`;
   }
}

export default new PreviewView();
