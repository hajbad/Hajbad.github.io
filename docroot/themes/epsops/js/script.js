(function ($, window, Drupal, drupalSettings) {


    $(function () {

console.log('revised');
        $(document).ready(function() {
            $(".button-collapse").sideNav({
                breakpoint: 1200
            });
            // SideNav Scrollbar Initialization
            var sideNavScrollbar = document.querySelector('.custom-scrollbar');
            var ps = new PerfectScrollbar(sideNavScrollbar);
        });

        new WOW().init();
    });





})(jQuery, this, Drupal, drupalSettings);