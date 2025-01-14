/**
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {isHTMLElement} from '@helpers/typeguards';

const initMobileMenu = () => {
  const {prestashop} = window;
  const {mobileMenu: MobileMenuMap} = prestashop.themeSelectors;

  const openChildsButtons = document.querySelectorAll(MobileMenuMap.openChildsButton);
  const backTitle = document.querySelector(MobileMenuMap.backTitle);
  const backButton = document.querySelector(MobileMenuMap.backButton);
  const menuCanvas = document.querySelector(MobileMenuMap.menuCanvas);
  const defaultBackTitle = backTitle?.innerHTML;

  const backToParent = () => {
    if (
      backTitle
      && backButton
      && defaultBackTitle
    ) {
      const currentMenu = document.querySelector<HTMLElement>(MobileMenuMap.menuCurrent);
      const currentDepth = Number(currentMenu?.dataset.depth);
      const currentParentDepth = currentDepth === 2 ? 0 : currentDepth - 1;
      // eslint-ignore-next-line
      const currentParent = document.querySelector<HTMLElement>(MobileMenuMap.specificParent(currentParentDepth));

      if (currentDepth === 2) {
        backButton.classList.add('d-none');
      }

      if (currentMenu) {
        currentMenu.classList.remove('js-menu-current');
        currentMenu.classList.remove('menu--current');
      }

      if (currentParent) {
        if (currentDepth > 3) {
          backTitle.innerHTML = currentParent.dataset.backTitle;
        } else {
          backTitle.innerHTML = defaultBackTitle;
        }

        currentParent.classList.add('js-menu-current');
        currentParent.classList.add('menu--fromLeft');
        currentParent.classList.add('menu--current');
        currentParent.classList.remove('menu--parent');
      }
    }
  };

  menuCanvas?.addEventListener('hidden.bs.offcanvas', () => {
    const currentMenu = document.querySelector(MobileMenuMap.menuCurrent);

    if (isHTMLElement(currentMenu)) {
      let currentDepth = Number(currentMenu.dataset.depth);

      if (currentDepth !== 0) {
        while (currentDepth >= 2) {
          backToParent();

          currentDepth -= 1;
        }
      }
    }
  });

  openChildsButtons.forEach((button: Element): void => {
    button.addEventListener('click', () => {
      const currentMenu = document.querySelector<HTMLElement>(MobileMenuMap.menuCurrent);

      if (currentMenu) {
        const currentDepth = Number(currentMenu.dataset.depth);
        const currentButton = <HTMLElement>button;

        if (currentMenu) {
          currentMenu.classList.remove('js-menu-current');
          currentMenu.classList.remove('menu--current');
          currentMenu.classList.remove('menu--fromLeft');
          currentMenu.classList.remove('menu--fromRight');
          currentMenu.classList.add('menu--parent');
        }

        const child = document.querySelector(MobileMenuMap.specificChild(currentButton.dataset.target));

        backButton?.classList.remove('d-none');

        if (currentDepth >= 1 && backTitle && child.dataset.backTitle) {
          backTitle.innerHTML = child.dataset.backTitle;
        }

        if (isHTMLElement(child)) {
          child.classList.add('js-menu-current');
          child.classList.add('menu--fromRight');
          child.classList.add('menu--current');
          child.classList.remove('menu--child');
          child.classList.remove('js-menu-child');
        }
      }
    });
  });

  backButton?.addEventListener('click', () => {
    backToParent();
  });
};

export default initMobileMenu;
