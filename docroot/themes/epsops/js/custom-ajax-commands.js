(function ($, Drupal) {


    Drupal.AjaxCommands.prototype.refreshListDiv = function (ajax, response, status) {
        let sortOptions = {};
        switch(response.args.type){
            case 'video':
                sortOptions = {
                    valueNames: [ 'name',{ attr: 'data-vg-value', name: 'vg-value' },{ attr: 'data-vc-value', name: 'vc-value' },{ attr: 'data-pub-value', name: 'pub-value' } ],
                    listClass: ( response.settings.listClass =! 'boolean' && (typeof(response.settings.listClass !== undefined)) ) ?  response.settings.listClass : 'views-infinite-scroll-content-wrapper'
                };
                break;
            case 'tag':
                sortOptions = {
                    valueNames: [ { attr: 'data-name', name: 'name' },
                                // 'count',
                                { attr: 'data-count', name: 'count' },
                                { attr: 'data-min-vg', name: 'min-vg' },
                                { attr: 'data-max-vg', name: 'max-vg' },
                                { attr: 'data-min-vc', name: 'min-vc' },
                                { attr: 'data-max-vc', name: 'max-vc' }
                                ],
                    listClass: 't-body'
                };
                break;
            case 'table':
                sortOptions = {
                    valueNames: [ { attr: 'data-name', name: 'name' },'count' ],
                    listClass: 't-body'
                };
                break;
        }


        try {
            let sortViewcount = new List(response.selector, sortOptions);
        }catch(err) {
            console.log('error found');
            // console.log(err);
        }

        // let d = Drupal.ajax.bindAjaxLinks('#'+response.selector);
        // console.log(sortOptions);
    };


    Drupal.AjaxCommands.prototype.refreshMasonryDiv = function (ajax, response, status) {
        $('#v-next-page-link').append('<div id="masonry-loader" class="my-4"> <span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span></div>');

            if(response.args.initMasonry){
                $(response.selector).html('<span class="loader--fixed d-flex text-center my-4"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
            }

            let $items = $(response.args.newItems);
            let $grid = $items.imagesLoaded(function () {
                if(response.args.initMasonry){
                    $(response.selector).masonry({
                        itemSelector: '.views-row',
                    });

                    $(response.selector).html($items).masonry('reloadItems',$items);
                    $(response.selector).masonry({
                        itemSelector: '.views-row',
                    }).masonry('layout');

                }else{
                    $(response.selector).append( $items ).masonry('appended',$items);
                }




            }).always( function( instance ) {
                // console.log('all images loaded');
            }).done( function( instance ) {
                // console.log('all images successfully loaded');
                $('#masonry-loader').remove();
            }).fail( function(instance, image) {
                // console.log(instance);
            }).progress( function( instance, image ) {
                if(!image.isLoaded){
                    image.img.src =  Drupal.behaviors.brokenImgUrl;
                }
            });






    };



    // Drupal.AjaxCommands.prototype.loadChart = function (ajax, response, status) {
    //
    //
    //     // $('.ajax-charts').each(function(i,chartValue){
    //
    //         let $linkElement = $(response.selector);
    //         let $linkElement = $(response.selector);
    //         let callback = {
    //             success: function (data, textStatus) {
    //
    //                 if($linkElement.data('chart-type') === 'line'){
    //                     Drupal.behaviors.highchartLine(chartValue,data);
    //                 }
    //
    //                 if($linkElement.data('chart-type') === 'spline'){
    //                     Drupal.behaviors.highchartSpline(chartValue,data);
    //                 }
    //
    //                 if($linkElement.data('chart-type') === 'fixed-placement'){
    //                     Drupal.behaviors.highchartFixedPlacement(chartValue,data);
    //                 }
    //
    //                 if($linkElement.data('chart-type') === 'word-cloud'){
    //                     Drupal.behaviors.highchartWordCloud(chartValue,data);
    //                 }
    //
    //                 if($linkElement.data('chart-type') === 'gauge'){
    //                     Drupal.behaviors.highchartGauges(chartValue,data);
    //                 }
    //                 if($linkElement.data('chart-type') === 'pyramid'){
    //                     Drupal.behaviors.highchartPyramid(chartValue,data);
    //                 }
    //
    //
    //             }
    //         };
    //         let urlTarget = $linkElement.data('result-url');
    //         $($linkElement).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
    //         Drupal.behaviors.iitAjaxHttpSenders.makeAjaxCall(Drupal.behaviors.sUrl + urlTarget, callback);
    //
    //
    //     // });
    //
    // };




})(jQuery, Drupal);