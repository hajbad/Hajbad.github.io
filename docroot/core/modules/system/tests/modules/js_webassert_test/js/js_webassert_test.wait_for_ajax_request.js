/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.js_webassert_test_wait_for_ajax_request = {
    attach: function attach(context) {
      $('input[name="test_assert_wait_on_ajax_input"]').val('js_webassert_test');
    }
  };
})(jQuery, Drupal, drupalSettings);