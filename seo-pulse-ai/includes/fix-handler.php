<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Handle AJAX fix requests
 */
add_action( 'wp_ajax_seo_pulse_apply_fix', 'seo_pulse_handle_fix' );
function seo_pulse_handle_fix() {
    // Security checks
    check_ajax_referer( 'seo_pulse_fix', 'nonce' );
    
    if ( ! current_user_can( 'edit_posts' ) ) {
        wp_send_json_error( array( 'message' => 'Permission denied' ) );
    }
    
    $post_id = intval( $_POST['post_id'] );
    $fix_type = sanitize_text_field( $_POST['fix_type'] );
    $issue_id = sanitize_text_field( $_POST['issue_id'] );
    
    if ( ! $post_id ) {
        wp_send_json_error( array( 'message' => 'Invalid post ID' ) );
    }
    
    // Store previous value for potential rollback
    $previous_value = '';
    $success = false;
    
    switch ( $fix_type ) {
        case 'update_meta_description':
            // Generate a meta description based on content
            $post = get_post( $post_id );
            $content = strip_tags( $post->post_content );
            $words = str_word_count( $content, 1 );
            $description = implode( ' ', array_slice( $words, 0, 25 ) ) . '...';
            
            // Try Yoast first
            $previous_value = get_post_meta( $post_id, '_yoast_wpseo_metadesc', true );
            $success = update_post_meta( $post_id, '_yoast_wpseo_metadesc', $description );
            
            // Try Rank Math
            if ( ! $success ) {
                $previous_value = get_post_meta( $post_id, 'rank_math_description', true );
                $success = update_post_meta( $post_id, 'rank_math_description', $description );
            }
            
            // Fallback to custom field
            if ( ! $success ) {
                $previous_value = get_post_meta( $post_id, '_seo_pulse_meta_desc', true );
                $success = update_post_meta( $post_id, '_seo_pulse_meta_desc', $description );
            }
            
            // Store rollback data
            if ( $success ) {
                update_post_meta( $post_id, '_seo_pulse_rollback_' . $issue_id, $previous_value );
            }
            break;
            
        case 'update_title':
            // This would update SEO title, not post title
            $post = get_post( $post_id );
            $seo_title = $post->post_title . ' | ' . get_bloginfo( 'name' );
            
            $previous_value = get_post_meta( $post_id, '_yoast_wpseo_title', true );
            $success = update_post_meta( $post_id, '_yoast_wpseo_title', $seo_title );
            
            if ( ! $success ) {
                $previous_value = get_post_meta( $post_id, 'rank_math_title', true );
                $success = update_post_meta( $post_id, 'rank_math_title', $seo_title );
            }
            
            if ( $success ) {
                update_post_meta( $post_id, '_seo_pulse_rollback_' . $issue_id, $previous_value );
            }
            break;
    }
    
    if ( $success ) {
        wp_send_json_success( array( 
            'message' => 'Fix applied successfully!',
            'can_rollback' => ! empty( $previous_value )
        ));
    } else {
        wp_send_json_error( array( 'message' => 'Failed to apply fix' ) );
    }
}

/**
 * Add admin notice for successful fixes
 */
add_action( 'admin_notices', 'seo_pulse_admin_notices' );
function seo_pulse_admin_notices() {
    if ( isset( $_GET['seo_pulse_fixed'] ) ) {
        ?>
        <div class="notice notice-success is-dismissible">
            <p><strong>SEO Pulse AI:</strong> Fix applied successfully!</p>
        </div>
        <?php
    }
}
