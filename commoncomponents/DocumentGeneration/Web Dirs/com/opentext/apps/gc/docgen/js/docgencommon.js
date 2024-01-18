function getUrlParameterValue(iParameter, iURL, bDecode)
{
    var l_paramValue = "";
    if(iParameter)
    {
        var l_curLocation = (iURL && iURL.length)? iURL : window.location.search;
        if(l_curLocation && l_curLocation.length)
        {
            var l_parArray = l_curLocation.split("?")[1];
            if(l_parArray && l_parArray.length)
            {
                var l_parameters = l_parArray.split("&");
                for(var i = 0; i < l_parameters.length; i++)
                {
                    l_parameter = l_parameters[i].split("=");
                    if(l_parameter[0] && l_parameter[0].toLowerCase()== iParameter.toLowerCase())
                    {
                        return (bDecode? decodeURIComponent(l_parameter[1]) : l_parameter[1]);
                    }
                }
            }
        }
    }
    return l_paramValue;
}
function notifyValidation(message)
{
    var x = document.getElementById("toast");
    x.className = "show";
    x.style.visibility = "visible";
    setTimeout(function () { x.style.visibility = "hidden"; }, 3000);
}
function checkAll(ele) 
{
    if (ele.checked) 
    {
        $('.termCheckbox').prop('checked',true);
    } 
    else 
    {
        $('.termCheckbox').prop('checked',false);
    }
    $('.termCheckbox').change(function() {
        $('#selectAll')[0].checked = false;
    });
}

function addToastDiv (msg) {
    $('body').prepend("<div id=\"successToast\" style=\"font-size: 18px;color: #211e1eeb;\"></div> <div id=\"errorToast\" class=\"hide\"> <div id=\"toastHeading\"> <div id=\"headingContent\"> <h5 style=\"float: left;padding-left: 1em;\"><img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\"> Heading!</h5> </div> <span style=\"position:absolute;cursor:pointer;right:1em;top:1.3em\" id=\"arrowBtn\" class=\"down\" onclick=\"toggleErrorToastContent()\"></span> </div> <div id=\"toastContent\" style=\"display: none;clear:both;\"> <div class=\"horizontal-rule\"></div> <div id=\"contentText\" style=\"margin-top: 6px;padding-left: 6px\" align=\"left\"> Content!!</div></div></div>");
document.getElementById('successToast').innerHTML='<img src=\"../img/transyes.png\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">'+getTranslationMessage(msg)
}



function updateToastContent(headingContent,contentText) {
    if(contentText === undefined){
        $("#headingContent").html("<img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">    "+getTranslationMessage(headingContent));
        $("#headingContent").css({"padding": "0.5em", "font-size": "18px", "color": "#211e1eeb"});
        $("#arrowBtn").hide();
        $("#toastContent").hide();
    } else {
        $("#headingContent").html("<h4 style=\"float: left;padding-left: 1em;\"><img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">    " + headingContent + "</h4>");
        $("#headingContent").css({"padding": "0", "font-size": "18px", "color": "#211e1eeb"});
        document.getElementById("arrowBtn").className = "down";
        $("#arrowBtn").show();
        $("#contentText").text(updateToastContent(contentText));
     }
}       

function errorToastToggle(value) {
    var toastObj = document.getElementById("errorToast");
    if(value === undefined)
        if (toastObj.className == "hide") 
            toastObj.className = "show";
        else 
            toastObj.className = "hide";
    else
        toastObj.className = value;
}

function successToast(time) {

    var toastObj = document.getElementById("successToast");
    toastObj.className = "show";
    setTimeout(function () { toastObj.className = toastObj.className.replace("show", "hide"); }, time);
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
