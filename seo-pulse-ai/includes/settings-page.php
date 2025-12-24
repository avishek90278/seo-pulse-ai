<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Settings page callback
 */
function seo_pulse_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    
    // Handle form submission
    if ( isset( $_POST['seo_pulse_save_settings'] ) ) {
        check_admin_referer( 'seo_pulse_settings' );
        
        $api_key = sanitize_text_field( $_POST['seo_pulse_api_key'] );
        update_option( 'seo_pulse_api_key', $api_key );
        
        // Test connection
        if ( ! empty( $api_key ) ) {
            $api_client = new SEO_Pulse_API_Client();
            $is_valid = $api_client->test_connection();
            update_option( 'seo_pulse_api_status', $is_valid ? 'connected' : 'error' );
            
            if ( $is_valid ) {
                echo '<div class="notice notice-success is-dismissible"><p>API key saved and connection successful!</p></div>';
            } else {
                echo '<div class="notice notice-error is-dismissible"><p>API key saved but connection failed. Please check your key.</p></div>';
            }
        } else {
            update_option( 'seo_pulse_api_status', 'disconnected' );
            echo '<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>';
        }
    }
    
    $api_key = get_option( 'seo_pulse_api_key', '' );
    $status = get_option( 'seo_pulse_api_status', 'disconnected' );
    ?>
    
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        
        <form method="post" action="">
            <?php wp_nonce_field( 'seo_pulse_settings' ); ?>
            
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="seo_pulse_api_key">API Key</label>
                    </th>
                    <td>
                        <input 
                            type="text" 
                            id="seo_pulse_api_key" 
                            name="seo_pulse_api_key" 
                            value="<?php echo esc_attr( $api_key ); ?>" 
                            class="regular-text"
                            placeholder="Enter your API key"
                        />
                        <p class="description">
                            Get your API key from your 
                            <a href="http://localhost:3000" target="_blank">SEO Pulse AI dashboard</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Connection Status</th>
                    <td>
                        <?php if ( $status === 'connected' ) : ?>
                            <span style="color: #00a32a; font-weight: 600;">
                                ● Connected
                            </span>
                        <?php elseif ( $status === 'error' ) : ?>
                            <span style="color: #d63638; font-weight: 600;">
                                ● Connection Failed
                            </span>
                        <?php else : ?>
                            <span style="color: #646970;">
                                ● Not Connected
                            </span>
                        <?php endif; ?>
                    </td>
                </tr>
            </table>
            
            <p class="submit">
                <input 
                    type="submit" 
                    name="seo_pulse_save_settings" 
                    class="button button-primary" 
                    value="Save Settings"
                />
            </p>
        </form>
        
        <hr/>
        
        <h2>How It Works</h2>
        <ol>
            <li>Enter your API key above and save</li>
            <li>Edit any post or page</li>
            <li>Look for the "SEO Pulse AI" meta box</li>
            <li>Review SEO suggestions and apply fixes with one click</li>
        </ol>
    </div>
    <?php
}
