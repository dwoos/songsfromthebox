const toggleMenu = () => {
    const menuContents = $(".sidenav-contents");
    if (menuContents.is(":visible")) {
        menuContents.hide();
    } else {
        menuContents.show();
        $(".song-search").val("");
        $(".song-search").trigger("focus");
        $(".song-search").triggerHandler("input");
    }
};
const button = $(".sidenav-button a");
button.on("click", (evt) => {
    toggleMenu();
    evt.preventDefault();
});

$(() => {
    $(".sidenav-contents").hide();
});

var displayedSong;

const displaySong = (song) => {
    console.log("displaying song");
    console.log(song);
    const formatter = new ChordSheetJS.HtmlDivFormatter();
    const disp = formatter.format(song);
    $("#song").html(disp);
    displayedSong = song;
    // get chords
    const chords = new Set();
    displayedSong.lines.forEach((line) => {
        line.items.forEach((item) => {
            if (
                item instanceof ChordSheetJS.ChordLyricsPair &&
                item.chords != ""
            ) {
                chords.add(ChordSheetJS.Chord.parse(item.chords).toString());
            }
        });
    });
    $(".footer").html("");
    chords.forEach((chord) => {
        const el = $("<div/>");
        $(".footer").append(el);
        jtab.render(el, chord);
    });
};

$(() => {
    const parser = new ChordSheetJS.ChordProParser();
    const parsedSongs = songs.map((song) => {
        return { slug: song.slug, song: parser.parse(song.song) };
    });

    parsedSongs.sort((song1, song2) => {
        if (song1.song.title < song2.song.title) {
            return -1;
        } else {
            return 1;
        }
    });

    parsedSongs.forEach((song) => {
        const item = $(`<a href="#${song.slug}">${song.song.title}</a>`);
        item.on("click", () => {
            console.log("hello");
            displaySong(song.song);
            toggleMenu();
        });
        $(".sidenav-songs").append(item);
    });
    console.log("hello");
    displaySong(parsedSongs[0].song);
    console.log(window.location.hash);
    if (window.location.hash) {
        const slug = window.location.hash.substring(1);
        console.log(slug);
        parsedSongs.forEach((song) => {
            if (song.slug === slug) {
                displaySong(song.song);
            }
        });
    }
});
const transposeUp = () => {
    const song = displayedSong.transposeUp(1);
    displaySong(song);
};
const transposeDown = () => {
    const song = displayedSong.transposeDown(1);
    displaySong(song);
};

$("body").on("keypress", (evt) => {
    switch (evt.keyCode) {
        case 45:
            transposeDown();
            break;
        case 61:
            transposeUp();
            break;
    }
});

$(".song-search").on("input", () => {
    const search = $(".song-search").val();
    $(".sidenav-songs a").each((_, el) => {
        el = $(el);
        if (
            search === "" ||
            el.text().toLowerCase().includes(search.toLowerCase())
        ) {
            el.show();
        } else {
            el.hide();
        }
    });
});

$(".sidenav-controls .shuffle").on("click", (evt) => {
    evt.preventDefault();
    const songs = $(".sidenav-songs a");
    const i = Math.floor(Math.random() * songs.length);
    songs[i].click();
});

/*$(".song-search").on("keypress", (evt) => {
    if (evt.keyCode === 13) {
        $(".sidenav-songs a:visible").first().trigger("click");
    }
});*/
