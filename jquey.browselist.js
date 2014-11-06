/**
* jQuery BrowseList plugin v1.0 beta
* Transforms a nested list into a horizontally browsable list.
*
* Copyright 2014, Bruno De Bondt
* Licensed under the MIT license.
* http://jquery.org/license
*/
(function($) {

  'use strict';

  $.fn.browseList = function(options) {
    // Plugin options.
    var settings = $.extend({
        browseListTitle: 'Browse'
      }, options);

    return this.each(function() {

      var elem = $(this),
          containerId = elem.attr('id'),
          activeIdName = containerId + '-active',
          activeId = '#' + activeIdName,
          breadCrumbContainer = $('<nav id="' + containerId + '-breadcrumbs" class="lr-section__title bl-breadcrumbs" data-breadcrumb-type="' + containerId + '">' + settings.browseListTitle + '</nav>'),
          topLevelList = elem.children('ul');

      function getListLevel(listItemSpan) {
        return listItemSpan.data(containerId + '-bl-level');
      }

      function activateList(list) {
        list.parents(activeId).removeAttr('id');
        topLevelList.find('.slideInLeft').removeClass('animated slideInLeft');
        list.addClass('animated slideInRight')
          .attr('id', activeIdName).show();
      }

      function deActivateList(listItemSpan) {
        $('[data-' + containerId + '-bl-level=' + getListLevel(listItemSpan) + ']').hide();
      }

      function navigateBreadCrumb(breadCrumbLink) {
        var breadCrumbLinks = breadCrumbContainer.children('a'),
            parentListLevel = breadCrumbLink.data('breadcrumb-level'),
            matchingListItems = $('[data-' + containerId + '-bl-level=' + parentListLevel + ']'),
            maxListLevel = breadCrumbLinks.last().data('breadcrumb-level'),
            breadCrumbLinkIndex = breadCrumbLinks.index(breadCrumbLink),
            breadCrumbCount = 0;

        // Walk up the breadcrumb tree, activate the parent list items, and deactivate the currently active list.
        for (var i = maxListLevel; i >= parentListLevel; i--) {
          $('[data-' + containerId + '-bl-level="' + i + '"]')
          .siblings('ul').hide()
          .removeClass('animated slideInRight');
          $('[data-' + containerId + '-bl-level="' + i + '"]')
          .addClass('animated slideInLeft').show();
        }

        // Make sure there is only one list with activeId.
        matchingListItems
        .parents('ul:eq(0)')
        .attr('id', activeIdName)
        .show()
        .find(activeId).removeAttr('id');

        // Re-populate breadcrumbs. Keep track of breadcrumb count,
        // so we can remove unneeded crumbs, and put back the default title when needed.
        breadCrumbContainer.empty();
        breadCrumbLinks.each(function(index, value) {
          if (index <= breadCrumbLinkIndex) {
            breadCrumbContainer.append($(this));
            breadCrumbCount++;
          }
        });

        if (breadCrumbCount === 1) {
          breadCrumbContainer.empty();
          breadCrumbContainer.append(settings.browseListTitle);
        }
      }

      function populateBreadcrumbs(listItemSpan) {
        var breadCrumbLevel = listItemSpan.siblings('.bl-ul').find('.bl-li-title').data(containerId + '-bl-level'),
            breadCrumbText = listItemSpan.data('breadcrumb-label'),
            breadCrumbTextClean = breadCrumbText.replace(/ *\([^)]*\) */g, ""), // Remove text between brackets (e.g. list item count).
            breadCrumbRoot = '<a class="bl-breadcrumbs-link bl-breadcrumbs-label" data-breadcrumb-level="0">' + settings.browseListTitle + '</a>',
            breadCrumbLink = '<a class="bl-breadcrumbs-link" data-breadcrumb-level="' + breadCrumbLevel + '">' + breadCrumbTextClean + '</a>';

        if (breadCrumbContainer.text() === settings.browseListTitle) {
          breadCrumbContainer.empty();
          breadCrumbContainer.prepend(breadCrumbRoot);
        }
        if (breadCrumbContainer.data('breadcrumb-type') === containerId) {
          breadCrumbContainer.append(breadCrumbLink);
        }
      }

      // Add title/breadcrumb container.
      elem.prepend(breadCrumbContainer);

      // Assign id to top level list.
      activateList(topLevelList);

      // Add classes, inner wrapper and icon to list items.
      elem.find('li').each(function(index, value) {
        $(this).addClass('bl-li');
        var listItemText = $(this).contents().eq(0);
        listItemText.wrap('<span class="bl-li-title" data-breadcrumb-label="' + listItemText.text() + '"></span>');
        if ($(this).contents().eq(1).is('ul')) {
          $(this).children('.bl-li-title')
          .addClass('has-children')
          .prepend('<i class="icon icon-bullet-right"></i>');
        }
        else {
          $(this).children('.bl-li-title')
            .addClass('no-children');
        }
      });

      // Outermost list gets a special class.
      topLevelList.addClass('bl-root');

      // Add class and level data attribute to lists.
      elem.find('ul').each(function(index, value) {
        $(this).addClass('bl-ul').hide();
        $(this).find('.bl-li-title').attr('data-' + containerId + '-bl-level', index);
      });

      // Initial state: show top level list.
      topLevelList.show();

      // Traverse list.
      elem.on('click', '.has-children', function() {
        populateBreadcrumbs($(this));
        deActivateList($(this));
        activateList($(this).siblings('ul'));
      });

      // Navigate breadcrumbs.
      elem.on('click', '.bl-breadcrumbs-link', function() {
        var breadCrumbLinks = breadCrumbContainer.children('a');
        var breadCrumbLinkIndex = breadCrumbLinks.index($(this));
        if (breadCrumbLinkIndex === breadCrumbLinks.length - 1) {
          return;
        }
        else {
          navigateBreadCrumb($(this));
        }
      });
    });
  };

}(jQuery));