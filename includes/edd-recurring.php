<?php

	// /**
	//  * Cancel payment if subscription expires prematurely
	//  */
	// function keel_edd_cancel_payment ( $id, $subscription ) {

	// 	// Get the payment associated with the subscription
	// 	$payment = new EDD_Payment( $subscription->parent_payment_id );
	// 	if (empty($payment)) return;

	// 	// Update the payment status
	// 	$payment->update_status( 'cancelled' );
	// 	$payment->save();

	// }
	// add_action( 'edd_subscription_cancelled', 'keel_edd_cancel_payment', 10, 2 );
	// add_action( 'edd_subscription_expired', 'keel_edd_cancel_payment', 10, 2 );

	// /**
	//  * Reactivate payment if subscription renewed
	//  */
	// function keel_edd_reactivate_payment ( $id, $subscription ) {

	// 	// Get the payment associated with the subscription
	// 	$payment = new EDD_Payment( $subscription->parent_payment_id );
	// 	if (empty($payment)) return;

	// 	// Update the payment status
	// 	$payment->update_status( 'complete' );
	// 	$payment->save();

	// }
	// add_action( 'example_action', 'example_callback', 10, 2 );

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