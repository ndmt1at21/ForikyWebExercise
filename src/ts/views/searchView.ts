class SearchView {
   protected parentElement = document.querySelector('.search') as HTMLElement;
   protected inputField = this.parentElement.querySelector(
      '.search__field'
   ) as HTMLInputElement;

   getTextContent() {
      return this.inputField.value;
   }

   private clear() {
      this.inputField.value = '';
   }

   addHandlerSearchSubmit(handler: () => void) {
      this.parentElement.addEventListener('submit', function (e) {
         e.preventDefault();
         handler();
      });
   }
}

export default new SearchView();
