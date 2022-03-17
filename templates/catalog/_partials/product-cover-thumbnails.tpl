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
<div 
  id="product-images" 
  class="carousel carousel-dark slide js-product-carousel row" 
  data-bs-ride="carousel"
  data-bs-interval="false"
>
  {block name='product_images'}
    <div class="product-thumbnails-container js-qv-mask col-lg-2">
      <ul class="product-thumbnails js-qv-product-images">
        {foreach from=$product.images item=image key=key}
          <li 
            class="thumb-container js-thumb-container{if $image.id_image == $product.default_image.id_image} active{/if}" 
            data-bs-target="#product-images"
            data-bs-slide-to="{$key}"
            {if $image.id_image == $product.default_image.id_image} 
              aria-current="true"
            {/if}
            aria-label="{l s='Product image %number%' d='Shop.Theme.Catalog' sprintf=['%number%' => $key]}"
         >
            <img
              class="img-fluid thumb js-thumb{if $image.id_image == $product.default_image.id_image} js-thumb-selected{/if}"
              data-image-medium-src="{$image.bySize.medium_default.url}"
              data-image-large-src="{$image.bySize.large_default.url}"
              src="{$image.bySize.home_default.url}"
              {if !empty($image.legend)}
                alt="{$image.legend}"
                title="{$image.legend}"
              {else}
                alt="{$product.name}"
              {/if}
              loading="lazy"
           >
          </li>
        {/foreach}
      </ul>
    </div>
  {/block}
  <div class="col-lg-9 p-0 h-100">
    <div class="carousel-inner">
      {include file='catalog/_partials/product-flags.tpl'}

      {if $product.images|@count > 1}
        <button class="carousel-control-prev" type="button" data-bs-target="#product-images" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#product-images" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      {/if}

      {block name='product_cover'}
        {if $product.default_image}
          {foreach from=$product.images item=image key=key}
            <li 
              class="carousel-item{if $image.id_image == $product.default_image.id_image} active{/if}" 
           >
              <img
                class="img-fluid"
                src="{$image.bySize.large_default.url}"
                {if !empty($image.legend)}
                  alt="{$image.legend}"
                  title="{$image.legend}"
                {else}
                  alt="{$product.name}"
                {/if}
                loading="lazy"
             >
            </li>
          {/foreach}
        {else}
          <li class="carousel-item">
            <img 
              src="{$urls.no_picture_image.bySize.large_default.url}"
              loading="lazy"
           >
          </li>
        {/if}
      {/block}
    </div>
  </div>
</div>

{hook h='displayAfterProductThumbs' product=$product}