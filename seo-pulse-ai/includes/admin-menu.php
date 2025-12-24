<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Add admin menu items
 */
add_action( 'admin_menu', 'seo_pulse_add_menu' );
function seo_pulse_add_menu() {
    // Main menu item
    add_menu_page(
        'SEO Pulse AI',           // Page title
        'SEO Pulse AI',           // Menu title
        'manage_options',         // Capability
        'seo-pulse-ai',           // Menu slug
        'seo_pulse_dashboard_page', // Callback function
        'dashicons-chart-area',   // Icon
        30                        // Position
    );
    
    // Dashboard submenu
    add_submenu_page(
        'seo-pulse-ai',
        'Dashboard',
        'Dashboard',
        'manage_options',
        'seo-pulse-ai',
        'seo_pulse_dashboard_page'
    );
    
    // Settings submenu
    add_submenu_page(
        'seo-pulse-ai',
        'Settings',
        'Settings',
        'manage_options',
        'seo-pulse-settings',
        'seo_pulse_settings_page'
    );
}

/**
 * Dashboard page callback
 */
function seo_pulse_dashboard_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    
    // Check if API key is set
    $api_key = get_option( 'seo_pulse_api_key' );
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        
        <?php if ( empty( $api_key ) ) : ?>
            <div class="notice notice-warning">
                <p>
                    <strong>API Key Required:</strong> 
                    Please <a href="<?php echo admin_url( 'admin.php?page=seo-pulse-settings' ); ?>">add your API key</a> 
                    to connect with SEO Pulse AI.
                </p>
            </div>
        <?php else : ?>
            <?php
            // Fetch issues from API
            $api_client = new SEO_Pulse_API_Client();
            $site_issues = $api_client->get_site_issues( home_url() );
            ?>
            
            <div class="seo-pulse-dashboard">
                <div class="seo-pulse-stats">
                    <div class="stat-box">
                        <h3>Total Issues</h3>
                        <p class="stat-number"><?php echo count( $site_issues ); ?></p>
                    </div>
                    <div class="stat-box critical">
                        <h3>Critical</h3>
                        <p class="stat-number">
                            <?php echo count( array_filter( $site_issues, function($i) { return $i['severity'] === 'critical'; } ) ); ?>
                        </p>
                    </div>
                    <div class="stat-box warning">
                        <h3>High Priority</h3>
                        <p class="stat-number">
                            <?php echo count( array_filter( $site_issues, function($i) { return $i['severity'] === 'high'; } ) ); ?>
                        </p>
                    </div>
                </div>
                
                <h2>Recent SEO Issues</h2>
                <?php if ( empty( $site_issues ) ) : ?>
                    <div class="notice notice-success">
                        <p><strong>Great job!</strong> No SEO issues detected on your site.</p>
                    </div>
                <?php else : ?>
                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th>Issue</th>
                                <th>Severity</th>
                                <th>Page</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ( array_slice( $site_issues, 0, 10 ) as $issue ) : ?>
                                <tr>
                                    <td><?php echo esc_html( $issue['message'] ); ?></td>
                                    <td>
                                        <span class="seo-pulse-badge <?php echo esc_attr( $issue['severity'] ); ?>">
                                            <?php echo esc_html( ucfirst( $issue['severity'] ) ); ?>
                                        </span>
                                    </td>
                                    <td><?php echo esc_html( $issue['page_title'] ?? 'Unknown' ); ?></td>
                                    <td>
                                        <?php if ( ! empty( $issue['post_id'] ) ) : ?>
                                            <a href="<?php echo get_edit_post_link( $issue['post_id'] ); ?>" class="button button-small">
                                                Edit Page
                                            </a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <style>
        .seo-pulse-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .stat-box {
            background: #fff;
            border: 1px solid #c3c4c7;
            border-left: 4px solid #2271b1;
            padding: 20px;
            border-radius: 4px;
        }
        .stat-box.critical {
            border-left-color: #d63638;
        }
        .stat-box.warning {
            border-left-color: #dba617;
        }
        .stat-box h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #50575e;
        }
        .stat-number {
            font-size: 32px;
            font-weight: 600;
            margin: 0;
            color: #1d2327;
        }
        .seo-pulse-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
        }
        .seo-pulse-badge.critical {
            background: #d63638;
            color: #fff;
        }
        .seo-pulse-badge.high {
            background: #dba617;
            color: #fff;
        }
        .seo-pulse-badge.medium {
            background: #2271b1;
            color: #fff;
        }
    </style>
    <?php
}
