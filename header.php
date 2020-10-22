<?php

/**
 * header.php
 * Template for header content.
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>

	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><?php wp_title( '|', true, 'right' ); ?></title>
		<?php if ( is_home () ) : ?><meta name="description" content="<?php bloginfo('description'); ?>"><?php endif; ?>

		<!-- Mobile Screen Resizing -->
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!-- Icons: place in the root directory -->
		<!-- https://github.com/audreyr/favicon-cheat-sheet -->
		<link rel="shortcut icon" href="/img/favicon.ico">
		<link rel="icon" sizes="16x16 32x32" href="/img/favicon.ico">

		<?php wp_head(); ?>

	</head>

	<body <?php body_class(); ?>>

		<!-- Old Browser Warning -->
		<!--[if lt IE 11]>
			<aside class="container">
				<p>Did you know that your web browser is a bit old? Some of the content on this site might not work right as a result. <a href="http://whatbrowser.org">Upgrade your browser</a> for a faster, safer, and better web experience.</p>
			</aside>
		<![endif]-->

		<?php
			// a11y enhancements
			get_template_part( 'nav', 'accessibility' );
		?>

		<?php
			// Get site navigation
			get_template_part( 'nav', 'main' );
		?>

		<main class="tabindex" id="main" tabindex="-1">

			<div class="container">