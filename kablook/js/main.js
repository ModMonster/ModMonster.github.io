const titles = [
    "Originally called Blahoot!",
    "Better than Blooket!",
    "Worse than Kahoot!",
    "PLEASE NO GOLD RUSH!!!",
    "Hi Mr. Pooter!",
    "Check out https://smarie.cf!",
    "Pas traduit en français!",
    "Gold rush is bad!",
    "https://youtube.com/modmonster"
];

function randomTitle() {
    document.title = "Kablook! - " + titles[Math.floor(Math.random()*titles.length)];
}

function help() {
    Swal.fire({
        title: "How to play",
        icon: "question",
        html: `<ul>
        <li>Answer the questions that come up on your screen.</li><br>
        <li>If you answer correctly, you will be able to open a chest.</li><br>
        <li>Chests will contain power-ups and other items to get you more points, and steal from the player in 1st place.</li><br>
        <li>If you're in first place, you will get chests with items to help you defend your points.</li><br>
        <li>The winner is whoever is in first place once all of the questions have been answered.</li><br>
        </ul>`,
    });
}

randomTitle();