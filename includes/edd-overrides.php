<?php

	/**
	 * Add body class when using Stripe checkout
	 */
	function keel_is_stripe_checkout_class( $classes ) {
		if ( function_exists( 'edd_get_option' ) && !empty( edd_get_option( 'stripe_checkout' ) ) ) {
			$classes[] = 'edd-stripe-checkout';
		}
		return $classes;
	}
	add_filter( 'body_class', 'keel_is_stripe_checkout_class' );



	/**
	 * Add stripe language to credit card field
	 */
	function keel_add_via_stripe ( $gateways ) {
		if (array_key_exists( 'stripe', $gateways )) {
			if (array_key_exists( 'checkout_label', $gateways['stripe'] ))
			$gateways['stripe']['checkout_label'] = 'Credit Card (via Stripe)';
		}
		return $gateways;
	}
	add_filter( 'edd_payment_gateways', 'keel_add_via_stripe' );



	/**
	 * Disable EDD verification emails
	 */
	function keel_disable_verification_email() {
		remove_action( 'edd_send_verification_email', 'edd_process_user_verification_request' );
	}
	add_action('init', 'keel_disable_verification_email');



	/**
	 * Unset first and last name as required fields in checkout
	 * @param  Array $required_fields Required fields
	 */
	function keel_edd_purchase_form_required_fields( $required_fields ) {
		unset( $required_fields['edd_first'] );
		unset( $required_fields['edd_last'] );
		return $required_fields;
	}
	add_filter( 'edd_purchase_form_required_fields', 'keel_edd_purchase_form_required_fields' );



	/**
	 * Add "powered by Stripe" to credit card gateway
	 * @param  String $label   The label
	 * @param  String $gateway The gateway
	 * @return String          The modified label
	 */
	function keel_edd_add_powered_by_stripe( $label, $gateway ) {
		if ($gateway === 'stripe') {
			return __( 'Credit Card (via Stripe)', 'keel_edd' );
		}
		return $label;
	}
	add_filter( 'edd_gateway_checkout_label', 'keel_edd_add_powered_by_stripe' );



	/**
	 * Remove default name fields from checkout
	 */
	function keel_edd_remove_names() {
		remove_action( 'edd_purchase_form_after_user_info', 'edd_user_info_fields' );
	}
	add_action( 'init', 'keel_edd_remove_names' );



	/**
	 * Remove name fields from checkout form
	 */
	function keel_edd_user_info_fields() {
		if( is_user_logged_in() ) :
			$user_data = get_userdata( get_current_user_id() );
		endif;
		?>
		<fieldset id="edd_checkout_user_info">
			<?php do_action( 'edd_purchase_form_before_email' ); ?>
			<p id="edd-email-wrap">
				<label class="edd-label" for="edd-email"><strong><?php _e('Email Address', 'edd'); ?></strong></label>
				<input class="edd-input required" type="email" name="edd_email" placeholder="<?php _e('Email address', 'edd'); ?>" id="edd-email" value="<?php echo is_user_logged_in() ? $user_data->user_email : ''; ?>"/>
			</p>
			<?php do_action( 'edd_purchase_form_after_email' ); ?>
			<?php do_action( 'edd_purchase_form_user_info' ); ?>
		</fieldset>
		<?php
	}
	add_action( 'edd_purchase_form_after_user_info', 'keel_edd_user_info_fields' );



	/**
	 * Remove default credit card validator
	 */
	function keel_edd_remove_credit_card_validator() {
		wp_dequeue_script( 'creditCardValidator' );
	}
	add_action( 'wp_enqueue_scripts', 'keel_edd_remove_credit_card_validator' );



	/**
	 * Disable purchase button if no JS
	 */
	function keel_edd_no_js_disable_purchase() {
		$label = edd_get_option( 'checkout_label', '' );

		if ( edd_get_cart_total() ) {
			$complete_purchase = ! empty( $label ) ? $label : __( 'Purchase', 'easy-digital-downloads' );
		} else {
			$complete_purchase = ! empty( $label ) ? $label : __( 'Free Download', 'easy-digital-downloads' );
		}

		echo
			'<div id="keel-edd-no-js-purchase-message">' .
				'<em>' . __( 'Please enabled JavaScript to complete your purchase.', 'keel' ) . '</em><br>' .
				'<button class="btn btn-large disabled" disabled="disabled">' . $complete_purchase . '</button>' .
			'</div>';
	}
	add_action( 'edd_purchase_form_after_submit', 'keel_edd_no_js_disable_purchase' );



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



	/**
	 * GDPR Message
	 */
	function keel_edd_gdpr_message() {
		$options = keel_get_theme_options();
		echo stripslashes( $options['gdpr'] );
	}
	add_action( 'edd_purchase_form_after_submit', 'keel_edd_gdpr_message' );



	/**
	 * Remove the "Go Back" button from non-ajax implementations
	 */
	function keel_edd_checkout_submit() {
	?>
		<fieldset id="edd_purchase_submit">
			<?php do_action( 'edd_purchase_form_before_submit' ); ?>

			<?php edd_checkout_hidden_fields(); ?>

			<?php echo edd_checkout_button_purchase(); ?>

			<?php do_action( 'edd_purchase_form_after_submit' ); ?>

			<?php
				// if ( edd_is_ajax_disabled() ) :
				if ( false ) :
			?>
				<p class="edd-cancel"><a href="<?php echo edd_get_checkout_uri(); ?>"><?php _e( 'Go back', 'easy-digital-downloads' ); ?></a></p>
			<?php endif; ?>
		</fieldset>
	<?php
	}
	add_action( 'edd_purchase_form_after_cc_form', 'keel_edd_checkout_submit', 9999 );


	function keel_edd_remove_checkout_submit() {
		remove_action( 'edd_purchase_form_after_cc_form', 'edd_checkout_submit', 9999 );
	}
	add_action( 'init', 'keel_edd_remove_checkout_submit' );



	/**
	 * Add cart icon to the navigation menu if items are in cart
	 */
	function keel_edd_add_cart_link_to_nav( $items, $args ) {
		if ( $args->theme_location !== 'primary' ) return $items;
		if ( !function_exists( 'edd_get_cart_quantity' ) ) return $items;
		$cart_quantity = edd_get_cart_quantity();
		$items .=
			'<li id="primary-nav-edd-cart" data-edd-cart-quantity="' . $cart_quantity . '">' .
				'<a href="' . edd_get_checkout_uri() . '">' .
					'<svg xmlns="http://www.w3.org/2000/svg" style="height: 1em; width: 1em;" viewBox="0 0 17 17"><path fill="currentColor" d="M6.375 15.406a1.594 1.594 0 1 1-3.189 0 1.594 1.594 0 0 1 3.189 0zM17 15.406a1.594 1.594 0 1 1-3.189 0 1.594 1.594 0 0 1 3.189 0zM17 8.5V2.125H4.25c0-.587-.476-1.063-1.063-1.063H-.001v1.063h2.125l.798 6.841a2.124 2.124 0 0 0 1.327 3.784h12.75v-1.063H4.249a1.063 1.063 0 0 1-1.063-1.063v-.011l13.812-2.114z"/></svg> ' . __( 'Cart', 'keel' ) . ' (' . $cart_quantity . ')' .
				'</a>' .
			'</li>';
		return $items;
	}
	add_filter( 'wp_nav_menu_items', 'keel_edd_add_cart_link_to_nav', 10, 2);