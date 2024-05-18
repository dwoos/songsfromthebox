var SONG;

function displaySong(song) {
    console.log("displaying song");
    console.log(song);
    window.location.hash = song.slug;
    const formatter = new ChordSheetJS.HtmlDivFormatter();
    const disp = formatter.format(song);
    $("#song").html(disp);
    SONG = song;
    // get chords
    const chords = new Set();
    SONG.lines.forEach((line) => {
        line.items.forEach((item) => {
            if (
                item instanceof ChordSheetJS.ChordLyricsPair &&
                item.chords != ""
            ) {
                chords.add(ChordSheetJS.Chord.parse(item.chords).toString());
            }
        });
    });
    $("#title").text(song.title);
    // $("#artist").text(song.artist);
    document.title = `Songbox: ${song.title}`;
    $(".footer").html("");
    chords.forEach((chord) => {
        const el = $("<div/>");
        $(".footer").append(el);
        jtab.render(el, chord);
    });
}

// Select all text in a contenteditable non-input element
// For some reason just `.select()` doesn't work on non-inputs
// https://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
jQuery.fn.selectText = function () {
    var doc = document;
    var element = this[0];
    console.log(this, element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

$(() => {
    const parser = new ChordSheetJS.ChordProParser();
    const parsedSongs = songs.map((song) => {
        let parsed = parser.parse(song.song);
        parsed.slug = song.slug;
        return parsed
    });

    parsedSongs.sort((song1, song2) => song1.title.localeCompare(song2.title));

    function doSearch() {
        $("#title")
            .autocomplete("search", "")
            .selectText()
    }

    $("#title")
        .autocomplete({
            delay: 50,
            minLength: 0,
            autoFocus: true,
            source: [
                {
                    label: "Action: Shuffle",
                    value: "Shuffle",
                    action: function () {
                        const song = parsedSongs[Math.floor(Math.random() * parsedSongs.length)];
                        displaySong(song);
                    }
                },
                {
                    label: "Action: Transpose Up [+]",
                    action: transposeUp,
                },
                {
                    label: "Action: Transpose Down [-]",
                    action: transposeDown,
                },
                {
                    label: "Action: Add/Edit Song",
                    action: function () {
                        let url = "https://github.com/dwoos/songsfromthebox/tree/main";
                        url += SONG ? `/${SONG.slug}` : "/songs"
                        // window.open(url, '_blank').focus(); // new tab
                        window.location = url;
                    },
                }
            ].concat(
                parsedSongs.map(song => ({
                    label: song.artist ?
                        `Song: ${song.title} (${song.artist})` :
                        `Song: ${song.title}`,
                    value: song.title,
                    action: function () {
                        displaySong(song);
                    }
                }))
            ),
            select: function (event, ui) {
                event.preventDefault();
                this.blur();
                ui.item.action();
            }
        })
        .click(doSearch)
        .keydown(function (e) {
            console.log("keydown", e.keyCode);
            // enter key
            if (e.keyCode == 13) {
                e.preventDefault();
                this.blur();
            }
            // escape key
            if (e.keyCode == 27) {
                this.blur();
            }
        })
        .on("blur", function () {
            console.log("blur");
            if (SONG) {
                $(this).text(SONG.title)
            }
        });

    // slash key does search
    $(document).keydown(function (e) {
        if (e.keyCode == 191) {
            e.preventDefault();
            doSearch();
        }
    });

    function loadFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const song = parsedSongs.find(song => `#${song.slug}` == hash);
            if (song) {
                displaySong(song);
            }
        }
    }

    window.onpopstate = loadFromHash;
    loadFromHash();
});


function transposeUp() {
    let slug = SONG.slug;
    SONG = SONG.transposeUp(1);
    SONG.slug = slug;
    displaySong(SONG);
}
function transposeDown() {
    let slug = SONG.slug;
    SONG = SONG.transposeDown(1);
    SONG.slug = slug;
    displaySong(SONG);
}

$(document).on("keypress", (evt) => {
    switch (evt.keyCode) {
        case 45:
            transposeDown();
            break;
        case 61:
            transposeUp();
            break;
    }
});
