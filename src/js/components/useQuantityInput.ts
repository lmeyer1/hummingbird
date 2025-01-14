/**
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as Quantity from '@constants/useQuantityInput-data';
import selectorsMap from '@constants/selectors-map';
import debounce from '@helpers/debounce';
import useAlert from './useAlert';
import useToast from './useToast';

const useQuantityInput = (selector = selectorsMap.qtyInput.default, delay = Quantity.delay) => {
  const qtyInputNodeList = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

  if (qtyInputNodeList.length > 0) {
    qtyInputNodeList.forEach((qtyInputWrapper: HTMLDivElement) => {
      const qtyInput = qtyInputWrapper.querySelector<HTMLInputElement>('input');

      if (qtyInput) {
        const incrementButton = qtyInputWrapper.querySelector<HTMLButtonElement>(selectorsMap.qtyInput.increment);
        const decrementButton = qtyInputWrapper.querySelector<HTMLButtonElement>(selectorsMap.qtyInput.decrement);

        if (incrementButton && decrementButton) {
          const qtyInputGroup: Quantity.InputGroup = {qtyInput, incrementButton, decrementButton};
          // The changeQuantity() will be called immediatly and change the input value
          incrementButton.addEventListener('click', () => changeQuantity(qtyInput, 1));
          decrementButton.addEventListener('click', () => changeQuantity(qtyInput, -1));
          // The updateQuantity() will be called after timeout and send the update request with current input value
          incrementButton.addEventListener('click', debounce(async () => {
            updateQuantity(qtyInputGroup, 1);
          }, delay));
          decrementButton.addEventListener('click', debounce(async () => {
            updateQuantity(qtyInputGroup, -1);
          }, delay));

          // If the input element has update URL (e.g. Cart)
          // then convert the buttons when user changed the value manually
          if (qtyInput.hasAttribute('data-update-url')) {
            qtyInput.addEventListener('keyup', () => {
              showConfirmationButtons(qtyInputGroup);
            });
          }
        }
      }
    });
  }
};

const changeQuantity = (qtyInput: HTMLInputElement, change: number) => {
  const {mode} = qtyInput.dataset;

  // If the confirmation buttons displayed then skip changing the input value
  if (mode !== 'confirmation') {
    const currentValue = Number(qtyInput.value);
    const min = (qtyInput.dataset.updateUrl === undefined) ? Number(qtyInput.getAttribute('min')) : 0;
    const newValue = Math.max(currentValue + change, min);
    qtyInput.value = String(newValue);
  }
};

const updateQuantity = async (qtyInputGroup: Quantity.InputGroup, change: number) => {
  const {prestashop} = window;
  const {qtyInput} = qtyInputGroup;
  const {mode} = qtyInput.dataset;

  // If confirmation buttons displayed and the Cancel button selected then change the buttons to the spin mode
  // else send the update request (user clicked spin buttons or the OK button in the confirmation mode)
  if (mode === 'confirmation' && change < 0) {
    showSpinButtons(qtyInputGroup);
  } else {
    const targetValue = Number(qtyInput.value);
    const baseValue = Number(qtyInput.getAttribute('value'));
    const quantity = targetValue - baseValue;

    if (Number.isNaN(targetValue) === false && quantity !== 0) {
      const requestUrl = qtyInput.dataset.updateUrl;

      if (requestUrl !== undefined) {
        const targetButton = getTargetButton(qtyInputGroup, change);
        const targetButtonIcon = targetButton.querySelector<HTMLElement>('i:not(.d-none)');
        const targetButtonSpinner = targetButton.querySelector<HTMLElement>(selectorsMap.qtyInput.spinner);

        toggleButtonSpinner(targetButton, targetButtonIcon, targetButtonSpinner);

        const {productId} = qtyInput.dataset;

        try {
          const response = await sendUpdateCartRequest(requestUrl, quantity);

          if (response.ok) {
            const data = await response.json();

            if (data.hasError) {
              const errors = data.errors as Array<string>;
              const productAlertSelector = resetAlertContainer(Number(productId));

              if (errors && productAlertSelector) {
                errors.forEach((error: string) => {
                  useAlert(error, {type: 'danger', selector: productAlertSelector}).show();
                });
              }
            } else {
              const errors = data.errors as string;

              if (errors) {
                useToast(errors, {type: 'warning', autohide: false}).show();
              }
              prestashop.emit('updateCart', {
                reason: qtyInput.dataset,
                resp: data,
              });
            }
            // Change the input value based on returned quantity
            qtyInput.value = data.quantity;
            // If user used the confirmation mode, need to update input value in the DOM
            qtyInput.setAttribute('value', data.quantity);
          } else {
            // Something went wrong so call the catch block
            throw response;
          }
        } catch (error) {
          // An error has occurred on update so revert to the value in the DOM
          qtyInput.value = String(baseValue);
          const errorData = error as Response;

          if (errorData.status !== undefined) {
            const errorMsg = `${errorData.statusText}: ${errorData.url}`;
            const productAlertSelector = resetAlertContainer(Number(productId));
            useAlert(errorMsg, {type: 'danger', selector: productAlertSelector}).show();

            prestashop.emit('handleError', {
              eventType: 'updateProductInCart',
              resp: errorData,
            });
          }
        } finally {
          toggleButtonSpinner(targetButton, targetButtonIcon, targetButtonSpinner);
          showSpinButtons(qtyInputGroup);
        }
      }
    } else {
      // The input value is not a correct number so revert to the value in the DOM
      qtyInput.value = String(baseValue);
      showSpinButtons(qtyInputGroup);
    }
  }
};

const getTargetButton = (qtyInputGroup: Quantity.InputGroup, change: number) => {
  const {incrementButton, decrementButton} = qtyInputGroup;

  return (change > 0) ? incrementButton : decrementButton;
};

const resetAlertContainer = (productId: number) => {
  if (productId) {
    const productAlertSelector = selectorsMap.qtyInput.alert(productId);
    const productAlertContainer = document.querySelector<HTMLDivElement>(productAlertSelector);

    if (productAlertContainer) {
      productAlertContainer.innerHTML = '';
    }
    return productAlertSelector;
  }
  return undefined;
};

const toggleButtonSpinner = (button: HTMLButtonElement, icon: HTMLElement | null, spinner: HTMLElement | null) => {
  button.toggleAttribute('disabled');
  icon?.classList.toggle('d-none');
  spinner?.classList.toggle('d-none');
};

const showSpinButtons = (qtyInputGroup: Quantity.InputGroup) => {
  const {qtyInput, incrementButton, decrementButton} = qtyInputGroup;
  const {mode} = qtyInput.dataset;

  if (mode === 'confirmation') {
    toggleButtonIcon(incrementButton, decrementButton);
    qtyInput.dataset.mode = 'spin';
    const baseValue = qtyInput.getAttribute('value');

    // Maybe user changed the input value manually bu not confirmed
    // so revert the input value based on the value in the DOM
    if (baseValue) {
      qtyInput.value = baseValue;
    }
  }
};

const showConfirmationButtons = (qtyInputGroup: Quantity.InputGroup) => {
  const {qtyInput, incrementButton, decrementButton} = qtyInputGroup;
  const {mode} = qtyInput.dataset;

  if (mode !== 'confirmation') {
    toggleButtonIcon(incrementButton, decrementButton);
    qtyInput.dataset.mode = 'confirmation';
  }
};

const toggleButtonIcon = (incrementButton: HTMLButtonElement, decrementButton: HTMLButtonElement) => {
  const incrementButtonIcons = incrementButton.querySelectorAll('i') as NodeListOf<HTMLElement>;
  incrementButtonIcons.forEach((icon: HTMLElement) => {
    icon.classList.toggle('d-none');
  });
  const decrementButtonIcons = decrementButton.querySelectorAll('i') as NodeListOf<HTMLElement>;
  decrementButtonIcons.forEach((icon: HTMLElement) => {
    icon.classList.toggle('d-none');
  });
};

const sendUpdateCartRequest = async (updateUrl: string, quantity: number) => {
  const formData = new FormData();
  formData.append('ajax', '1');
  formData.append('action', 'update');
  formData.append('qty', String(Math.abs(quantity)));
  formData.append('op', (quantity > 0) ? 'up' : 'down');

  const response = await fetch(updateUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
    },
    body: formData,
  });

  return response;
};

export default useQuantityInput;
