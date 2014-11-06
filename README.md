jQuery Browselist
=================

jQuery plugin that transforms a nested list into a horizontally browsable list. The plugin's CSS adds minimal styling (which you can override as you wish), and uses <a href="http://daneden.github.io/animate.css/">Animate.css</a> to handle CSS animations.

You can see a <a href="http://brunodbo.github.com/jquery.browselist/demo.html">demo here</a>, and an implementation of the plugin (albeit a slight variation) <a href="http://learningregistry.org/">right here</a> (at the bottom of that page).

Usage
-----

Add jQuery, the plugin, and the plugin's CSS:

```
<link rel="stylesheet" href="browselist.css" />
<script src="jquery.min.js"></script>
<script src="jquery.browselist.js"></script>
```

You'll need a nested list, wrapped in a container (see the demo's source for a more elaborate example):

```
<div id="browse-list">
  <ul>
    <li>List item 1
      <ul>
        <li>List item 1.1
          <ul>
            <li>List item 1.1.1</li>
            <li>List item 1.1.2</li>
            <li>List item 1.1.3</li>
            <li>List item 1.1.4</li>
            <li>List item 1.1.5</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>List item 2</li>
    <li>List item 3</li>
    <li>List item 4</li>
  </ul>
</div>
```

And then use the plugin like so:

```
$('#browse-list').browseList();
```

Thanks to
---------

- <a href="https://jquery.org">The jQuery team</a>
- Daniel Eden, author of <a href="http://daneden.github.io/animate.css/">Animate.css</a>.
