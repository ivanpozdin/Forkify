import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    let markup = ``;
    // If not first page, add previous page button.
    if (this._data.page !== 1) {
      markup += `
          <button data-goto="${
            this._data.page - 1
          }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                  <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${this._data.page - 1}</span>
          </button>
      `;
    }
    // If not last page, add next page button.
    if (this._data.page !== this._data.numberOfPages) {
      markup += `
           <button data-goto="${
             this._data.page + 1
           }" class="btn--inline pagination__btn--next">
              <span>Page ${this._data.page + 1}</span>
              <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
              </svg>
           </button>
      `;
    }
    return markup;
  }
}

export default new PaginationView();
