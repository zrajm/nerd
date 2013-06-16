/*jslint sloppy: true */
/*global document, $ */

$(function () {
    'use strict';
    var $panel    = $("#panel"),
        $charsets = $("input.charset", $panel),
        $labels   = $("label", $panel),
        $status   = $("#status"),
        $player   = $('#player');


    /* First hide all extras, then redisplay the needed ones. (This cumbersome
     * way of doing it means that a character will allways be displayed
     * correctly, even if it is in the character sets of several languages. */
    function redisplay() {
        // shownCharsets -- selectors for all cells which should be displayed
        // shownNames -- names of all charsets displayed
        var shownCharsets = [],
            shownNames    = {},
            shownCharsetsRe;

        // hide all non-displayed fields
        $charsets.each(function () {           // for each charset checkbox
            var selector = $("." + this.id);   //   get field class name
            selector.hide();                   //   hide all fields
            if (this.checked) {                //   remember shown field clases
                shownCharsets.push(selector);
                shownNames[this.id] = true;
            }
        });
        // show fields of selected charsets
        $.each(shownCharsets, function () {    // re-enable all visible fields
            this.show();
        });

        shownNames = Object.keys(shownNames);  // make uniqued list
        shownCharsetsRe = new RegExp(          // regex matching class
            "\\b(" + shownNames.join("|") + ")\\b"
        );

        $(".hideable").each(function () {      // for each cell that can
            var $this = $(this),               //   be empty sometimes
                classes = [];

            // get all class names of divs inside cell
            $this.find("div").each(function () {
                classes.push($(this).attr("class"));
            });
            classes = classes.join(" ");

            if (shownNames.length > 0 &&       // if cell contains shown divs
                    classes.match(shownCharsetsRe)) {
                $this.removeClass("empty");    //   remove cell class "empty"
            } else {                           // otherwise
                $this.addClass("empty");       //   add cell class "empty"
            }
        });
    }

    $panel.show();                          // display control panel
    $charsets.change(redisplay);               // checkmark hook: refresh all
    redisplay();                               // refresh hidden/shown chars

    $("#empty").change(function () {
        $(".empty").css(
            "visibility",
            this.checked ? "visible" : "hidden"
        );
    });

    $("button", $panel).click(function () { // "invert" button
        $charsets.each(function () {
            this.checked = !this.checked;
        });
        redisplay();
    });

    function statusUpdate(text, obj) {
        $(obj).mouseleave(function () {
            $status.hide();
        });
        $status.html(text).show();
    }

    $labels.mouseenter(function () {
        statusUpdate($("span", this).html(), this);
    });

    $("td").mouseenter(function () {
        var text = $("span", this).html();
        text = text.replace(/[ ]/, "   ");
        statusUpdate("Morse code: " + text, this);
    });

    // This only works for one sound for simplicity's sake
    function playSound(sound) {
        $player.empty();
        var video = $('<video src="' + sound + '" autoplay>')
            .on("ended", function() {
                $player.empty();
            });
        $player.append(video);
        video[0].play();
    }
    $("td[id]").click(function () {
        playSound("data/" + this.id + ".mp3");
    });
});

/*[eof]*/
