function backgroundPreviewUpdate() {
    document.getElementById("preview-img").src = "backgrounds/" + document.forms.detail.querySelector("input[name=background]:checked").id + ".gif";
}

function onNext() {
    inputName = document.getElementById("name").value;
    inputAvatar = document.getElementById("avatar").value;
    inputBackground = document.forms.detail.querySelector("input[name=background]:checked").id;

    sessionStorage.setItem("name", inputName);
    sessionStorage.setItem("avatar", inputAvatar);
    sessionStorage.setItem("background", inputBackground);

    window.location.href = "form-socials.html";
}

function onBack() {
    sessionStorage.setItem("facebook", document.getElementById("facebook").value);
    sessionStorage.setItem("twitter", document.getElementById("twitter").value);
    sessionStorage.setItem("instagram", document.getElementById("instagram").value);
    sessionStorage.setItem("pinterest", document.getElementById("pinterest").value);
    sessionStorage.setItem("tiktok", document.getElementById("tiktok").value);
    sessionStorage.setItem("reddit", document.getElementById("reddit").value);
    sessionStorage.setItem("steam", document.getElementById("steam").value);
    sessionStorage.setItem("twitch", document.getElementById("twitch").value);
    sessionStorage.setItem("youtube", document.getElementById("youtube").value);
    sessionStorage.setItem("xbox", document.getElementById("xbox").value);
    sessionStorage.setItem("psn", document.getElementById("psn").value);
    sessionStorage.setItem("github", document.getElementById("github").value);

    window.location.href = "/";
}

function onDetailLoad() {
    storedName = sessionStorage.getItem("name");
    storedAvatar = sessionStorage.getItem("avatar");

    document.getElementById("name").value = storedName;
    document.getElementById("avatar").value = storedAvatar;
    document.getElementById(sessionStorage.getItem("background")).checked = true;

    if (storedName != undefined & storedName != "") {
        document.getElementById("label-name").classList.add("active");
    }

    if (storedAvatar != undefined & storedAvatar != "") {
        document.getElementById("label-avatar").classList.add("active");
    }

    backgroundPreviewUpdate();
}

function onSocialLoad() {
    storedFacebook = sessionStorage.getItem("facebook");
    storedTwitter = sessionStorage.getItem("twitter");
    storedInstagram = sessionStorage.getItem("instagram");
    storedPinterest = sessionStorage.getItem("pinterest");
    storedTiktok = sessionStorage.getItem("tiktok");
    storedReddit = sessionStorage.getItem("reddit");
    storedSteam = sessionStorage.getItem("steam");
    storedTwitch = sessionStorage.getItem("twitch");
    storedYoutube = sessionStorage.getItem("youtube");
    storedXbox = sessionStorage.getItem("xbox");
    storedPsn = sessionStorage.getItem("psn");
    storedGithub = sessionStorage.getItem("github");

    document.getElementById("facebook").value = storedFacebook;
    document.getElementById("twitter").value = storedTwitter;
    document.getElementById("instagram").value = storedInstagram;
    document.getElementById("pinterest").value = storedPinterest;
    document.getElementById("tiktok").value = storedTiktok;
    document.getElementById("reddit").value = storedReddit;
    document.getElementById("steam").value = storedSteam;
    document.getElementById("twitch").value = storedTwitch;
    document.getElementById("youtube").value = storedYoutube;
    document.getElementById("xbox").value = storedXbox;
    document.getElementById("psn").value = storedPsn;
    document.getElementById("github").value = storedGithub;

    if (storedFacebook != undefined & storedFacebook != "") {
        document.getElementById("label-facebook").classList.add("active");
    }

    if (storedTwitter != undefined & storedTwitter != "") {
        document.getElementById("label-twitter").classList.add("active");
    }

    if (storedInstagram != undefined & storedInstagram != "") {
        document.getElementById("label-instagram").classList.add("active");
    }

    if (storedPinterest != undefined & storedPinterest != "") {
        document.getElementById("label-pinterest").classList.add("active");
    }

    if (storedTiktok != undefined & storedTiktok != "") {
        document.getElementById("label-tiktok").classList.add("active");
    }

    if (storedReddit != undefined & storedReddit != "") {
        document.getElementById("label-reddit").classList.add("active");
    }

    if (storedSteam != undefined & storedSteam != "") {
        document.getElementById("label-steam").classList.add("active");
    }

    if (storedTwitch != undefined & storedTwitch != "") {
        document.getElementById("label-twitch").classList.add("active");
    }

    if (storedYoutube != undefined & storedYoutube != "") {
        document.getElementById("label-youtube").classList.add("active");
    }

    if (storedXbox != undefined & storedXbox != "") {
        document.getElementById("label-xbox").classList.add("active");
    }

    if (storedPsn != undefined & storedPsn != "") {
        document.getElementById("label-psn").classList.add("active");
    }

    if (storedGithub != undefined & storedGithub != "") {
        document.getElementById("label-github").classList.add("active");
    }
}

function generateUrl() {
    socials = [
        "facebook",
        "twitter",
        "instagram",
        "pinterest",
        "tiktok",
        "reddit",
        "steam",
        "twitch",
        "youtube",
        "xbox",
        "psn",
        "github"
    ];

    details = [
        "name",
        "avatar",
    ]

    backgrounds = [
        "bg-stars",
        "bg-tetris",
        "bg-squares",
        "bg-night-sky",
    ]

    generatedUrl = "https://modmonster.github.io/linker/linked/";

    addedCount = 0;

    socials.forEach(social => {
        value = document.getElementById(social).value;

        if (value != undefined & value != "") {
            generatedUrl += (addedCount == 0? "?" : "&") + social + "=" + value;
            addedCount += 1;
        }
    });

    details.forEach(detail => {
        value = sessionStorage.getItem(detail);

        if (value != undefined & value != "") {
            generatedUrl += (addedCount == 0? "?" : "&") + detail + "=" + value;
            addedCount += 1;
        }
    });

    backgroundSelection = sessionStorage.getItem("background");
    if (backgrounds.includes(backgroundSelection)) {
        background = backgrounds.indexOf(backgroundSelection) + 1;
        generatedUrl += (addedCount == 0? "?" : "&") + "background=" + background;
    }


    Swal.fire({
        title: "Successfully generated!",
        html: `<input type="text" value="${generatedUrl}" readonly></input>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Copy",
        cancelButtonText: "Done",
        preConfirm: () => {navigator.clipboard.writeText(generatedUrl);}
    });
}