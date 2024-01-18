function notifyValidation(message) {
    var x = document.getElementById("toast");
    x.className = "show";
    x.style.visibility = "visible";
    setTimeout(function () { x.style.visibility = "hidden"; }, 3000);
}

function successToast(time, message) {
    var toastObj = document.getElementById("successToast");
    toastObj.innerHTML = '<img src=\"../img/transyes.png\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">' + getTranslationMessage(message);
    toastObj.className = "show";
    setTimeout(function () { toastObj.className = toastObj.className.replace("show", "hide"); }, time);
}

function errorToast(time, message) {
    var toastObj = document.getElementById("errorToast");
    document.getElementById("header-content").innerHTML = '<img src="../img/notification_error.svg"' +
        'width="25px" height="25px" align="middle" style="margin-right:5px;">' + getTranslationMessage(message);
    $("#header-content").css({"font-size": "18px", "color": "#211e1eeb" });
    toastObj.className = "show";
    setTimeout(function () { toastObj.className = toastObj.className.replace("show", "hide"); }, time);
}



function updateToastContent(headingContent, contentText) {
    if (contentText === undefined) {
        $("#headingContent").html("<img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">    " + getTranslationMessage(headingContent));
        $("#headingContent").css({ "padding": "0.5em", "font-size": "18px", "color": "#211e1eeb" });
        $("#arrowBtn").hide();
        $("#toastContent").hide();
    } else {
        $("#headingContent").html("<h4 style=\"float: left;padding-left: 1em;\"><img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">    " + getTranslationMessage(headingContent) + "</h4>");
        $("#headingContent").css({ "padding": "0", "font-size": "18px", "color": "#211e1eeb" });
        document.getElementById("arrowBtn").className = "down";
        $("#arrowBtn").show();
        $("#contentText").text(contentText);
    }
}

function errorToastToggle(value) {
    var toastObj = document.getElementById("errorToast");
    if (value === undefined)
        if (toastObj.className == "hide")
            toastObj.className = "show";
        else
            toastObj.className = "hide";
    else
        toastObj.className = value;
}


function toggleErrorToastContent() {
    var toastContentObj = document.getElementById("toastContent");
    var arrowBtnObj = document.getElementById("arrowBtn");
    if (toastContentObj.style.display === "none") {
        toastContentObj.style.display = "block";
        arrowBtnObj.className = "up";
    } else {
        toastContentObj.style.display = "none";
        arrowBtnObj.className = "down";
    }
}
