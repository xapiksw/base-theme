import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckoutPayment from 'Component/CheckoutPayment';
import Braintree from 'Component/Braintree';

import './CheckoutPayments.style';
import { paymentMethodsType } from 'Type/Checkout';
import { addressType } from 'Type/Account';
import PayPal from 'Component/PayPal';

export const BRAINTREE = 'braintree';
export const CHECK_MONEY = 'checkmo';
export const PAYPAL_EXPRESS = 'paypal_express';

class CheckoutPayments extends PureComponent {
    static propTypes = {
        selectPaymentMethod: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        initBraintree: PropTypes.func.isRequired,
        selectedPaymentCode: PropTypes.oneOf([
            BRAINTREE,
            CHECK_MONEY,
            PAYPAL_EXPRESS
        ]).isRequired
    };

    paymentRenderMap = {
        [BRAINTREE]: this.renderBrainTreePayment.bind(this)
    };

    renderBrainTreePayment() {
        const { initBraintree } = this.props;

        return (
            <Braintree init={ initBraintree } />
        );
    }

    renderPayment = (method) => {
        const {
            selectPaymentMethod,
            selectedPaymentCode
        } = this.props;

        const { code } = method;
        const isSelected = selectedPaymentCode === code;

        return (
            <CheckoutPayment
              key={ code }
              isSelected={ isSelected }
              method={ method }
              onClick={ selectPaymentMethod }
            />
        );
    };

    renderPayments() {
        const { paymentMethods } = this.props;
        return paymentMethods.map(this.renderPayment);
    }

    renderSelectedPayment() {
        const { selectedPaymentCode } = this.props;
        const render = this.paymentRenderMap[selectedPaymentCode];
        if (!render) return null;
        return render();
    }

    renderHeading() {
        return (
            <h2 block="Checkout" elem="Heading">
                { __('Select payment method') }
            </h2>
        );
    }

    renderPayPal() {
        const { selectedPaymentCode } = this.props;
        return <PayPal isDisabled={ selectedPaymentCode !== PAYPAL_EXPRESS } />;
    }

    render() {
        return (
            <div block="CheckoutPayments">
                { this.renderHeading() }
                <ul block="CheckoutPayments" elem="Methods">
                    { this.renderPayments() }
                </ul>
                { this.renderSelectedPayment() }
                { this.renderPayPal() }
            </div>
        );
    }
}

export default CheckoutPayments;