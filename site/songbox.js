const toggleMenu = () => $(".sidenav-contents").toggle();
const button = $(".sidenav-button a");
button.click(toggleMenu);

$(() => {
    $(".sidenav-contents").hide();
});

const parser = new ChordSheetJS.ChordProParser();
const parsedSongs = songs.map((song) => {
    return { slug: song.slug, song: parser.parse(song.song) };
});

var displayedSong;

const displaySong = (song) => {
    const formatter = new ChordSheetJS.HtmlDivFormatter();
    const disp = formatter.format(song);
    $("#song").html(disp);
    displayedSong = song;
};

parsedSongs.forEach((song) => {
    const item = $(`<a href="#${song.slug}">${song.song.title}</a>`);
    item.click(() => {
        displaySong(song.song);
        toggleMenu();
    });
    $(".sidenav-contents").append(item);
});

displaySong(parsedSongs[0].song);

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
