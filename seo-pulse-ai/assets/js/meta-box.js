jQuery(document).ready(function ($) {
    // Handle fix button clicks
    $('.seo-pulse-fix-btn').on('click', function () {
        var $btn = $(this);
        var issueId = $btn.data('issue-id');
        var postId = $btn.data('post-id');
        var fixType = $btn.data('fix-type');

        // Disable button and show loading state
        $btn.prop('disabled', true).text('Applying...');

        $.ajax({
            url: seoPulseData.ajax_url,
            type: 'POST',
            data: {
                action: 'seo_pulse_apply_fix',
                nonce: seoPulseData.nonce,
                post_id: postId,
                fix_type: fixType,
                issue_id: issueId
            },
            success: function (response) {
                if (response.success) {
                    $btn.text('✓ Fixed').addClass('button-disabled');
                    $btn.closest('.seo-pulse-issue').fadeOut(300, function () {
                        $(this).remove();

                        // Check if all issues are resolved
                        if ($('.seo-pulse-issue').length === 0) {
                            $('.seo-pulse-issues').html(
                                '<div class="seo-pulse-success" style="padding: 20px; text-align: center;">' +
                                '<p style="color: #00a32a; font-weight: 600; margin: 0;">✓ All issues resolved!</p>' +
                                '</div>'
                            );
                        }
                    });

                    // Show success notice
                    if (typeof wp !== 'undefined' && wp.data) {
                        wp.data.dispatch('core/notices').createSuccessNotice(
                            'SEO fix applied successfully!',
                            { isDismissible: true }
                        );
                    }
                } else {
                    alert('Error: ' + (response.data.message || 'Unknown error'));
                    $btn.prop('disabled', false).text('Apply Fix');
                }
            },
            error: function () {
                alert('Network error. Please try again.');
                $btn.prop('disabled', false).text('Apply Fix');
            }
        });
    });

    // Handle ignore button clicks
    $('.seo-pulse-issue .button:contains("Ignore")').on('click', function () {
        $(this).closest('.seo-pulse-issue').fadeOut(300, function () {
            $(this).remove();
        });
    });
});
