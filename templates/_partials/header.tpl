{**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 *}
{$headerTopName = 'header__top'}
{$headerBottomName = 'header__bottom'}

{block name='header_banner'}
  <div class="header__banner">
    {hook h='displayBanner'}
  </div>
{/block}

{block name='header_nav'}
  <nav class="{$headerTopName}">
    <div class="container-md">
      <div class="{$headerTopName}-desktop hidden-on-mobile row">
        <div class="{$headerTopName}__left col-md-5">
          {hook h='displayNav1'}
        </div>
        <div class="{$headerTopName}__right col-md-7">
          {hook h='displayNav2'}
        </div>
      </div>

      <div class="{$headerTopName}-mobile hidden-on-desktop">
        <div id="_mobile_menu"></div>
        <div id="_mobile_logo" class="logo logo-mobile"></div>

        <div class="search__mobile hide-on-desktop">
          <button class="search__mobile__toggler btn d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#searchCanvas" aria-controls="searchCanvas">
            <span class="material-icons">search</span>  
          </button>

          <div class="search__offcanvas js-search-offcanvas offcanvas offcanvas-top" data-bs-backdrop="false" data-bs-scroll="true" tabindex="-1" id="searchCanvas" aria-labelledby="offcanvasTopLabel">
            <div class="offcanvas-header">
              <div id="_mobile_search" class="search__container"></div>
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">{l s='Cancel' d='Shop.Theme.Global'}</button>
            </div>
          </div>
        </div>

        <div id="_mobile_user_info"></div>
        <div id="_mobile_cart"></div>
      </div>
    </div>
  </nav>
{/block}

{block name='header_top'}
  <div class="{$headerBottomName}">
    <div class="container {$headerBottomName}__container">
      <div id="_desktop_logo" class="logo logo-desktop order-1 order-xl-0">
        {if $page.page_name == 'index'}<h1>{/if}
        <a class="navbar-brand" href="{$urls.pages.index}">
          <img class="logo img-fluid" src="{$shop.logo_details.src}" alt="{$shop.name}" loading="lazy" width="{$shop.logo_details.width}" height="{$shop.logo_details.height}">
        </a>
        {if $page.page_name == 'index'}</h1>{/if}
      </div>

      {hook h='displayTop'}
    </div>
  </div>
  {hook h='displayNavFullWidth'}
{/block}