<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class SEO_Pulse_API_Client {
    
    private $api_url = 'http://localhost:3000/api/analyze'; // Change in production
    private $api_key;
    
    public function __construct() {
        $this->api_key = get_option( 'seo_pulse_api_key', '' );
    }
    
    /**
     * Test API connection
     */
    public function test_connection() {
        if ( empty( $this->api_key ) ) {
            return false;
        }
        
        // For demo purposes, any non-empty key is valid
        // In production, make actual API call
        return strlen( $this->api_key ) > 10;
    }
    
    /**
     * Get SEO issues for a specific post/page
     */
    public function get_page_issues( $post_id ) {
        $url = get_permalink( $post_id );
        
        // For demo, return sample issues
        if ( empty( $this->api_key ) ) {
            return $this->get_demo_issues( $post_id );
        }
        
        // In production, make real API call here
        // $response = wp_remote_post( $this->api_url, array(...) );
        
        return $this->get_demo_issues( $post_id );
    }
    
    /**
     * Get site-wide issues
     */
    public function get_site_issues( $site_url ) {
        // For demo, return sample site issues
        if ( empty( $this->api_key ) ) {
            return array();
        }
        
        $posts = get_posts( array( 'numberposts' => 5, 'post_type' => 'any', 'post_status' => 'publish' ) );
        $issues = array();
        
        foreach ( $posts as $post ) {
            $page_issues = $this->get_demo_issues( $post->ID );
            foreach ( $page_issues as $issue ) {
                $issue['post_id'] = $post->ID;
                $issue['page_title'] = $post->post_title;
                $issues[] = $issue;
            }
        }
        
        return $issues;
    }
    
    /**
     * Demo issues for testing
     */
    private function get_demo_issues( $post_id ) {
        $post = get_post( $post_id );
        $issues = array();
        
        // Check meta description
        $meta_desc = get_post_meta( $post_id, '_yoast_wpseo_metadesc', true );
        if ( empty( $meta_desc ) ) {
            $meta_desc = get_post_meta( $post_id, 'rank_math_description', true );
        }
        
        if ( empty( $meta_desc ) ) {
            $issues[] = array(
                'id' => 'missing_meta_desc',
                'message' => 'Missing meta description',
                'severity' => 'high',
                'fix_type' => 'update_meta_description',
                'suggestion' => 'A compelling meta description can improve click-through rates.',
                'can_auto_fix' => true
            );
        }
        
        // Check title length
        if ( strlen( $post->post_title ) < 10 ) {
            $issues[] = array(
                'id' => 'short_title',
                'message' => 'Title is too short',
                'severity' => 'medium',
                'fix_type' => 'update_title',
                'suggestion' => 'Titles should be at least 10 characters for better SEO.',
                'can_auto_fix' => false
            );
        }
        
        // Check content length
        if ( str_word_count( strip_tags( $post->post_content ) ) < 300 ) {
            $issues[] = array(
                'id' => 'thin_content',
                'message' => 'Content is too thin',
                'severity' => 'critical',
                'fix_type' => 'expand_content',
                'suggestion' => 'Pages with less than 300 words may not rank well.',
                'can_auto_fix' => false
            );
        }
        
        return $issues;
    }
}
