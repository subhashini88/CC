$.cordys.json.defaults.removeNamespacePrefix = true;

const layoutURIs = new Map();
layoutURIs.set("Contract management", "F8B156D635F3A1E89CB08DDB9883E4C8/8797fa7cb8963fa39ee002d389415590");
layoutURIs.set("Obligation management", "F8B156D635F3A1E89CB08DDB9883E4C8/8797fa7cb8963fa39ee002d389415590");
layoutURIs.set("Clause management", "F8B156BC2CB7A1E8B02C7BB5968E3033/4938c4fb24333efe8dff2e3350b3d02b");
layoutURIs.set("Template management", "C4D98747A6D9A1E8AC6C233A4C55886E/4938c4fb24333efe8dff2e3350b3d02b");
layoutURIs.set("Contract request", "F8B156D6337AA1E8AC4038ADD5510882/dbc19cc9624834e0b889bc5724979b69");
var NotificationsModel = function () {
    var self = this;
    self.notifications = ko.observableArray([]);
    self.redirectToInstance = function (data, event) {
        addToViewedNotificationService({ notificationId: data["NotificationInstance-id"].Id }, function (response, status) {
            var redirectionURI = "";
            if(data.ProcessName === "Obligation management" && data.InstanceId && (!data.InstanceId.startsWith("F8B156BC2CB7A1EAA860CBD2EA097077."))) {
                redirectionURI = window.location.href.split("com/opentext/apps/notifications/htm/usernotifications.htm")[0] + "app/start/web/item/005056C00008A1E795653A59509D399D." + data.InstanceId.split(".")[1] + "/" + (data.LayoutURI ? data.LayoutURI : layoutURIs.get(data.ProcessName));
            } else {
                redirectionURI = window.location.href.split("com/opentext/apps/notifications/htm/usernotifications.htm")[0] + "app/start/web/item/" + data.InstanceId + "/" + (data.LayoutURI ? data.LayoutURI : layoutURIs.get(data.ProcessName));
            }
            parent.window.location.pathname = "/home/system" + redirectionURI.split("/home/system")[1];
            parent.window.location.href = redirectionURI;
        });
    }
}
var alignCCNotificationView = function () {
    var l_dialog = parent.document.getElementsByTagName("ai-dialog")[0];
    if (l_dialog) {
        parent.document.getElementsByTagName("iframe")[0].style.minWidth = "calc(60vw - 240px)";
        parent.document.getElementsByTagName("ai-dialog")[0].parentNode.style.position = "relative";
        parent.document.getElementsByTagName("ai-dialog")[0].style.position = "relative";
        parent.document.getElementsByTagName("ai-dialog")[0].style.top = "-3px";
        if (document.body.classList.contains('cc-rtl')) {
			parent.document.getElementsByTagName("ai-dialog")[0].style.left = "-410px";
		} else {
			parent.document.getElementsByTagName("ai-dialog")[0].style.right = "-410px";
		}
        parent.document.getElementsByClassName("action-dialog-expander")[0].innerHTML = "";
    }
    var header = parent.document.getElementsByClassName("ai-dialog-header-container")[0];
    if (header) {
        var settingIcon = document.createElement("div");
        settingIcon.addEventListener('click', event => {
            var redirectionURI = window.location.href.split("com/opentext/apps/notifications/htm/usernotifications.htm")[0] + "app/start/web/pages/50EB711AAD5AA1EC9025D4109CF72B60";
            parent.window.location.pathname = "/home/system" + redirectionURI.split("/home/system")[1];
            parent.window.location.href = redirectionURI;
        });

        var imageURL = "../../../com/opentext/apps/notifications/img/settings.svg";
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            imageURL = "../../../apps/notifications/img/settings.svg";
        }
        settingIcon.innerHTML = "<span style='background-image: url(" + imageURL + ");transform: rotate(270deg);background-size: cover;display: inline-block;height: 25px;width: 25px;margin-top: 2.5px;'></span>";
        header.append(settingIcon);
    }
}
var notifications_model = new NotificationsModel();
$(function () {
		
	var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/notifications/Notifications", i_locale);
    loadRTLIfRequired(i_locale, rtl_css);
	

    function getAllNotifications() {
        TemplateListServiceModel = $.cordys.ajax({
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            method: "getTargetCCNotifications",
            success: function (data) {
                if (data.NotificationInstances && data.NotificationInstances.FindZ_INT_TargetCCNotificationsNoFilterResponse &&
                    data.NotificationInstances.FindZ_INT_TargetCCNotificationsNoFilterResponse.NotificationInstance) {
                    addDataToView("", data.NotificationInstances.FindZ_INT_TargetCCNotificationsNoFilterResponse.NotificationInstance, notifications_model);
                }

            }
        });
    }


    function addDataToView(ItemId, iElementList, iModel) {
        iModel.notifications.removeAll();
        if (iElementList) {
            if (iElementList.length) {
                iElementList.forEach(function (iElement) {
                    iElement.CreatedTimeText = getCreatedTimeString(iElement.Tracking.CreatedDate);
                    iElement.InstanceId = iElement.InstanceId;
					if(iElement.InstanceId && iElement.InstanceId.startsWith("F8B156BC2CB7A1EAA860CBD2EA097077."))
					{
						iElement.LayoutURI = "F8B156BC2CB7A1EAA8618E2DF11AB077";
					}
                    else if (iElement["TargetProcess"]) {
                        iElement.LayoutURI = _getTextValue(iElement["TargetProcess"]["LayoutURI"]);
                    }
                    iElement.ProcessName = iElement.TargetProcess ? iElement.TargetProcess.Name.text : "";
                    iModel.notifications.push(iElement);
                });
            } else {
                iElementList.CreatedTimeText = getCreatedTimeString(iElementList.Tracking.CreatedDate);
                iElementList.InstanceId = iElementList.InstanceId;
				if(iElementList.InstanceId && iElementList.InstanceId.startsWith("F8B156BC2CB7A1EAA860CBD2EA097077."))
					{
						iElementList.LayoutURI = "F8B156BC2CB7A1EAA8618E2DF11AB077";
					}
				else if (iElementList["TargetProcess"]) {
                    iElementList.LayoutURI = _getTextValue(iElementList["TargetProcess"]["LayoutURI"]);
                }
                iElementList.ProcessName = iElementList.TargetProcess ? iElementList.TargetProcess.Name.text : "";
                iModel.notifications.push(iElementList);
            }
        }
    }
    function getCreatedTimeString(iUTCString) {
        var l_createdDate = new Date(Date.parse(iUTCString));
        var l_currentDate = new Date();
        return getDifferenceBetweendates(l_currentDate, l_createdDate, 10, l_createdDate.getFullYear() + "-" + l_createdDate.getMonth() + "-" + l_createdDate.getDate(), "ago");
    }
    function getDifferenceBetweendates(date1, date2, maxDayLimit, iThresholdreturn, iMessageSuffix) {
        var l_firstTimeStamp = date1.getTime();
        var l_secondTimeStamp = date2.getTime();
        var l_TimStampDiff = l_firstTimeStamp - l_secondTimeStamp;
        var l_Difference = Math.round(l_TimStampDiff / (1000 * 3600 * 24))
        if (l_Difference > maxDayLimit) {
            return iThresholdreturn;
        }
        else if (l_Difference > 1) {
            return getStringForTimeDifference(l_Difference, "day", iMessageSuffix);
        }

        var l_Difference = Math.round(l_TimStampDiff / (1000 * 3600))
        if (l_Difference > 1) {
            return getStringForTimeDifference(l_Difference, "hour", iMessageSuffix);
        }

        var l_Difference = Math.round(l_TimStampDiff / (1000 * 60))
        if (l_Difference > 1) {
            return getStringForTimeDifference(l_Difference, "minute", iMessageSuffix);
        }

        return getStringForTimeDifference("few", "second", iMessageSuffix);
    }

    function getStringForTimeDifference(iValue, iType, iMessageSuffix) {
        var l_message = "";
        if (iValue == 1) {
            l_message = iValue + " " + iType + " " + iMessageSuffix;
        }
        else {
            l_message = iValue + " " + iType + "s " + iMessageSuffix;
        }
        return l_message;
    }

    getAllNotifications();
    ko.applyBindings(notifications_model, window.document.getElementById("NotifContainer"));
});

//Services start--------------------------

function addToViewedNotificationService(request, responseCallback) {
    $.cordys.ajax({
        method: "addToViewedNotification",
        namespace: "http://schemas.cordys.com/apps/notifications/18.4",
        parameters: request,
        success: function (responseSuccess) {
            responseCallback(responseSuccess);
        },
        error: function (responseFailure) {
            responseCallback(responseFailure, "ERROR");
            return false;
        }
    });
}


function _getTextValue(obj) {
    return obj && obj.text ? obj.text : obj;
}