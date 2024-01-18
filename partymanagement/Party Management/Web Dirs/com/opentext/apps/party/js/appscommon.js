function getUrlParameterValue(iParameter, iURL, bDecode) {
  var l_paramValue = "";
  if (iParameter) {
    var l_curLocation = (iURL && iURL.length) ? iURL : window.location.search;
    if (l_curLocation && l_curLocation.length) {
      var l_parArray = l_curLocation.split("?")[1];
      if (l_parArray && l_parArray.length) {
        var l_parameters = l_parArray.split("&");
        for (var i = 0; i < l_parameters.length; i++) {
          l_parameter = l_parameters[i].split("=");
          if (l_parameter[0] && l_parameter[0].toLowerCase() == iParameter.toLowerCase()) {
            return (bDecode ? decodeURIComponent(l_parameter[1]) : l_parameter[1]);
          }
        }
      }
    }
  }
  return l_paramValue;
}
function showOrHideErrorInfo(i_elementId, i_Show, i_errorMessage, i_VisibleTime) {
  var l_infoArea = document.getElementById(i_elementId);
  if (l_infoArea) {
    if (i_Show) {
      l_infoArea.style.display = "inline";
      l_infoArea.lastElementChild.innerText = i_errorMessage;
      if (i_VisibleTime) {
        setTimeout(showOrHideErrorInfo.bind(null, i_elementId), i_VisibleTime);
      }
    }
    else {
      l_infoArea.style.display = "none";
      l_infoArea.lastElementChild.innerText = "";
    }
  }
}
function notifyValidation(message) {
  var x = document.getElementById("toast");
  x.className = "show";
  x.style.visibility = "visible";
  setTimeout(function () { x.style.visibility = "hidden"; }, 3000);
}
function checkAll(ele) {
  if (ele.checked) {
    $('.termCheckbox').prop('checked', true);
  }
  else {
    $('.termCheckbox').prop('checked', false);
  }
  $('.termCheckbox').change(function () {
    $('#selectAll')[0].checked = false;
  });
}

function addToastDiv(msg) {
  document.getElementById('successToast').innerHTML = '<img src=\"../img/transyes.png\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">' + getTranslationMessage(msg)
}

function createToastDiv() {
  $('body').prepend("<div id=\"successToast\" style=\"font-size: 18px;color: #211e1eeb;\"></div> <div id=\"errorToast\"> <div id=\"toastHeading\"> <div id=\"headingContent\"> <h5 style=\"float: left;padding-left: 1em;\"><img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\"> Heading!</h5> </div> <span style=\"position:absolute;cursor:pointer;right:1em;top:1.3em\" id=\"arrowBtn\" class=\"down\" onclick=\"toggleErrorToastContent()\"></span> </div> <div id=\"toastContent\" style=\"display: none;clear:both;\"> <div class=\"horizontal-rule\"></div> <div id=\"contentText\" style=\"margin-top: 6px;padding-left: 6px\" align=\"left\">" + getTranslationMessage("Content!!") + "</div></div></div>");
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
    $("#contentText").text(getTranslationMessage(contentText));
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

function successToast(time) {

  var toastObj = document.getElementById("successToast");
  toastObj.className = "show";
  setTimeout(function () { toastObj.className = toastObj.className.replace("show", "hide"); }, time);
}


function successToast(time, msg) {
  if (msg) {
    var toastObj = document.getElementById("successToast");
    toastObj.innerHTML = '<img src=\"../../../../../com/opentext/apps/utils/img/notification_success.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">' + getTranslationMessage(msg)
    //  toastObj.className = "show";
    toastObj.style.visibility = "visible"
    setTimeout(function () { toastObj.style.visibility = "hidden" }, time);
  }
  else {
    var toastObj = document.getElementById("successToast");
    toastObj.className = "show";
    setTimeout(function () { toastObj.className = toastObj.className.replace("show", "hide"); }, time);
  }
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
function notifyError(msg, time) {
  updateToastContent(msg);
  var toastObj = document.getElementById("errorToast");
  toastObj.style.visibility = "visible"
  setTimeout(function () { toastObj.style.visibility = "hidden" }, time);
  //errorToastToggle("show");
  //setTimeout(errorToastToggle.bind("hide"), time);
}

function isIE() {
  var isIE = false;
  var ua = window.navigator.userAgent;
  var old_ie = ua.indexOf('MSIE ');
  var new_ie = ua.indexOf('Trident/');

  if ((old_ie > -1) || (new_ie > -1)) {
    isIE = true;
  }
  return isIE;
}

//PageName - htm file name, idocument - (window.frameElement.ownerDocument)
function getFrameBySource(pageName, iDocument) {
  var ownerDocumentFrames = iDocument.getElementsByTagName('iFrame');
  for (var framesValue = 0; framesValue < ownerDocumentFrames.length; framesValue++) {
    var frameSourceLength = (ownerDocumentFrames[framesValue].src).split('?')[0].length;
    //To get the length of path before the URL paremeter(i.e.., '?')
    var sumFrameIndexAndFrameName = (((ownerDocumentFrames[framesValue].src).indexOf(pageName)) + (pageName.length))
    if ((ownerDocumentFrames[framesValue].src).indexOf(pageName) > -1 && (frameSourceLength == sumFrameIndexAndFrameName)) {
      return ownerDocumentFrames[framesValue];
    }
  }
}


function getButtonByInnerText(className, buttonInnerText, iDocument) {
  var buttonClasses = iDocument.getElementsByClassName(className);
  for (var buttonVal = 0; buttonVal < buttonClasses.length; buttonVal++) {
    if (buttonClasses[buttonVal].innerText == buttonInnerText) {
      return buttonClasses[buttonVal];
    }
  }
}

function setUrlParameter(url, key, value) {
  var key = encodeURIComponent(key);
  var value = encodeURIComponent(value);
  var baseURL = url.split('?')[0];
  var newParameter = key + '=' + value;
  var allParams = '?' + newParameter;

  // if there are no query strings, make urlQueryString empty
  if (url.split('?')[1] === undefined) {
    urlQueryString = '';
  } else {
    urlQueryString = '?' + url.split('?')[1];
  }

  // If the "search" string exists, then build parameters from it.
  if (urlQueryString) {
    var updateRegex = new RegExp('([\?&])' + key + '=[^&]*');
    var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

    if (value === undefined || value === null || value === '') {
      // Remove parameter if value is empty
      allParams = urlQueryString.replace(removeRegex, "$1");
      allParams = allParams.replace(/[&;]$/, "");
    } else if (urlQueryString.match(updateRegex) !== null) {
      // If parameter exists already, update it
      allParams = urlQueryString.replace(updateRegex, "$1" + newParameter);

    } else if (urlQueryString == '') {
      // If there are no query strings
      allParams = '?' + newParameter;
    } else {
      // Otherwise, add it to end of query string
      allParams = urlQueryString + '&' + newParameter;
    }
  }
  // no parameter was set so we don't need the question mark
  allParams = allParams === '?' ? '' : allParams;

  return baseURL + allParams;
}
function getIDfromItemID(iItemID) {
  var l_ItemID = iItemID.split(".");
  return l_ItemID[l_ItemID.length - 1];
}
function getTextValue(obj) {
  if (obj) {
    if (obj.text) {
      return obj.text;
    } else {
      return obj;
    }
  }
  else {
    return "";
  }
}
function getDateValue(obj) {
  if (obj) {
	return moment(obj.replace('Z', '')).format('MM/DD/YYYY')
  }
  else {
    return "";
  }
}