<?php

	/**
	 * Update the payment status when a subscription status changes
	 * @param  String $old_status   The old status
	 * @param  String $new_status   The new status
	 * @param  Object $subscription The subscription data
	 */
	function keel_edd_update_payment_on_subscription_status_change ( $old_status, $new_status, $subscription ) {

		// Get the payment associated with the subscription
		$payment = new EDD_Payment( $subscription->parent_payment_id );
		if (empty($payment)) return;

		// Define the $status
		$status = ($new_status == 'cancelled' || $new_status == 'expired') ? 'cancelled' : 'complete';

		// Update the payment status
		$payment->update_status( $status );
		$payment->save();

	}
	add_action( 'edd_subscription_status_change', 'keel_edd_update_payment_on_subscription_status_change', 10, 3 );



	/**
	 * Check if cart has a recurring payment
	 * @return Boolean Returns true if recurring payment is in cart
	 */
	function keel_is_recurring_in_cart () {
		$cart = edd_get_cart_contents();
		if ( is_array( $cart ) ) {
			foreach ( $cart as $download ) {
				if ( isset( $download['options'] ) && isset( $download['options']['recurring'] ) ) return true;
			}
		}
		return false;
	}



	/**
	 * Show payment details for payment installments
	 */
	function keel_edd_subscription_message () {
		if (!keel_is_recurring_in_cart()) return;
		$options = keel_get_theme_options();
		echo stripslashes( $options['subscription'] );
	}
	add_action('edd_before_purchase_form', 'keel_edd_subscription_message');
	// add_action( 'edd_checkout_form_top', 'keel_edd_subscription_message' );