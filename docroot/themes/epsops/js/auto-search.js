/**
 * Behaviors to handle common JS for the theme.
 */
(function ($) {
  Drupal.behaviors.searchautodata = {
    attach: function (context, settings) {
        $('.block-vralfetch-search-block .input-group-addon .fa-refresh').removeClass('fa-refresh').addClass('fa-search');
        $(".block-vralfetch-search-block .input-group-addon .fa-search").on('click', function () {
            $(".block-vralfetch-search-block #custom-form").submit();
        });

        $(".block-vralfetch-search-block .ui-menu-item").mouseover(function() {
            $("#edit-serch-auto-txt").html(this.value);
            });
        $("#edit-keys").on('keyup', function () {
        if (this.value) {
          $("#search-autodata").show();
          var keyValue = this.value;
          jQuery.post("viral-search-autodata", {keyValue: keyValue}, function (res) {
            $("#search-autodata").html('');
            if (res != '') {
              var mainUl = $('<ul/>');
              mainUl.addClass('ui-menu ui-widget ui-widget-content ui-autocomplete ui-front');
              if (res.Channels != '') {
                displayAutoData(res.Channels, 'Channels', mainUl);
              }
              if (res.Videos != '') {
                displayAutoData(res.Videos, 'Videos', mainUl);
              }
              if (res.Topics != '') {
                displayAutoData(res.Topics, 'Topics', mainUl);
              }
              if (res.Themes != '') {
                displayAutoData(res.Themes, 'Themes', mainUl);
              }
              if (res.Tags != '') {
                displayAutoData(res.Tags, 'Tags', mainUl);
              }
              if (res.Locations != '') {
                displayAutoData(res.Tags, 'Locations', mainUl);
              }
              $("#search-autodata").append(mainUl);
            }
          }, 'json');
        }
        else {
          $("#search-autodata").hide();
        }

      });

      function displayAutoData(res, $type, mainUl) {
        if (res != '' && res != undefined && res.length > 0) {
          var contentUrl = "";
          var subUl = $('<ul/>');
          var mainLi = $('<li/>');
          var spanCont = $('<span>');
          spanCont.addClass('ui-menu-item-heading');
          spanCont.html($type);
          mainLi.append(spanCont);
          $.each(res, function (key, val) {
            var subLi = $('<li/>');
            subLi.addClass('ui-menu-item- ui-menu-item');
            var aTag = $('<a/>');
            aTag.attr('href', val.path);
            if ($type == 'Videos') {
              var iconImg = $('<img/>');
              iconImg.addClass('ui-menu-item-icon pull-right ptop5');
              imageUrl = 'https://img.youtube.com/vi/' + val.iconDet + '/default.jpg';
              iconImg.attr('src', imageUrl);
            }
            else {
              var iconImg = $('<div/>');
              iconImg.addClass('pull-right pright2 ptop15');
              iconImg.addClass(val.iconDet);
            }
            aTag.append(iconImg);
            aTag.append(val.name);
            subLi.append(aTag);
            subUl.append(subLi);
          });
          var subDiv = $('<div/>');
          subDiv.addClass('ui-menu-sub-items');
          subDiv.append(subUl);
          mainLi.append(subDiv);
          mainUl.append(mainLi);
        }
      }

    }

  };

})(jQuery);
