const SUCCESS = "SUCCESS";
const FAIL = "FAIL";

var EntityTypes = {
  Contract: {
    Definition_ID: "005056C00008A1E795653A59509D399D",
    Layout_ID: "F8B156D635F3A1E89CB08DDB9883E4C8"
  },
  Template: {
    Definition_ID: "C4D98747A6D9A1E8AC34736789FC486E",
    Layout_ID: "C4D98747A6D9A1E8AC6C233A4C55886E"
  },
  Clause: {
    Definition_ID: "F8B156BC2CB7A1E8AC30A6D1F215F031",
    Layout_ID: "F8B156BC2CB7A1E8B02C7BB5968E3033"
  },
  ContractRequest: {
    Definition_ID: "F8B156D6337AA1E8ABCED16B6A87C882",
    Layout_ID: "484D7EE5DBB0A1E8B8FACC073CDE2503"
  },
  Term: {
    Definition_ID: "484D7EE5DBB0A1E8ABD64A004465A4F0",
    Layout_ID: "484D7EE5DBB0A1E8AC0B6848E5BF64F0"
  },
  DocumentLayout: {
    Definition_ID: "F8B156D635F3A1E8AC985C65C76464D0",
    Layout_ID: "484D7EEB737FA1E8AD9E562F159E486A"
  },
  ObligationLibrary: {
    Definition_ID: "E86A64E0AE43A1ECAA727426C0D4E165",
    Layout_ID: "E86A64E0AE43A1ECAA73367DDD99E165"
  },
  ContractNegotiation: {
    Definition_ID: "8C1645B90967A1E9B0F556DA7CBDE658",
    Layout_ID: "F0D5BF3D2BAAA1E9B283E7CD2E85C339"
  },
  TemplateContent: {
    Definition_ID: "484D7EEB7112A1E98D011E255FBEE518",
    Layout_ID: "484D7EEB7112A1E9906567E508B22519"
  },
  ContractContent: {
    Definition_ID: "B4B676CD53D8A1E7A1F7CCB8062AE4BF",
    Layout_ID: "C4D98747AA4EA1E7B4099DD048208067"
  },
  ActivityInstances: {
    Definition_ID: "F8B156BC2CB7A1EAA85CE78BF7F8F077",
    Layout_ID: ""
  },
  ContractTask: {
    Definition_ID: "1866DA2DA8DFA1E7AB3E2094D4A5E4C0",
    Layout_ID: "1866DA2DA8DFA1E7AB5ADB8EB668A4C0"
  },
  ContractRequestTask: {
    Definition_ID: "F8B156D6337AA1E8AC3B9A7AF0130882",
    Layout_ID: "F8B156D6337AA1E8AEF42D11A3DA8883"
  },
  CustomTask: {
    Definition_ID: "F8B156BC2CB7A1EAA860CBD2EA097077",
    Layout_ID: "F8B156BC2CB7A1EAA8618E2DF11AB077"
  },
  TemplateTask: {
    Definition_ID: "C4D98747A6D9A1E8AC6B83420E6C486E",
    Layout_ID: "B4B676CD53D8A1E8B9024E7DF7F6C87B"
  },
  ClauseTask: {
    Definition_ID: "F8B156BC2CB7A1E8AC415BFFEAAD7031",
    Layout_ID: "484D7EE46263A1E8B2E444891551C896"
  }
};

const itemIDLayoutIDMapping = {
  "005056C00008A1E795653A59509D399D": "F8B156D635F3A1E89CB08DDB9883E4C8",
  "C4D98747A6D9A1E8AC34736789FC486E": "C4D98747A6D9A1E8AC6C233A4C55886E",
  "F8B156BC2CB7A1E8AC30A6D1F215F031": "F8B156BC2CB7A1E8B02C7BB5968E3033",
  "F8B156D6337AA1E8ABCED16B6A87C882": "484D7EE5DBB0A1E8B8FACC073CDE2503",
  "484D7EE5DBB0A1E8ABD64A004465A4F0": "484D7EE5DBB0A1E8AC0B6848E5BF64F0",
  "F8B156D635F3A1E8AC985C65C76464D0": "484D7EEB737FA1E8AD9E562F159E486A",
  "E86A64E0AE43A1ECAA727426C0D4E165": "E86A64E0AE43A1ECAA73367DDD99E165",
  "8C1645B90967A1E9B0F556DA7CBDE658": "F0D5BF3D2BAAA1E9B283E7CD2E85C339",
  "484D7EEB7112A1E98D011E255FBEE518": "484D7EEB7112A1E9906567E508B22519",
  "B4B676CD53D8A1E7A1F7CCB8062AE4BF": "C4D98747AA4EA1E7B4099DD048208067",
  "F8B156BC2CB7A1EAA85CE78BF7F8F077": "",
  "1866DA2DA8DFA1E7AB3E2094D4A5E4C0": "1866DA2DA8DFA1E7AB5ADB8EB668A4C0",
  "F8B156D6337AA1E8AC3B9A7AF0130882": "F8B156D6337AA1E8AEF42D11A3DA8883",
  "F8B156BC2CB7A1EAA860CBD2EA097077": "F8B156BC2CB7A1EAA8618E2DF11AB077",
  "C4D98747A6D9A1E8AC6B83420E6C486E": "B4B676CD53D8A1E8B9024E7DF7F6C87B",
  "F8B156BC2CB7A1E8AC415BFFEAAD7031": "484D7EE46263A1E8B2E444891551C896"
};

const STDLIB = "STDLIB";
const REQ = "REQ";
const CTR_PRI = "CTR_FIR";
const CTR_SEC = "CTR_SEC";
const CTR_THI = "CTR_THI";

const ALLCCROLES = {
  STDLIB: ["Publisher", "Legal Analyst", "Legal Approver"],
  REQ: ["Contract Request Approver", "Contract Requester"],
  CTR_PRI: ["Contract Administrator", "Contract Manager", "Contract Author", "Contract Approver", "Primary Contract Approver"],
  CTR_SEC: ["Account Manager", "Guest", "Executive"],
  OBL: ["Obligation Manager","Obligation Creator","Obligation Performer","Obligation Escalation Performer"],
}

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
  $('body').prepend("<div id=\"successToast\" style=\"font-size: 18px;color: #211e1eeb;z-index: 5000;\"></div> <div id=\"errorToast\"> <div id=\"toastHeading\"> <div id=\"headingContent\"> <h5 style=\"float: left;padding-left: 1em;\"><img src=\"../img/notification_error.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\"> Heading!</h5> </div> <span style=\"position:absolute;cursor:pointer;right:1em;top:1.3em\" id=\"arrowBtn\" class=\"down\" onclick=\"toggleErrorToastContent()\"></span> </div> <div id=\"toastContent\" style=\"display: none;clear:both;\"> <div class=\"horizontal-rule\"></div> <div id=\"contentText\" style=\"margin-top: 6px;padding-left: 6px\" align=\"left\">" + getTranslationMessage("Content!!") + "</div></div></div>");
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
    $("#contentText").html(contentText);
    //$("#contentText").text(getTranslationMessage(contentText));
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
      if (obj["@nil"] === "true") {
        return "";
      }
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

function hideOKButton() {
  var bsButton = $("ai-dialog-footer bs-button:not(.aurelia-hide)[css-class='btn btn-primary']", window.parent.parent.document);
  if (!(bsButton.length > 0)) {
    bsButton = $("ai-dialog-footer bs-button:not(.aurelia-hide)[css-class='btn btn-primary']", window.parent.document);
  }
  if (bsButton && bsButton[0]) {
    var children = bsButton[0].childNodes;
    if (children && children[0]) {
      children[0].setAttribute("style", "display:none");
    }
  }
}

function getOKButton() {
  var bsButton = $("ai-dialog-footer bs-button:not(.aurelia-hide)[css-class='btn btn-primary']",
    window.parent.parent.document);
  if (!(bsButton.length > 0)) {
    bsButton = $("ai-dialog-footer bs-button:not(.aurelia-hide)[css-class='btn btn-primary']", window.parent.document);
  }
  if (bsButton && bsButton[0]) {
    var children = bsButton[0].childNodes;
    if (children && children[0]) {
      return children[0];
    }
  }
}

function hideOrShowFilterContainerBody(iElement, iShow) {
  if (iShow) {
    iElement.setAttribute("apps-toggle", 'expanded');
    iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_up.svg";
  }
  else {
    iElement.setAttribute("apps-toggle", 'collapsed');
    iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_down.svg";
  }
}

function navigateToInstance(ID, type, obj) {
  var ItemID, layoutID, clearBreadcrumb, breadcrumbName;
  var childEntities = ["TemplateContent", "ContractContent", "ContractTask", "ContractRequestTask", "CustomTask", "TemplateTask", "ClauseTask"]
  if (type && !childEntities.includes(type)) {
    ItemID = ID.split(".").length == 2 ? ID : EntityTypes[type] ? EntityTypes[type].Definition_ID + "." + ID : ID;
    layoutID = (obj && obj.layoutID && obj.layoutID.length > 0) ? obj.layoutID : EntityTypes[type] ? EntityTypes[type].Layout_ID : "";
    clearBreadcrumb = (obj && obj.clearBreadcrumb && typeof obj.clearBreadcrumb === 'boolean') ? obj.clearBreadcrumb : false;
    breadcrumbName = (obj && obj.breadcrumbName) ? obj.breadcrumbName : '';

  }
  else if (type && childEntities.includes(type)) {

    ItemID = ID.split(".").length == 3 ? ID : (EntityTypes[type].Definition_ID + "." + ID + "." + (obj.ContentID ? obj.ContentID : obj.TaskID));
    layoutID = (obj && obj.layoutID && obj.layoutID.length > 0) ? obj.layoutID : EntityTypes[type].Layout_ID;
    clearBreadcrumb = (obj && obj.clearBreadcrumb && typeof obj.clearBreadcrumb === 'boolean') ? obj.clearBreadcrumb : false;
    breadcrumbName = (obj && obj.breadcrumbName) ? obj.breadcrumbName : '';
  } else {
    ItemID = ID;
    layoutID = layoutID ? layoutID : itemIDLayoutIDMapping[ID.split(".")[0]];
  }

  var l_publicAPIProvider = getPublicAPIProvider(window);
  if (l_publicAPIProvider) {
    l_publicAPIProvider.navigate(ItemID, { "layoutID": layoutID, "clearBreadcrumb": clearBreadcrumb, "breadcrumbName": breadcrumbName, "type": "reusable" });
  }
  /*document.defaultView.top.publicAPIProvider.navigate(ItemID,
    { "layoutID": layoutID, "clearBreadcrumb": clearBreadcrumb, "breadcrumbName": breadcrumbName, "type":"reusable"});*/

}

function getPublicAPIProvider(currentWindow) {
  if (currentWindow.parent.isDashboardWindow && currentWindow.publicAPIProvider) {
    return currentWindow.publicAPIProvider;
  } else if (currentWindow.parent == currentWindow && currentWindow.publicAPIProvider) {
    return currentWindow.publicAPIProvider;
  } else if (currentWindow.parent == currentWindow && !currentWindow.publicAPIProvider) {
    return null;
  } else {
    return getPublicAPIProvider(currentWindow.parent);
  }
}

function fetchServiceResponse(url, reqMetadata, callback) {
  const methodsWithNoReqBody = ["GET", "DELETE", "TRACE", "OPTIONS", "HEAD"];
  top.window.parent.document.body.aurelia.container.viewModel.sSOService.http.fetch(url,
    {
      ...(reqMetadata.method) && { method: reqMetadata.method },
      ...(reqMetadata.method && !methodsWithNoReqBody.includes(reqMetadata.method)) && { body: JSON.stringify(reqMetadata.bodyObj) }
    }).then(function (response) {
      if ((response.ok && response.ok == false) || (response.status && response.status !== 200) || response.error) {
        callback(response, FAIL);
      }
      else {
        callback(response, SUCCESS);
      }
    });
}

function fetchServiceData(url, reqMetadata) {
  const methodsWithNoReqBody = ["GET", "DELETE", "TRACE", "OPTIONS", "HEAD"];
  return top.window.parent.document.body.aurelia.container.viewModel.sSOService.http.fetch(url,
    {
      ...(reqMetadata.method) && { method: reqMetadata.method },
      ...(reqMetadata.method && !methodsWithNoReqBody.includes(reqMetadata.method)) && { body: JSON.stringify(reqMetadata.bodyObj) }
    });
}




function successToastDiv(divId, msg, time) {

  if (msg) {
    var toastObj = document.getElementById(divId);
    toastObj.innerHTML = '<img src=\"../../../../../com/opentext/apps/utils/img/notification_success.svg\" width=\"25px\" height=\"25px\" align=\"middle\" style=\"margin-right:5px;\">' + getTranslationMessage(msg)
    //  toastObj.className = "show";
    toastObj.style.visibility = "visible"
    setTimeout(function () { toastObj.style.visibility = "hidden" }, time);
  }
  else {
    var toastObj = document.getElementById(divId);
    toastObj.className = "show";
    setTimeout(function () { toastObj.className = toastObj.className.replace("show", "hide"); }, time);
  }
}

