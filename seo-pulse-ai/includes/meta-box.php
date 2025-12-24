<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Add meta box to post editor
 */
add_action( 'add_meta_boxes', 'seo_pulse_add_meta_box' );
function seo_pulse_add_meta_box() {
    $post_types = array( 'post', 'page' );
    
    foreach ( $post_types as $post_type ) {
        add_meta_box(
            'seo-pulse-meta-box',
            'SEO Pulse AI',
            'seo_pulse_meta_box_callback',
            $post_type,
            'side',
            'default'
        );
    }
}

/**
 * Meta box callback
 */
function seo_pulse_meta_box_callback( $post ) {
    $api_key = get_option( 'seo_pulse_api_key' );
    
    if ( empty( $api_key ) ) {
        ?>
        <p>
            <a href="<?php echo admin_url( 'admin.php?page=seo-pulse-settings' ); ?>">
                Connect your API key
            </a> to see SEO recommendations.
        </p>
        <?php
        return;
    }
    
    // Get issues for this post
    $api_client = new SEO_Pulse_API_Client();
    $issues = $api_client->get_page_issues( $post->ID );
    
    wp_nonce_field( 'seo_pulse_meta_box', 'seo_pulse_meta_box_nonce' );
    
    if ( empty( $issues ) ) {
        ?>
        <div class="seo-pulse-success">
            <p style="color: #00a32a; font-weight: 600;">✓ No issues found</p>
            <p style="font-size: 13px; color: #646970;">This page looks good!</p>
        </div>
        <?php
        return;
    }
    ?>
    
    <div class="seo-pulse-issues">
        <?php foreach ( $issues as $issue ) : ?>
            <div class="seo-pulse-issue <?php echo esc_attr( $issue['severity'] ); ?>">
                <div class="issue-header">
                    <span class="severity-badge <?php echo esc_attr( $issue['severity'] ); ?>">
                        <?php echo esc_html( ucfirst( $issue['severity'] ) ); ?>
                    </span>
                    <h4><?php echo esc_html( $issue['message'] ); ?></h4>
                </div>
                <p class="issue-description"><?php echo esc_html( $issue['suggestion'] ); ?></p>
                
                <?php if ( $issue['can_auto_fix'] ) : ?>
                    <button 
                        type="button"
                        class="button button-primary button-small seo-pulse-fix-btn"
                        data-issue-id="<?php echo esc_attr( $issue['id'] ); ?>"
                        data-post-id="<?php echo esc_attr( $post->ID ); ?>"
                        data-fix-type="<?php echo esc_attr( $issue['fix_type'] ); ?>"
                    >
                        Apply Fix
                    </button>
                    <button type="button" class="button button-small">Ignore</button>
                <?php else : ?>
                    <p style="font-size: 12px; color: #646970; margin: 5px 0 0 0;">
                        <em>Manual fix required</em>
                    </p>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
    
    <style>
        .seo-pulse-issue {
            padding: 12px;
            margin-bottom: 12px;
            border-left: 4px solid #646970;
            background: #f9f9f9;
        }
        .seo-pulse-issue.critical {
            border-left-color: #d63638;
        }
        .seo-pulse-issue.high {
            border-left-color: #dba617;
        }
        .seo-pulse-issue.medium {
            border-left-color: #2271b1;
        }
        .issue-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .issue-header h4 {
            margin: 0;
            font-size: 13px;
            font-weight: 600;
        }
        .severity-badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .severity-badge.critical {
            background: #d63638;
            color: #fff;
        }
        .severity-badge.high {
            background: #dba617;
            color: #fff;
        }
        .severity-badge.medium {
            background: #2271b1;
            color: #fff;
        }
        .issue-description {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: #50575e;
        }
    </style>
    <?php
}

/**
 * Enqueue meta box scripts
 */
add_action( 'admin_enqueue_scripts', 'seo_pulse_enqueue_meta_box_scripts' );
function seo_pulse_enqueue_meta_box_scripts( $hook ) {
    if ( $hook !== 'post.php' && $hook !== 'post-new.php' ) {
        return;
    }
    
    wp_enqueue_script(
        'seo-pulse-meta-box',
        SEO_PULSE_PLUGIN_URL . 'assets/js/meta-box.js',
        array( 'jquery' ),
        SEO_PULSE_VERSION,
        true
    );
    
    wp_localize_script( 'seo-pulse-meta-box', 'seoPulseData', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'seo_pulse_fix' )
    ));
}
