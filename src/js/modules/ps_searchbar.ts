/**
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {searchProduct, Result} from '@services/search';
import debounce from '@helpers/debounce';

const initSearchbar = () => {
  const {prestashop} = window;
  const {searchBar: SearchBarMap} = prestashop.themeSelectors;

  const searchCanvas = document.querySelector<HTMLElement>(SearchBarMap.searchCanvas);
  const searchWidget = document.querySelector<HTMLElement>(SearchBarMap.searchWidget);
  const searchDropdown = document.querySelector<HTMLElement>(SearchBarMap.searchDropdown);
  const searchResults = document.querySelector<HTMLElement>(SearchBarMap.searchResults);
  const searchTemplate = document.querySelector<HTMLTemplateElement>(SearchBarMap.searchTemplate);
  const searchInput = document.querySelector<HTMLInputElement>(SearchBarMap.searchInput);
  const searchUrl = searchWidget?.dataset.searchControllerUrl;

  searchCanvas?.addEventListener('hidden.bs.offcanvas', () => {
    if (searchDropdown) {
      searchDropdown.innerHTML = '';
      searchDropdown.classList.add('d-none');
    }
  });

  if (searchWidget && searchInput && searchResults && searchDropdown) {
    searchInput.addEventListener('keydown', debounce(async () => {
      if (searchUrl) {
        const products = await searchProduct(searchUrl, searchInput.value, 10);

        if (products.length > 0) {
          products.forEach((e: Result) => {
            const product = <HTMLElement>searchTemplate?.content.cloneNode(true);

            if (product) {
              const productLink = product.querySelector<HTMLAnchorElement>('a');
              const productTitle = product.querySelector<HTMLElement>('p');
              const productImage = product.querySelector<HTMLImageElement>('img');

              if (productLink && productTitle && productImage) {
                productLink.href = e.canonical_url;
                productTitle.innerHTML = e.name;

                if (!e.cover) {
                  productImage.innerHTML = '';
                } else {
                  productImage.src = e.cover.small.url;
                }

                searchResults.append(product);
              }
            }
          });

          searchDropdown.classList.remove('d-none');

          window.addEventListener('click', (e: Event) => {
            if (!searchWidget.contains(<Node>e.target)) {
              searchDropdown.classList.add('d-none');
            }
          });
        } else {
          searchResults.innerHTML = '';
          searchDropdown.classList.add('d-none');
        }
      }
    }, 250));
  }
};

export default initSearchbar;
