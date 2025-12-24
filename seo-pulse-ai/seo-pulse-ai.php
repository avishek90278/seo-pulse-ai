<?php
/**
 * Plugin Name: SEO Pulse AI
 * Plugin URI: https://seopulse.ai
 * Description: Connect your WordPress site to SEO Pulse AI for expert SEO recommendations and one-click fixes.
 * Version: 1.0.0
 * Author: SEO Pulse AI
 * Author URI: https://seopulse.ai
 * License: GPLv2 or later
 * Text Domain: seo-pulse-ai
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants
define( 'SEO_PULSE_VERSION', '1.0.0' );
define( 'SEO_PULSE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SEO_PULSE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include required files
require_once SEO_PULSE_PLUGIN_DIR . 'includes/admin-menu.php';
require_once SEO_PULSE_PLUGIN_DIR . 'includes/settings-page.php';
require_once SEO_PULSE_PLUGIN_DIR . 'includes/api-client.php';
require_once SEO_PULSE_PLUGIN_DIR . 'includes/meta-box.php';
require_once SEO_PULSE_PLUGIN_DIR . 'includes/fix-handler.php';

// Activation hook
register_activation_hook( __FILE__, 'seo_pulse_activate' );
function seo_pulse_activate() {
    // Set default options
    add_option( 'seo_pulse_api_key', '' );
    add_option( 'seo_pulse_api_status', 'disconnected' );
}

// Deactivation hook
register_deactivation_hook( __FILE__, 'seo_pulse_deactivate' );
function seo_pulse_deactivate() {
    // Clean up if needed
}
