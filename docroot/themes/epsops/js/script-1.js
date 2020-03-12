(function ($, window, Drupal, drupalSettings) {
    $(function () {










        //
        // var options2 = {
        //     valueNames: [ 'vg-value', 'vc-value' ]
        // };
        //
        // var userList2 = new List('smart-search-results-box', options2);


        // var $divs = $("div.video-teaser");
        //

        //
        // $(document).on('click','#vc-sort', function () {
        //     var numericallyOrderedDivs = $divs.sort(function (a, b) {
        //         return $(a).find("span.vc.badge b").text() > $(b).find("span.vc.badge b").text();
        //     });
        //     $("#smart-search-results").html(numericallyOrderedDivs);
        // });


        function exportTableToCSV($table, filename) {
            var $headers = $table.find('tr:has(th)')
                , $rows = $table.find('tr:has(td)')
                // Temporary delimiter characters unlikely to be typed by keyboard
                // This is to avoid accidentally splitting the actual contents
                , tmpColDelim = String.fromCharCode(11) // vertical tab character
                , tmpRowDelim = String.fromCharCode(0) // null character
                // actual delimiter characters for CSV format
                , colDelim = '","'
                , rowDelim = '"\r\n"';
            // Grab text from table into CSV formatted string
            var csv = '"';
            csv += formatRows($headers.map(grabRow));
            csv += rowDelim;
            csv += formatRows($rows.map(grabRow)) + '"';
            // Data URI
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
            $(this)
                .attr({
                    'download': filename
                    , 'href': csvData
                    //,'target' : '_blank' //if you want it to open in a new window
                });
            //------------------------------------------------------------
            // Helper Functions
            //------------------------------------------------------------
            // Format the output so it has the appropriate delimiters
            function formatRows(rows) {
                return rows.get().join(tmpRowDelim)
                    .split(tmpRowDelim).join(rowDelim)
                    .split(tmpColDelim).join(colDelim);
            }

            // Grab and format a row from the table
            function grabRow(i, row) {

                var $row = $(row);
                //for some reason $cols = $row.find('td') || $row.find('th') won't work...
                var $cols = $row.find('td');
                if (!$cols.length) $cols = $row.find('th');
                return $cols.map(grabCol)
                    .get().join(tmpColDelim);
            }

            // Grab and format a column from the table
            function grabCol(j, col) {
                var $col = $(col),
                    $text = $col.text();
                return $text.replace('"', '""'); // escape double quotes
            }
        }



        //
        // $(document).on('submit','#smart-multi-actions-form',function(e){
        //     // e.preventDefault();
        //     // return false;
        //     console.log(e);
        // });
        //
        // $(document).on('submit','.yt-videos-list form',function(e){
        //     // e.preventDefault();
        //     // return false;
        //     console.log(e);
        // });
        //
        // $(document).on('click','.yt-videos-list .js-form-submit',function(e){
        //     // e.preventDefault();
        //     // $(this).parents('form').submit();
        //     // return false;
        //
        //     console.log(e);
        // });


        // This must be a hyperlink
        $(document).on('click', '#download-topic-report', function (event) {
            var outputFile = window.prompt("What do you want to name your output file (Note: This won't have any effect on Safari)") || 'export';
            outputFile = outputFile.replace('.csv', '') + '.csv';

            exportTableToCSV.apply(this, [$('#topic-result-report'), outputFile]);

        });

        $(document).on('click', '#download-channel-compare-report', function (e) {

            var outputFile = window.prompt("What do you want to name your output file (Note: This won't have any effect on Safari)") || 'export';
            outputFile = outputFile.replace('.csv', '') + '.csv';

            exportTableToCSV.apply(this, [$('#channel-compare-report'), outputFile]);
        });

        $(document).on('click', '.download-report', function (e) {
            // e.preventDefault();

            var targetTable = $(this).data('target-selector');
            var outputFile = window.prompt("What do you want to name your output file (Note: This won't have any effect on Safari)") || 'export';
            outputFile = outputFile.replace('.csv', '') + '.csv';
            console.log(targetTable);
            exportTableToCSV.apply(this, [$(targetTable+' .table'), outputFile]);
        });


        $(document).on('hidden.bs.modal', '.ajax-modal-content', function (e) {
            var relatedId = $(e.relatedTarget).data('target')+' .mdb-select';
            $(relatedId).material_select('destroy');
        });
       $(document).on('show.bs.modal', '.ajax-modal-content', function (e) {
            // var clicked = $(e.relatedTarget);
            // var tabTarget = clicked.data('target');
            // var tabTargetUrl = clicked.data('target-url');
            // var relatedId = tabTarget+' .mdb-select';
            //
            // tabTarget = tabTarget + ' .modal-body .flex-wrap';
            // var callback = {
            //     success: function (data, textStatus) {
            //         console.log(data);
            //         if (typeof data[3] !== 'undefined') {
            //             $(tabTarget).html(data[3].data);
            //         }
            //
            //         if (typeof data[0] !== 'undefined') {
            //             $(tabTarget).html(data[0].data);
            //         }
            //         clicked.addClass('loaded');
            //
            //     }
            // };
            //
            // //'ajax/ytassociatedtag/enable/tddd/0'
            // if(!clicked.hasClass('loaded')){
            //     $(relatedId).material_select();
            //     $(tabTarget).html('<span class="flex-center">Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
            //     Drupal.behaviors.iitAjaxHttpSenders.makeAjaxCall(Drupal.behaviors.sUrl + tabTargetUrl, callback);
            // }



            var $linkElement = $(e.relatedTarget);
            if(!$linkElement.hasClass('loaded')) {
                var tabTarget = $linkElement.data('target');
                tabTarget = tabTarget + ' .modal-body';
                // console.log(tabTarget);
                $(tabTarget).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
                var elementSettings = {
                    // progress: { type: 'throbber' },
                    // dialogType: $linkElement.data('dialog-type'),
                    // dialog: $linkElement.data('dialog-options'),
                    // dialogRenderer: $linkElement.data('dialog-renderer'),
                    // base: $linkElement.attr('id'),
                    // element: e.relatedTarget
                    url : Drupal.behaviors.sUrl + $linkElement.data('request-url'),
                    event : 'click'
                };
                Drupal.ajax(elementSettings).execute();
                // $linkElement.addClass('loaded');
            }




        });







        // $(document).on('click', '.ajax-modal-content .js-form-submit', function (e) {
        //     e.preventDefault();
        //     var id = $(this).parents('form').attr('id');
        //     console.log(id);
        //     // $(id).submit();
        //     // var r  = $(id).submit(function(es){
        //     //               var data =   $(this).serialize();
        //     //     console.log(data);
        //     // });
        //     // var datas = $(document).on('submit', id,function(es){
        //     //     var data =   es.serialize();
        //     //     console.log(data);
        //     //     return data;
        //     // });
        //
        //     // var nameValue =   $(id + 'input[name="qstr"]').val();
        //     //     console.log(nameValue);
        //
        //
        //    var datas =  $.fn.myTest(id);
        //     console.log(datas);
        //     // // return false;
        //     // var callback = {
        //     //     success: function (data, textStatus) {
        //     //         if (typeof data[3] !== 'undefined') {
        //     //             $(tabTarget).html(data[3].data);
        //     //         }
        //     //
        //     //         if (typeof data[0] !== 'undefined') {
        //     //             $(tabTarget).html(data[0].data);
        //     //         }
        //     //         clicked.addClass('loaded');
        //     //
        //     //     }
        //     // };
        //
        //     // Drupal.behaviors.iitAjaxHttpSenders.postAjaxCall(Drupal.behaviors.sUrl + tabTargetUrl, data, callback);
        // });



        window.onscroll = function(ev) {
            let footerHeight = document.getElementById('footer').offsetHeight;
            if ((window.innerHeight + window.scrollY + footerHeight*3 ) >= document.body.offsetHeight) {
                // alert("you're at the bottom of the page");
                $('#v-next-page-link a').click();
            }
        };



        $(document).ready(function (e) {





            if(!$('body').hasClass('path-user')){
                let userList = new List('view-locations', {
                    valueNames: ['views-field-field-location-country', 'views-field-field-location-language']
                });

            }
            var options = {
                valueNames: [ 'name', { attr: 'data-scount', name: 'scount' } ]
            };

            var user_tracking_ch1 = new List('view-content-user_channels-user_tracking_ch', options);

            var user_owned_ch1 = new List('view-content-user_channels-user_owned_ch', options);

            var user_tracking_ch2 = new List('view-content-user_tracking-user_owned_ch', options);
            var user_tracking_ch2 = new List('view-content-user_tracking-user_tracking_ch', options);
            var user_owned_ch2 = new List('view-content-user_tracking-user_topics', options);
            var user_owned_ch2 = new List('view-content-user_tracking-cust_products', options);
            var user_owned_ch2 = new List('view-content-user_tracking-cust_brands', options);

            // var user_topics = new List('view-content-user_channels-user_topics', options);
            // var cust_products = new List('view-content-user_channels-cust_products', options);
            // $('#sort-ch-search').material_select();

            if ($('.result-report-fieldset').length) {
                var searchReport = document.querySelector('#topic-report-content').outerHTML;
                $('#search-topic-report').html(searchReport);
                $('#smart-search-results-container').next().remove();
                $('[data-toggle="tooltip"]').tooltip();

            }
            $(document).on('click', '.topic-ts-delete', function(e){
                    e.preventDefault();
                    var elementSettings = {
                        progress: { type: 'throbber' },
                        element: e.relatedTarget,
                        url: $(this).attr('href'),
                        event: 'click'
                    };
                    Drupal.ajax(elementSettings).execute();

            });

            // $(document).on('mouseover', '.topic-ts-delete', function(e){
            //     console.log('yes');
            //     $(this).tooltip('show');
            // });

            // $.fn.tooltipEnabled = function() {
            //     $('[data-toggle="tooltip"]').tooltip('toggleEnabled');
            // };
            // var rText = $('#smart-search-result-summary').html();
            // $('#topic-result-report thead').prepend('<tr><th>'+rText+'</th></tr>');

            $('.form-select.form-control , .mdb-select').material_select();

            $(".button-collapse").sideNav();
            var sideNavScrollbar = document.querySelector('.custom-scrollbar');
            Ps.initialize(sideNavScrollbar);
            $('a.ajax-tab').on('shown.bs.tab', function (e) {


                let $linkElement = $(this);
                let tabTarget = $linkElement.attr('href');
                // var tabTarget = idTarget + ' .flex-wrap';
                let elementSettings = {
                    // progress: { type: 'throbber' },
                    // dialogType: $linkElement.data('dialog-type'),
                    // dialog: $linkElement.data('dialog-options'),
                    // dialogRenderer: $linkElement.data('dialog-renderer'),
                    // base: $linkElement.attr('id'),
                    // element: this,
                    url : Drupal.behaviors.sUrl + $linkElement.data('target-url')  ,
                    event : 'click'
                };

                if(!$linkElement.hasClass('loaded')) {
                    $linkElement.addClass('loaded');
                    let renderTarget = $linkElement.data('render-target') ? $linkElement.data('render-target') : tabTarget;
                    $(renderTarget).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
                    let aj = Drupal.ajax(elementSettings).execute();
                }

            });



            $('.ajax-load-div').each(function(i,chartValue){


                let $linkElement = $(this);
                let renderTarget = $linkElement.data('render-target');
                // let tabTarget = $linkElement.data('href');
                // var tabTarget = idTarget + ' .flex-wrap';
                let elementSettings = {
                    progress: { type: 'throbber' },
                    // dialogType: $linkElement.data('dialog-type'),
                    // dialog: $linkElement.data('dialog-options'),
                    // dialogRenderer: $linkElement.data('dialog-renderer'),
                    // base: $linkElement.attr('id'),
                    // element: this,
                    url : Drupal.behaviors.sUrl + $linkElement.data('target-url')  ,
                    // event : 'click'
                };

                if(!$linkElement.hasClass('loaded')) {
                    $linkElement.addClass('loaded');

                    $(renderTarget).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
                    let aj = Drupal.ajax(elementSettings).execute();
                }

            });

            // $(window).on('load',function(){
                $('.forced-model-open').modal({
                    show: true,
                    backdrop: false,
                    keyboard: false
                });
            // });


            // Drupal.behaviors.chartsHighcharts();

            // $('#modal-video-event-F9-R9uRzW_M').modal('show');
            $("#mdb-lightbox-ui").load("mdb-addons/mdb-lightbox-ui.html");

            //
            // $('a.ajax-tab').on('shown.bs.tab', function (e) {
            //
            // });

                // $('.carousel.carousel-multi-item.v-2 .carousel-item').each(function(){
                //     var next = $(this).next();
                //     if (!next.length) {
                //         next = $(this).siblings(':first');
                //     }
                //     next.children(':first-child').clone().appendTo($(this));
                //
                //     for (var i=0;i<6;i++) {
                //         next=next.next();
                //         if (!next.length) {
                //             next=$(this).siblings(':first');
                //         }
                //         next.children(':first-child').clone().appendTo($(this));
                //     }
                // });


            $(".masonry-grid img,.carousel img").on("error", function () {
                $(this).attr("src", Drupal.behaviors.brokenImgUrl).addClass('flex-center');
            });

            // $('.input-group-addon .fa-refresh').removeClass('fa-refresh').addClass('fa-search');
            $.fn.masonryInit('masonry-grid');
            $.fn.qPress('edit-qstr');
            let $srt = $.cookie("srt");
            $('#trend-sort-'+$srt).addClass('orange');


            // $(function () {
            //     $(".sticky").sticky({
            //         // topSpacing: 90,
            //         // zIndex: 2,
            //         stopper: "#YourStopperId"
            //     });
            // });

        });




        $.fn.myTest = function(id) {
            $(document).on('submit', id,function(es){
                var data =   es.serialize();
                return data;
            });
        };


        function throttle(f, delay){
            let timer = null;
            return function(){
                let context = this, args = arguments;
                clearTimeout(timer);
                timer = window.setTimeout(function(){
                        f.apply(context, args);
                    },
                    delay || 500);
            };
        }

        $(document).on('click','.trend-sort-ajax', function (event) {
            let $currentSort = $(this);
            let $srt = $currentSort.data('sort');
            let $element = $('#edit-qstr');
            // let $grid =  $('#trend-search-result');
            // $grid.removeClass('loaded');
            $('.trend-sort-ajax').removeClass('orange');

            $.cookie("srt", $srt, { expires : 10,path : '/' });
            let srt1 = $.cookie("srt");
            $element.keyup();
            $currentSort.addClass('orange');
            // let targetUrl = '/ajax/trendSearch/yt-videos/0?q='+$element.val()+'&selector=trend-search-result&match='+$srt;
            // let elementSettings = {
            //     progress: { type: 'throbber' },
            //     url : Drupal.behaviors.sUrl + targetUrl  ,
            //     // event : 'keydown'
            // };
            //
            // if(!$grid.hasClass('loaded')) {
            //
            //     let aj = Drupal.ajax(elementSettings).execute();
            //     $grid.addClass('loaded');
            //     $currentSort.addClass('orange');
            // }
            event.stopPropagation();
        });


        $.fn.qPress = function(id) {
            // $(document).on('keydown','#'+id,function(event){
            // $('#'+id).keydown(function(event){
            $('#'+id).keyup(throttle(function(event){
                let $grid =  $('#trend-search-result');
                $grid.removeClass('loaded');
                let $element = $(this);
                $grid.html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');

                setTimeout(function() {

                    let targetUrl = '/ajax/trendSearch/yt-videos/0?q='+$element.val()+'&selector=trend-search-result';
                    if($.cookie("srt")){
                        targetUrl += '&match='+$.cookie("srt");
                    }
                    let elementSettings = {
                        progress: { type: 'throbber' },
                        url : Drupal.behaviors.sUrl + targetUrl
                        // event : 'keydown'
                    };

                    if(!$grid.hasClass('loaded')) {




                        let aj = Drupal.ajax(elementSettings).execute();
                        setTimeout(function() {
                            $grid.addClass('loaded');
                        }, 1);
                    }
                }, 1);
                event.stopPropagation();


            }));
        };

        $.fn.scrollToDiv = function(id) {
            $('html,body').animate({
                scrollTop: $(id).offset().top
            });
        };

        $.fn.closeModal = function(id) {
            $(id).modal('hide');
        };

        $.fn.masonryInit = function(id) {
            // $(document).on('hidden.bs.modal', '.ajax-modal-content', function (e) {
            // console.log('masonryInit start 1st=> '+id);
            // $(document).on('load', function() {
                // setTimeout(function () {
                //     console.log('masonryInit start');
            // views-infinite-scroll-content-wrapper
                    let $grid = $('.masonry-grid .views-infinite-scroll-content-wrapper,.masonry-items').imagesLoaded(function () {

                        $grid.masonry({
                            itemSelector: '.views-row',
                            // columnWidth: 200
                        });
                        // console.log('masonry start');
                    }).always( function( instance ) {
                        // console.log('all images loaded');
                    }).done( function( instance ) {
                            // console.log('all images successfully loaded');
                    }).fail( function(instance, image) {
                        // console.log(instance);
                    }).progress( function( instance, image ) {
                            // var result = image.isLoaded ? 'loaded' : 'broken';
                            // console.log( 'image is ' + result + ' for ' + image.img.src );
                            // console.log(instance);

                        // $(".masonry-grid img").on("error", function () {
                        //     $(this).attr("src", Drupal.behaviors.brokenImgUrl).addClass('flex-center');
                        // });
                        // console.log(image);
                        if(!image.isLoaded){
                            image.img.src =  Drupal.behaviors.brokenImgUrl;
                        }

                    });


                    // console.log('masonryInit end');
                // }, 2000);
            // });
        };

        $.fn.tooltipEnabled = function(selector) {
            // $('[data-toggle="tooltip"]').tooltip('toggleEnabled');
            $(selector).tooltip();



            // var chPageSortoptions = {
            //     valueNames: [ 'name','vg-value',{ attr: 'data-vc-value', name: 'vc-value' },{ attr: 'data-pub-value', name: 'pub-value' } ]
            // };
            //
            // // var sortRelevance = new List('ch-videos-sort-relevance', chPageSortoptions);
            // var sortViewcount = new List('ch-videos-sort-viewCount', chPageSortoptions);
            // var sortDate = new List('ch-videos-sort-date', chPageSortoptions);

            // var sortmarkedCh = new List('view-content-channels_marked_videos-block_2', chPageSortoptions);
            // var sortmarkedCh1 = new List('view-content-channels_marked_videos-block_pos_flagged_videos', chPageSortoptions);
            // var sortmarkedCh2 = new List('view-content-channels_marked_videos-block_neg_flagged_videos', chPageSortoptions);
            // console.log('yess');
        };


        $.fn.refreshListDiv = function(id,listType = 'video') {
            let sortOptions = {};
            switch(listType){
                case 'video':
                     sortOptions = {
                        valueNames: [ 'name',{ attr: 'data-vg-value', name: 'vg-value' },{ attr: 'data-vc-value', name: 'vc-value' },{ attr: 'data-pub-value', name: 'pub-value' } ],
                        listClass: 'views-infinite-scroll-content-wrapper'
                    };
                     // console.log('yes');
                    break;
                case 'tag':
                     sortOptions = {
                        valueNames: [ { attr: 'data-name', name: 'name' },'count', ],
                        listClass: 't-body'
                    };
                    break;
            }


            let sortViewcount = new List(id, sortOptions);


        };

        $.fn.displayDiv = function(selector,action) {
            switch(action) {
                case 'add':
                    $(selector).addClass('d-none');
                    break;
                case 'remove':
                    $(selector).removeClass('d-none');
                    break;
            }

        };

        $.fn.teaserMark = function(flag) {
            $('.video-teaser .video-select-listing input[type="checkbox"]').each(function(index,data) {
                var clicked = false;

                   setTimeout(function () {
                       if(flag && !$(data).attr('checked')){
                           clicked = $(data).click();
                       }

                       if(!flag && $(data).attr('checked')){
                           clicked = $(data).click();
                       }
                       var divId = $(data).parents('.video-teaser').attr('id');
                       $.fn.scrollToDiv('.video-teaser-'+divId);
                   },index*900);

            });
        };




        $(function () {
            let pding = 0;
            if($('body').hasClass('toolbar-horizontal')){
                pding = 90
            }
            $(".sticky").sticky({
                topSpacing: pding
                , zIndex: 2
                , stopper: "#YourStopperId"
            });
        });


        function setCookie(cname, cvalue, exdays) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires="+d.toUTCString();
            document.cookie.trendSort = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        // function getCookie(cname) {
        //     let name = cname + "=";
        //     let ca = document.cookie.split(';');
        //     for(let i = 0; i < ca.length; i++) {
        //         let c = ca[i];
        //         while (c.charAt(0) == ' ') {
        //             c = c.substring(1);
        //         }
        //         if (c.indexOf(name) == 0) {
        //             return c.substring(name.length, c.length);
        //         }
        //     }
        //     return "";
        // }

        // function checkCookie() {
        //     let user = getCookie("username");
        //     if (user != "") {
        //         alert("Welcome again " + user);
        //     } else {
        //         user = prompt("Please enter your name:", "");
        //         if (user != "" && user != null) {
        //             setCookie("username", user, 365);
        //         }
        //     }
        // }


    });





})(jQuery, this, Drupal, drupalSettings);