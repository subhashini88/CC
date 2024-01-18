$.cordys.json.defaults.removeNamespacePrefix = true;
var l_configProps_model;
var l_configPropDetails_model;
var selectedConfigProps = {};
var listOffsetValue = 0;
var listLimitValue = 25;

const configPropNames =
    [
        { configPropertyName: "", configPropDisplayName: "-Select a configuration property-" },
        { configPropertyName: "Notifications", configPropDisplayName: "Notifications" },
        { configPropertyName: "ALLOW_TAG_CREATE", configPropDisplayName: "ALLOW_TAG_CREATE" },
        { configPropertyName: "BWS_DEFAULT_TEMPLATE_ID", configPropDisplayName: "BWS_DEFAULT_TEMPLATE_ID" },
        { configPropertyName: "DOCUMENT_REPOSITORY", configPropDisplayName: "DOCUMENT_REPOSITORY" },
        { configPropertyName: "ESIGNATURE_PROVIDER", configPropDisplayName: "ESIGNATURE_PROVIDER" },
        { configPropertyName: "DEFAULT_CONTRACT_VALUES", configPropDisplayName: "DEFAULT_CONTRACT_VALUES" },
        { configPropertyName: "ANALYTICS_CONFIGURATION", configPropDisplayName: "ANALYTICS_CONFIGURATION" }
    ];

var ConfigPropsModel = function () {
    var self = this;
    self.ConfigProps = ko.observableArray([]);
    self.numOfConfigProps = ko.observable('');
    self.AddedConfigPropNames = ko.observableArray([]);
    self.onConfigRowCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off")
            $(event.currentTarget).addClass("cc-checkbox-on")
            selectedConfigProps[iItem.configPropID] = iItem.configName;
            $(event.currentTarget.parentElement.parentElement).css("background-color", "#CBD3D9")
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            delete selectedConfigProps[iItem.configPropID];
            $(event.currentTarget.parentElement.parentElement).css("background-color", "transparent")
        }
        event.stopPropagation();
        if (Object.keys(selectedConfigProps).length <= 0) {
            $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-partial");
            $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-on");
            $("#div_selectAllConfigs").addClass("cc-checkbox-select-all-off");
            $("#btn_deleteConfigFromActionBar").css("display", "none");
            $("#btn_editConfigFromActionBar").css("display", "none");
        } else if (Object.keys(selectedConfigProps).length == 1) {
            if (1 == l_configProps_model.numOfConfigProps()) {
                $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-off");
                $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-partial");
                $("#div_selectAllConfigs").addClass("cc-checkbox-select-all-on");
                $("#btn_deleteConfigFromActionBar").css("display", "inline");
                $("#btn_editConfigFromActionBar").css("display", "inline")
            } else {
                $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-off");
                $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-on");
                $("#div_selectAllConfigs").addClass("cc-checkbox-select-all-partial");
                $("#btn_deleteConfigFromActionBar").css("display", "inline");
                $("#btn_editConfigFromActionBar").css("display", "inline")
            }
        } else if (Object.keys(selectedConfigProps).length > 1 && Object.keys(selectedConfigProps).length < l_configProps_model.numOfConfigProps()) {
            $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-off");
            $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-on");
            $("#div_selectAllConfigs").addClass("cc-checkbox-select-all-partial");
            $("#btn_deleteConfigFromActionBar").css("display", "inline");
            $("#btn_editConfigFromActionBar").css("display", "none");
        } else if (Object.keys(selectedConfigProps).length == l_configProps_model.numOfConfigProps()) {
            $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-off");
            $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-partial");
            $("#div_selectAllConfigs").addClass("cc-checkbox-select-all-on");
            $("#btn_deleteConfigFromActionBar").css("display", "inline");
            $("#btn_editConfigFromActionBar").css("display", "none");
        }
    }
    self.onSelectAllConfigsCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-select-all-off" || l_currentClassName == "cc-select-column cc-checkbox-select-all-partial") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-off");
            $(event.currentTarget).removeClass("cc-checkbox-select-all-partial");
            $(event.currentTarget).addClass("cc-checkbox-select-all-on");
            $("#table_configProps").find('tbody .cc-select-column').removeClass("cc-checkbox-off");
            $("#table_configProps").find('tbody .cc-select-column').addClass("cc-checkbox-on");
            $("#table_configProps").find('tbody tr').css("background-color", "#CBD3D9");
            $("#btn_deleteConfigFromActionBar").css("display", "inline");
            $("#btn_editConfigFromActionBar").css("display", "none");
            l_configProps_model.POs().forEach(function (iToken) {
                selectedConfigProps[iToken.configPropID] = iToken.configName;
            });
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-select-all-on") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-on");
            $(event.currentTarget).addClass("cc-checkbox-select-all-off");
            $("#table_configProps").find('tbody .cc-select-column').removeClass("cc-checkbox-on");
            $("#table_configProps").find('tbody .cc-select-column').addClass("cc-checkbox-off");
            $("#table_configProps").find('tbody tr').css("background-color", "transparent")
            $("#btn_deleteConfigFromActionBar").css("display", "none");
            $("#btn_editConfigFromActionBar").css("display", "none");
            selectedConfigProps = {};
        }
        event.stopPropagation();
    }
}

var ConfigPropDetailsModel = function () {
    var self = this;

    self.createOreditMode = ko.observable('CREATE')

    self.configPropID = ko.observable('');
    self.configPropItemID = ko.observable('');

    self.configPropsToCreate = ko.observableArray([]);

    self.configPropName = ko.observable('');
    self.configPropValue = ko.observable('');

    self.analytics_FrequencyValue = ko.observable('');
    self.analytics_FrequencyType = ko.observable('');

    self.defaultValue_CONTRACTTERM = ko.observable('').extend({ trackValueChange: true });
    self.defaultValue_PERPETUAL = ko.observable('false').extend({ trackValueChange: true });
    self.defaultValue_ISEXECUTED = ko.observable('false').extend({ trackValueChange: true });
    self.defaultValue_ISEXTERNAL = ko.observable('false').extend({ trackValueChange: true });
    self.defaultValue_COUNTRY = ko.observable('').extend({ trackValueChange: true });
    self.defaultValue_CURRENCY = ko.observable('').extend({ trackValueChange: true });
    self.defaultValue_ORGANIZATION = ko.observable('').extend({ trackValueChange: true });
    self.defaultValue_CONTRACTTYPE = ko.observable('').extend({ trackValueChange: true });
    self.defaultValue_TEMPLATETYPE = ko.observable('').extend({ trackValueChange: true });
    self.defaultValue_TEMPLATE = ko.observable('').extend({ trackValueChange: true });

    self.dirtyFlag = ko.observable(false);
    self.startTrackValueChanges = ko.observable(false);

    self.updateIsExecuted = function (value, iItem, event) {
        self.defaultValue_ISEXECUTED(value);
        if (value == 'true') {
            l_configPropDetails_model.defaultValue_TEMPLATETYPE("None");
            l_configPropDetails_model.defaultValue_TEMPLATE("");
        }
        self.dirtyFlag(true);
        event.stopPropagation();
    }
    self.updateIsExternal = function (value, iItem, event) {
        self.defaultValue_ISEXTERNAL(value);
        if (value == 'true') {
            l_configPropDetails_model.defaultValue_TEMPLATETYPE("None");
            l_configPropDetails_model.defaultValue_TEMPLATE("");
        }
        self.dirtyFlag(true);
        event.stopPropagation();
    }
    self.updatePerpetual = function (value, iItem, event) {
        self.defaultValue_PERPETUAL(value);

        if (value == 'true') {
            l_configPropDetails_model.defaultValue_CONTRACTTERM("")
            $('#ContractTermPreviewModel').css("display", "none");
        }
        self.dirtyFlag(true);
        event.stopPropagation();
    }

    self.templateTypechange = function (obj, event) {
        l_configPropDetails_model.defaultValue_TEMPLATE("");
    }
}

ko.extenders.trackValueChange = function (target, track) {
    if (track) {
        target.hasValueChanged = ko.observable(false);
        target.originalValue = target();
        target.subscribe(function (newValue) {
            if (l_configPropDetails_model.startTrackValueChanges()) {
                target.hasValueChanged(newValue != target.originalValue);
                if (target.hasValueChanged()) {
                    l_configPropDetails_model.dirtyFlag(true);
                }
            }
        });
    }
    return target;
};

function listConfigProps() {
    $("#btn_editConfigFromActionBar").css("display", "none");
    $("#btn_deleteConfigFromActionBar").css("display", "none");
    $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-partial");
    $("#div_selectAllConfigs").removeClass("cc-checkbox-select-all-on");
    $("#div_selectAllConfigs").addClass("cc-checkbox-select-all-off");
    selectedConfigProps = {};
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCProperties/operations",
        method: "GetAllConfigProps",
        parameters: {},
        success: function (data) {
            addDataToConfigPropsListView(data.GCProperties, l_configProps_model);
            l_configPropDetails_model.startTrackValueChanges(false);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving configuration properties. Contact your administrator."), 10000);
            return false;
        }
    });
}

function addDataToConfigPropsListView(iElementList, iModel) {
    iModel.ConfigProps.removeAll();
    iModel.AddedConfigPropNames.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iModel.numOfConfigProps(iElementList.length);
            iElementList.forEach(function (iElement) {
                iModel.ConfigProps.push(formConfigProplistdata(iElement));
                iModel.AddedConfigPropNames.push(iElement.Name);
            });
        }
        else {
            iModel.numOfConfigProps(1);
            iModel.ConfigProps.push(formConfigProplistdata(iElementList));
            iModel.AddedConfigPropNames.push(iElementList.Name);
        }
    } else {
        iModel.numOfConfigProps(0);
    }
    l_configPropDetails_model.configPropsToCreate.removeAll();
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "", configPropDisplayName: "-Select a configuration property-" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "Notifications", configPropDisplayName: "Notifications" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "ALLOW_TAG_CREATE", configPropDisplayName: "ALLOW_TAG_CREATE" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "BWS_DEFAULT_TEMPLATE_ID", configPropDisplayName: "BWS_DEFAULT_TEMPLATE_ID" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "DOCUMENT_REPOSITORY", configPropDisplayName: "DOCUMENT_REPOSITORY" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "ESIGNATURE_PROVIDER", configPropDisplayName: "ESIGNATURE_PROVIDER" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "DEFAULT_CONTRACT_VALUES", configPropDisplayName: "DEFAULT_CONTRACT_VALUES" });
    l_configPropDetails_model.configPropsToCreate.push({ configPropertyName: "ANALYTICS_CONFIGURATION", configPropDisplayName: "ANALYTICS_CONFIGURATION" });
    iModel.AddedConfigPropNames().forEach(function (propName) {
        l_configPropDetails_model.configPropsToCreate.remove(function (configPropName) {
            return configPropName.configPropertyName == propName;
        });
    })
}

function formConfigProplistdata(iElement) {
    var properties = {};
    if (iElement) {
        properties.configPropID = iElement['GCProperties-id'].Id;
        properties.configPropItemID = iElement['GCProperties-id'].ItemId;
        properties.configName = iElement.Name;
        properties.configValue = iElement.value;
    }
    return properties;
}

function createOrUpdateConfig() {
    if (l_configPropDetails_model.configPropName() === "DEFAULT_CONTRACT_VALUES") {
        if ((l_configPropDetails_model.defaultValue_CONTRACTTERM() != undefined && l_configPropDetails_model.defaultValue_CONTRACTTERM() != "")) {
            var months = "";
            var days = "";
            if (l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf("month(s)") > 0) {
                months = l_configPropDetails_model.defaultValue_CONTRACTTERM().substring(0, l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf(" month(s)"))
            }
            if (l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf("day(s)") > 0) {
                if (months != "") {
                    days = l_configPropDetails_model.defaultValue_CONTRACTTERM().substring(l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf("month(s), ") + "month(s), ".length, l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
                    l_configPropDetails_model.defaultValue_CONTRACTTERM("P" + months + "M" + days + "D");
                }
                else {
                    days = l_configPropDetails_model.defaultValue_CONTRACTTERM().substring(0, l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
                    l_configPropDetails_model.defaultValue_CONTRACTTERM("P" + days + "D");
                }
            }
            else {
                l_configPropDetails_model.defaultValue_CONTRACTTERM("P" + months + "M");
            }
        }
        else {
            l_configPropDetails_model.defaultValue_CONTRACTTERM("");
        }

        var l_configPropValue = "ORGANIZATION_NAME:" + JSON.stringify(l_configPropDetails_model.defaultValue_ORGANIZATION())
            + ";CONTRACTTYPE:" + JSON.stringify(l_configPropDetails_model.defaultValue_CONTRACTTYPE())
            + ";ISEXECUTED:" + l_configPropDetails_model.defaultValue_ISEXECUTED()
            + ";ISEXTERNAL:" + l_configPropDetails_model.defaultValue_ISEXTERNAL()
            + ";TEMPLATETYPE:" + l_configPropDetails_model.defaultValue_TEMPLATETYPE()
            + ";TEMPLATE:" + JSON.stringify(l_configPropDetails_model.defaultValue_TEMPLATE())
            + ";CONTRACTTERM:" + l_configPropDetails_model.defaultValue_CONTRACTTERM()
            + ";PERPETUAL:" + l_configPropDetails_model.defaultValue_PERPETUAL()
            + ";COUNTRY:" + JSON.stringify(l_configPropDetails_model.defaultValue_COUNTRY())
            + ";CURRENCY:" + JSON.stringify(l_configPropDetails_model.defaultValue_CURRENCY());
        l_configPropDetails_model.configPropValue(l_configPropValue);
    }
    if (l_configPropDetails_model.configPropName() === "ANALYTICS_CONFIGURATION") {
        var l_configPropValue = "P" + l_configPropDetails_model.analytics_FrequencyValue() + l_configPropDetails_model.analytics_FrequencyType();
        if (l_configPropValue.length > 2) {
            l_configPropDetails_model.configPropValue(l_configPropValue);
        }
    }
    if (l_configPropDetails_model.configPropName() === "") {
        $("#select_configPropName").addClass("cc-error");
    } else {
        if (l_configPropDetails_model.configPropValue() === "") {
            $("#select_configPropValue").addClass("cc-error");
        } else {
            if (l_configPropDetails_model.configPropID()) {
                updateConfigProp();
            } else {
                createConfigProp();
            }
        }
    }
}
function updateConfigProp() {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCProperties/operations",
        method: "UpdateGCProperties",
        parameters: {
            "GCProperties-id": {
                "Id": l_configPropDetails_model.configPropID(),
            },
            "GCProperties-update": {
                "Name": l_configPropDetails_model.configPropName(),
                "value": l_configPropDetails_model.configPropValue()
            }
        },
        success: function (data) {
            $('#div_createOrUpdateConfigModal').modal('hide');
            successToast(3000, getTranslationMessage("Configuration property updated succesfully."));
            listConfigProps();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating configurable property. Contact your administrator."), 10000);
            return false;
        }
    });
}

function createConfigProp() {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCProperties/operations",
        method: "CreateGCProperties",
        parameters: {
            "GCProperties-create": {
                "Name": l_configPropDetails_model.configPropName(),
                "value": l_configPropDetails_model.configPropValue()
            }
        },
        success: function (data) {
            $('#div_createOrUpdateConfigModal').modal('hide');
            successToast(3000, getTranslationMessage("Configuration property created succesfully."));
            listConfigProps();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating configuration property. Contact your administrator."), 10000);
            return false;
        }
    });
}

function callOpenConfigCreateForm() {
    openConfigPropCreateOrEditForm();
}

function callOpenConfigSummaryForm() {
    if (Object.keys(selectedConfigProps).length == 1) {
        openConfigPropCreateOrEditForm(l_configProps_model.ConfigProps().filter(ele => ele.configPropID === Object.keys(selectedConfigProps)[0])[0]);
    }
}

function openConfigPropCreateOrEditForm(i_configProp) {
    $('#div_createOrUpdateConfigModal').modal({
        backdrop: 'static',
        keyboard: false
    })
    clearConfigModelData();
    if (i_configProp) {
        $("#span_createOrEditModalHeading").text(getTranslationMessage("Edit") + " ");
        $("#btn_createOrUpdateConfig").text(getTranslationMessage("Update"));
        loadConfigPropDetails(i_configProp);
    } else {
        $("#span_createOrEditModalHeading").text(getTranslationMessage("Create") + " ");
        $("#btn_createOrUpdateConfig").text(getTranslationMessage("Create"));
    }
}

function loadConfigPropDetails(i_configProp) {
    if (i_configProp) {
        l_configPropDetails_model.createOreditMode('EDIT')
        l_configPropDetails_model.configPropID(getTextValue(i_configProp.configPropID));
        l_configPropDetails_model.configPropItemID(getTextValue(i_configProp.configPropItemID));

        l_configPropDetails_model.configPropName(getTextValue(i_configProp.configName));
        l_configPropDetails_model.configPropValue(getTextValue(i_configProp.configValue));

        if (l_configPropDetails_model.configPropName() === "ANALYTICS_CONFIGURATION") {
            if (l_configPropDetails_model.configPropValue().lastIndexOf("H") > 0) {
                l_configPropDetails_model.analytics_FrequencyValue(l_configPropDetails_model.configPropValue().substring(1, l_configPropDetails_model.configPropValue().lastIndexOf("H")));
                l_configPropDetails_model.analytics_FrequencyType("H");
            } else if (l_configPropDetails_model.configPropValue().lastIndexOf("D") > 0) {
                l_configPropDetails_model.analytics_FrequencyValue(l_configPropDetails_model.configPropValue().substring(1, l_configPropDetails_model.configPropValue().lastIndexOf("D")));
                l_configPropDetails_model.analytics_FrequencyType("D");
            } else if (l_configPropDetails_model.configPropValue().lastIndexOf("M") > 0) {
                l_configPropDetails_model.analytics_FrequencyValue(l_configPropDetails_model.configPropValue().substring(1, l_configPropDetails_model.configPropValue().lastIndexOf("M")));
                l_configPropDetails_model.analytics_FrequencyType("M");
            }
        }

        if (l_configPropDetails_model.configPropName() === "DEFAULT_CONTRACT_VALUES") {
            var l_defaultPropsArray = l_configPropDetails_model.configPropValue().split(";");
            l_defaultPropsArray.forEach(function (defaultProp) {
                if (defaultProp.includes(":")) {
                    var l_keyValueArray = defaultProp.split(/:(.*)/s);
                    if (l_keyValueArray[0] === "ORGANIZATION_NAME") {
                        l_configPropDetails_model.defaultValue_ORGANIZATION(l_keyValueArray[1] != '' ? JSON.parse(l_keyValueArray[1]) : '');
                    }
                    if (l_keyValueArray[0] === "CONTRACTTYPE") {
                        l_configPropDetails_model.defaultValue_CONTRACTTYPE(l_keyValueArray[1] != '' ? JSON.parse(l_keyValueArray[1]) : '');
                    }
                    if (l_keyValueArray[0] === "ISEXECUTED") {
                        l_configPropDetails_model.defaultValue_ISEXECUTED(l_keyValueArray[1] != '' ? l_keyValueArray[1] : 'false');
                    }
                    if (l_keyValueArray[0] === "ISEXTERNAL") {
                        l_configPropDetails_model.defaultValue_ISEXTERNAL(l_keyValueArray[1] != '' ? l_keyValueArray[1] : 'false');
                    }
                    if (l_keyValueArray[0] === "TEMPLATETYPE") {
                        l_configPropDetails_model.defaultValue_TEMPLATETYPE(l_keyValueArray[1] != '' ? l_keyValueArray[1] : 'None');
                    }
                    if (l_keyValueArray[0] === "TEMPLATE") {
                        l_configPropDetails_model.defaultValue_TEMPLATE(l_keyValueArray[1] != '' ? JSON.parse(l_keyValueArray[1]) : '');
                    }
                    if (l_keyValueArray[0] === "CONTRACTTERM") {
                        var l_contractTermDuration = l_keyValueArray[1];
                        if (l_contractTermDuration.lastIndexOf("M") > 0 && l_contractTermDuration.lastIndexOf("D") > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("M") + 1, l_contractTermDuration.lastIndexOf("D"))) > 0) {
                            l_configPropDetails_model.defaultValue_CONTRACTTERM(getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) + " month(s), " + getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("M") + 1, l_contractTermDuration.lastIndexOf("D"))) + " day(s)");
                        }
                        else if (l_contractTermDuration.lastIndexOf("M") > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) > 0) {
                            l_configPropDetails_model.defaultValue_CONTRACTTERM(getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) + " month(s)");
                        }
                        else if (l_contractTermDuration.lastIndexOf("D") > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("D"))) > 0) {
                            l_configPropDetails_model.defaultValue_CONTRACTTERM(getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("D"))) + " day(s)");
                        } else {
                            l_configPropDetails_model.defaultValue_CONTRACTTERM("");
                        }
                    }
                    if (l_keyValueArray[0] === "PERPETUAL") {
                        l_configPropDetails_model.defaultValue_PERPETUAL(l_keyValueArray[1] != '' ? l_keyValueArray[1] : 'false');
                    }
                    if (l_keyValueArray[0] === "COUNTRY") {
                        l_configPropDetails_model.defaultValue_COUNTRY(l_keyValueArray[1] != '' ? JSON.parse(l_keyValueArray[1]) : '');
                    }
                    if (l_keyValueArray[0] === "CURRENCY") {
                        l_configPropDetails_model.defaultValue_CURRENCY(l_keyValueArray[1] != '' ? JSON.parse(l_keyValueArray[1]) : '');
                    }
                }
            })
        }
    }
    l_configPropDetails_model.startTrackValueChanges(true);
}

function clearConfigModelData() {
    l_configPropDetails_model.configPropID('');
    l_configPropDetails_model.configPropItemID('');

    l_configPropDetails_model.configPropName('');
    l_configPropDetails_model.configPropValue('');

    l_configPropDetails_model.defaultValue_CONTRACTTERM('');
    l_configPropDetails_model.defaultValue_PERPETUAL('false');
    l_configPropDetails_model.defaultValue_ISEXECUTED('false');
    l_configPropDetails_model.defaultValue_ISEXTERNAL('false');
    l_configPropDetails_model.defaultValue_COUNTRY('');
    l_configPropDetails_model.defaultValue_CURRENCY('');
    l_configPropDetails_model.defaultValue_ORGANIZATION('');
    l_configPropDetails_model.defaultValue_CONTRACTTYPE('');
    l_configPropDetails_model.defaultValue_TEMPLATETYPE('');
    l_configPropDetails_model.defaultValue_TEMPLATE('');

    l_configPropDetails_model.dirtyFlag(false);
}

function deleteConfigFromActionBar() {
    $("#div_deleteConfigModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#span_NumOfConfigsToDelete").text(" (" + Object.keys(selectedConfigProps).length + " items)");
    $('button#btn_deleteConfigYes').off("click");
    $('button#btn_deleteConfigYes').on('click', function (_event) {
        for (iElement in selectedConfigProps) {
            $.cordys.ajax({
                namespace: "http://schemas/OpenTextBasicComponents/GCProperties/operations",
                method: "DeleteGCProperties",
                async: false,
                parameters: {
                    "GCProperties-id": {
                        "Id": iElement,
                    }
                },
                success: function (data) {
                    $('#div_deleteConfigModal').modal('hide');
                    successToast(3000, getTranslationMessage("Configuration property deleted succesfully."));
                },
                error: function (responseFailure) {
                    showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while deleting configuration property. Contact your administrator."), 10000);
                    return false;
                }
            });
        }
        listConfigProps();
    });
}
function removeErrorClass(iEvent) {
    $(iEvent).removeClass("cc-error");
    l_configPropDetails_model.dirtyFlag(true);
}

//organization lookup model
var OrgsListModel = function () {
    var self = this;


    self.RecordsList = ko.observableArray([]);
    self.selectedOrgName = ko.observable('');

    self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);

    var l_orgNameFilterElement = document.getElementById("input_orgNameFilter");
    var l_orgCodeFilterElement = document.getElementById("input_orgCodeFilter");
    var l_parentOrgNameFilterElement = document.getElementById("input_parentOrgNameFilter");

    self.selectedOrgItemId = ko.observable('');

    self.selectOrgListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["GCOrganization-id"]) {
            var l_itemId = iItem["GCOrganization-id"].ItemId;
            self.selectedOrgItemId(l_itemId);
            self.selectedOrgName(iItem.Name);
        }
    }
    self.onOrgListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["GCOrganization-id"]) {
            var l_itemId = iItem["GCOrganization-id"].ItemId;
            self.selectedOrgItemId(l_itemId);
            self.selectedOrgName(iItem.Name)
        }
        event.stopPropagation();
    }
    self.ClearOrgsListFilter = function () {
        l_orgNameFilterElement.value = "";
        l_orgCodeFilterElement.value = "";
        l_parentOrgNameFilterElement.value = "";
    }
    self.getOrgsListFilterObject = function () {
        self.CurrentFilterObject = {
            "orgName": l_orgNameFilterElement.value,
            "orgCode": l_orgCodeFilterElement.value,
            "parentOrgName": l_parentOrgNameFilterElement.value,
            "offset": listOffsetValue,
            "limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openOrgSelectionModal() {
    $("#div_selectOrgModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ClearOrgsListFilter();
    l_OrgsList_model.currentPage('1');
    ListOrganizations();
    $('button#btn_selectOrgYes').off("click");
    $('button#btn_selectOrgYes').on('click', function (_event) {
        l_configPropDetails_model.defaultValue_ORGANIZATION({ "ItemId": l_OrgsList_model.selectedOrgItemId(), "Name": l_OrgsList_model.selectedOrgName() });
        l_configPropDetails_model.defaultValue_CONTRACTTYPE("");
        l_configPropDetails_model.defaultValue_TEMPLATETYPE("None");
        l_configPropDetails_model.defaultValue_TEMPLATE("");
        l_configPropDetails_model.dirtyFlag(true);
    });

}
function clearOrgSelection() {
    l_configPropDetails_model.defaultValue_ORGANIZATION("");
    l_configPropDetails_model.defaultValue_CONTRACTTYPE("");
    l_configPropDetails_model.defaultValue_TEMPLATETYPE("None");
    l_configPropDetails_model.defaultValue_TEMPLATE("");
    l_configPropDetails_model.dirtyFlag(true);
}
function ClearOrgsListFilter(event, iSrcElement) {
    l_OrgsList_model.ClearOrgsListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    l_OrgsList_model.isFilterApplied(false);
    l_OrgsList_model.currentPage('1');
    listOffsetValue = 0;
    ListOrganizations();
    hideOrgsListFilter();
}
function hideOrgsListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_orgListData").removeClass("col-md-9");
    $("#div_orgListData").addClass("col-md-12");
}
function ApplyFilterOnOrgsList(event, iSrcElement) {
    if (document.getElementById("input_orgNameFilter").value != "" || document.getElementById("input_orgCodeFilter").value != "" || document.getElementById("input_parentOrgNameFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        l_OrgsList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        l_OrgsList_model.isFilterApplied(false);
    }
    l_OrgsList_model.currentPage('1');
    listOffsetValue = 0;
    ListOrganizations();
    hideOrgsListFilter();
}
function ListOrganizations(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetOrgsWithFilters",
        parameters: l_OrgsList_model.getOrgsListFilterObject(),
        success: function (data) {
            addDataToLookup(data.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization, l_OrgsList_model);
            if (undefined != data.OrgsResponse.FindZ_INT_OrgListResponse["@total"]) {
                l_OrgsList_model.numOfRecords(data.OrgsResponse.FindZ_INT_OrgListResponse["@total"]);
            } else {
                l_OrgsList_model.numOfRecords(0);
            }

            if (l_OrgsList_model.numOfRecords() != 0) {
                l_OrgsList_model.numOfPages(Math.ceil(l_OrgsList_model.numOfRecords() / listLimitValue));
            } else {
                l_OrgsList_model.numOfPages(1);
            }
            updatePaginationParams(l_OrgsList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the organizations. Contact your administrator."), 10000);
            return false;
        }
    });
}

//contract type lookup model
var CTRTypesListModel = function () {
    var self = this;


    self.RecordsList = ko.observableArray([]);
    self.selectedCTRTypeName = ko.observable('');

    self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);

    var l_CTRTypeNameFilterElement = document.getElementById("input_CTRTypeNameFilter");
    var l_CTIntentTypeFilterElement = document.getElementById("input_CTIntentTypeFilter");
    var l_CTDescFilterElement = document.getElementById("input_CTDescFilter");

    self.selectedCTRTypeItemId = ko.observable('');

    self.selectCTRTypeListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["GCType-id"]) {
            var l_itemId = iItem["GCType-id"].ItemId;
            self.selectedCTRTypeItemId(l_itemId);
            self.selectedCTRTypeName(iItem.Name);
        }
    }
    self.onCTRTypeListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["GCType-id"]) {
            var l_itemId = iItem["GCType-id"].ItemId;
            self.selectedCTRTypeItemId(l_itemId);
            self.selectedCTRTypeName(iItem.Name)
        }
        event.stopPropagation();
    }
    self.ClearCTRTypesListFilter = function () {
        l_CTRTypeNameFilterElement.value = "";
        l_CTIntentTypeFilterElement.value = "";
        l_CTDescFilterElement.value = "";
    }
    self.getCTRTypesListFilterObject = function () {
        self.CurrentFilterObject = {
            "Name": l_CTRTypeNameFilterElement.value,
            "IntentType": l_CTIntentTypeFilterElement.value,
            "Description": l_CTDescFilterElement.value,
            "OrgID": l_configPropDetails_model.defaultValue_ORGANIZATION().ItemId.split('.')[1],
            "offset": listOffsetValue,
            "limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openCTRTypeSelectionModal() {
    if (l_configPropDetails_model.defaultValue_ORGANIZATION() == "")
        return;
    $("#div_selectCTRTypeModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ClearCTRTypesListFilter();
    l_CTRTypesList_model.currentPage('1');
    ListCTRTypes();
    $('button#btn_selectCTRTypeYes').off("click");
    $('button#btn_selectCTRTypeYes').on('click', function (_event) {
        l_configPropDetails_model.defaultValue_CONTRACTTYPE({ "ItemId": l_CTRTypesList_model.selectedCTRTypeItemId(), "Name": l_CTRTypesList_model.selectedCTRTypeName() });
        l_configPropDetails_model.defaultValue_TEMPLATETYPE("None");
        l_configPropDetails_model.defaultValue_TEMPLATE("");
        l_configPropDetails_model.dirtyFlag(true);
    });
}
function clearCTRTypeSelection() {
    l_configPropDetails_model.defaultValue_CONTRACTTYPE("");
    l_configPropDetails_model.defaultValue_TEMPLATETYPE("None");
    l_configPropDetails_model.defaultValue_TEMPLATE("");
    l_configPropDetails_model.dirtyFlag(true);
}
function ClearCTRTypesListFilter(event, iSrcElement) {
    l_CTRTypesList_model.ClearCTRTypesListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    l_CTRTypesList_model.isFilterApplied(false);
    l_CTRTypesList_model.currentPage('1');
    listOffsetValue = 0;
    ListCTRTypes();
    hideCTRTypesListFilter();
}
function hideCTRTypesListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_CTRTypeListData").removeClass("col-md-9");
    $("#div_CTRTypeListData").addClass("col-md-12");
}
function ApplyFilterOnCTRTypesList(event, iSrcElement) {
    if (document.getElementById("input_CTRTypeNameFilter").value != "" || document.getElementById("input_CTIntentTypeFilter").value != "" || document.getElementById("input_CTDescFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        l_CTRTypesList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        l_CTRTypesList_model.isFilterApplied(false);
    }
    l_CTRTypesList_model.currentPage('1');
    listOffsetValue = 0;
    ListCTRTypes();
    hideCTRTypesListFilter();
}
function ListCTRTypes(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetFilteredCtrTypes",
        parameters: l_CTRTypesList_model.getCTRTypesListFilterObject(),
        success: function (data) {
            addDataToLookup(data.filteredTypes.FindZ_INT_FilteredTypesResponse.GCType, l_CTRTypesList_model);
            if (undefined != data.filteredTypes.FindZ_INT_FilteredTypesResponse["@total"]) {
                l_CTRTypesList_model.numOfRecords(data.filteredTypes.FindZ_INT_FilteredTypesResponse["@total"]);
            } else {
                l_CTRTypesList_model.numOfRecords(0);
            }

            if (l_CTRTypesList_model.numOfRecords() != 0) {
                l_CTRTypesList_model.numOfPages(Math.ceil(l_CTRTypesList_model.numOfRecords() / listLimitValue));
            } else {
                l_CTRTypesList_model.numOfPages(1);
            }
            updatePaginationParams(l_CTRTypesList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the contract types. Contact your administrator."), 10000);
            return false;
        }
    });
}

//Template lookup model
var TemplatesListModel = function () {
    var self = this;


    self.RecordsList = ko.observableArray([]);
    self.selectedTemplateName = ko.observable('');

    self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);

    var l_TemplateNameFilterElement = document.getElementById("input_TemplateNameFilter");
    var l_TemplateIDFilterElement = document.getElementById("input_templateIDFilter");
    var l_TemplateDescFilterElement = document.getElementById("input_templateDescFilter");

    self.selectedTemplateItemId = ko.observable('');

    self.selectTemplateListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["GCTemplate-id"]) {
            var l_itemId = iItem["GCTemplate-id"].ItemId;
            self.selectedTemplateItemId(l_itemId);
            self.selectedTemplateName(iItem.Name);
        }
    }
    self.onTemplateListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["GCTemplate-id"]) {
            var l_itemId = iItem["GCTemplate-id"].ItemId;
            self.selectedTemplateItemId(l_itemId);
            self.selectedTemplateName(iItem.Name)
        }
        event.stopPropagation();
    }
    self.ClearTemplatesListFilter = function () {
        l_TemplateNameFilterElement.value = "";
        l_TemplateIDFilterElement.value = "";
        l_TemplateDescFilterElement.value = "";
    }
    self.getTemplatesListFilterObject = function () {
        self.CurrentFilterObject = {
            "templateName": l_TemplateNameFilterElement.value,
            "templateID": l_TemplateIDFilterElement.value,
            "description": l_TemplateDescFilterElement.value,
            "state": "Active",
            "contractTypeID": l_configPropDetails_model.defaultValue_CONTRACTTYPE().ItemId.split('.')[1],
            "templateType": l_configPropDetails_model.defaultValue_TEMPLATETYPE(),
            "offset": listOffsetValue,
            "limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openTemplateSelectionModal() {
    if (l_configPropDetails_model.defaultValue_ORGANIZATION() == "" || l_configPropDetails_model.defaultValue_TEMPLATETYPE() == "None")
        return;
    $("#div_selectTemplateModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ClearTemplatesListFilter();
    l_TemplatesList_model.currentPage('1');
    ListTemplates();
    $('button#btn_selectTemplateYes').off("click");
    $('button#btn_selectTemplateYes').on('click', function (_event) {
        l_configPropDetails_model.defaultValue_TEMPLATE({ "ItemId": l_TemplatesList_model.selectedTemplateItemId(), "Name": l_TemplatesList_model.selectedTemplateName() });
        l_configPropDetails_model.dirtyFlag(true);
    });

}
function clearTemplateSelection() {
    l_configPropDetails_model.defaultValue_TEMPLATE("");
    l_configPropDetails_model.dirtyFlag(true);
}
function ClearTemplatesListFilter(event, iSrcElement) {
    l_TemplatesList_model.ClearTemplatesListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    l_TemplatesList_model.isFilterApplied(false);
    l_TemplatesList_model.currentPage('1');
    listOffsetValue = 0;
    ListTemplates();
    hideTemplatesListFilter();
}
function hideTemplatesListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_TemplateListData").removeClass("col-md-9");
    $("#div_TemplateListData").addClass("col-md-12");
}
function ApplyFilterOnTemplatesList(event, iSrcElement) {
    if (document.getElementById("input_TemplateNameFilter").value != "" || document.getElementById("input_templateIDFilter").value != "" || document.getElementById("input_templateDescFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        l_TemplatesList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        l_TemplatesList_model.isFilterApplied(false);
    }
    l_TemplatesList_model.currentPage('1');
    listOffsetValue = 0;
    ListTemplates();
    hideTemplatesListFilter();
}
function ListTemplates(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextContentLibrary/16.5",
        method: "GetTemplateswithFilters",
        parameters: l_TemplatesList_model.getTemplatesListFilterObject(),
        success: function (data) {
            addDataToLookup(data.outputResponse.FindZ_INT_TemplatesForLookupResponse.GCTemplate, l_TemplatesList_model);
            if (undefined != data.outputResponse.FindZ_INT_TemplatesForLookupResponse["@total"]) {
                l_TemplatesList_model.numOfRecords(data.outputResponse.FindZ_INT_TemplatesForLookupResponse["@total"]);
            } else {
                l_TemplatesList_model.numOfRecords(0);
            }

            if (l_TemplatesList_model.numOfRecords() != 0) {
                l_TemplatesList_model.numOfPages(Math.ceil(l_TemplatesList_model.numOfRecords() / listLimitValue));
            } else {
                l_TemplatesList_model.numOfPages(1);
            }
            updatePaginationParams(l_TemplatesList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the templates. Contact your administrator."), 10000);
            return false;
        }
    });
}

//country lookup model
var CountryListModel = function () {
    var self = this;


    self.RecordsList = ko.observableArray([]);
    self.selectedCountryName = ko.observable('');

    self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);

    var l_CountryNameFilterElement = document.getElementById("input_CountryNameFilter");
    var l_CountryCodeFilterElement = document.getElementById("input_CountryCodeFilter");
    var l_CountryRegionFilterElement = document.getElementById("input_countryRegionFilter");

    self.selectedCountryItemId = ko.observable('');

    self.selectCountryListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["RelatedCountries-id"]) {
            var l_itemId = iItem["RelatedCountries-id"].ItemId1;
            self.selectedCountryItemId(l_itemId);
            self.selectedCountryName(getTextValue(iItem.LinkedCountry.Country_Name));
        }
    }
    self.onCountryListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["RelatedCountries-id"]) {
            var l_itemId = iItem["RelatedCountries-id"].ItemId1;
            self.selectedCountryItemId(l_itemId);
            self.selectedCountryName(getTextValue(iItem.LinkedCountry.Country_Name));
        }
        event.stopPropagation();
    }
    self.ClearCountryListFilter = function () {
        l_CountryNameFilterElement.value = "";
        l_CountryCodeFilterElement.value = "";
        l_CountryRegionFilterElement.value = "";
    }
    self.getCountryListFilterObject = function () {
        self.CurrentFilterObject = {
            "countryName": l_CountryNameFilterElement.value,
            "countryCode": l_CountryCodeFilterElement.value,
            "regionName": l_CountryRegionFilterElement.value,
            "countryStatus": "ACTIVE",
            "offset": listOffsetValue,
            "limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openCountrySelectionModal() {
    $("#div_selectCountryModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ClearCountryListFilter();
    l_CountryList_model.currentPage('1');
    ListCountries();
    $('button#btn_selectCountryYes').off("click");
    $('button#btn_selectCountryYes').on('click', function (_event) {
        l_configPropDetails_model.defaultValue_COUNTRY({ "ItemId": l_CountryList_model.selectedCountryItemId(), "Name": l_CountryList_model.selectedCountryName() });
        l_configPropDetails_model.dirtyFlag(true);
    });

}
function clearCountrySelection() {
    l_configPropDetails_model.defaultValue_COUNTRY("");
    l_configPropDetails_model.dirtyFlag(true);
}
function ClearCountryListFilter(event, iSrcElement) {
    l_CountryList_model.ClearCountryListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    l_CountryList_model.isFilterApplied(false);
    l_CountryList_model.currentPage('1');
    listOffsetValue = 0;
    ListCountries();
    hideCountryListFilter();
}
function hideCountryListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_CountryListData").removeClass("col-md-9");
    $("#div_CountryListData").addClass("col-md-12");
}
function ApplyFilterOnCountryList(event, iSrcElement) {
    if (document.getElementById("input_CountryNameFilter").value != "" || document.getElementById("input_CountryCodeFilter").value != "" || document.getElementById("input_countryRegionFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        l_CountryList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        l_CountryList_model.isFilterApplied(false);
    }
    l_CountryList_model.currentPage('1');
    listOffsetValue = 0;
    ListCountries();
    hideCountryListFilter();
}
function ListCountries(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
        method: "getCountrieswithfilters",
        parameters: l_CountryList_model.getCountryListFilterObject(),
        success: function (data) {
            addDataToLookup(data.countries.FindZ_INT_CountryListResponse.RelatedCountries, l_CountryList_model);
            if (undefined != data.countries.FindZ_INT_CountryListResponse["@total"]) {
                l_CountryList_model.numOfRecords(data.countries.FindZ_INT_CountryListResponse["@total"]);
            } else {
                l_CountryList_model.numOfRecords(0);
            }

            if (l_CountryList_model.numOfRecords() != 0) {
                l_CountryList_model.numOfPages(Math.ceil(l_CountryList_model.numOfRecords() / listLimitValue));
            } else {
                l_CountryList_model.numOfPages(1);
            }
            updatePaginationParams(l_CountryList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the countries. Contact your administrator."), 10000);
            return false;
        }
    });
}

//currency lookup model
var CurrencyListModel = function () {
    var self = this;


    self.RecordsList = ko.observableArray([]);
    self.selectedCurrencyName = ko.observable('');

    self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);

    var l_CurrencyNameFilterElement = document.getElementById("input_CurrencyNameFilter");
    var l_ConvertionRateFilterElement = document.getElementById("input_ConversionRateFilter");
    var l_CurrencyDescFilterElement = document.getElementById("input_currencyDescFilter");

    self.selectedCurrencyItemId = ko.observable('');

    self.selectCurrencyListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["Currency-id"]) {
            var l_itemId = iItem["Currency-id"].ItemId;
            self.selectedCurrencyItemId(l_itemId);
            self.selectedCurrencyName(getTextValue(iItem.Name));
        }
    }
    self.onCurrencyListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["Currency-id"]) {
            var l_itemId = iItem["Currency-id"].ItemId;
            self.selectedCurrencyItemId(l_itemId);
            self.selectedCurrencyName(getTextValue(iItem.Name));
        }
        event.stopPropagation();
    }
    self.ClearCurrencyListFilter = function () {
        l_CurrencyNameFilterElement.value = "";
        l_ConvertionRateFilterElement.value = "";
        l_CurrencyDescFilterElement.value = "";
    }
    self.getCurrencyListFilterObject = function () {
        self.CurrentFilterObject = {
            "currencyName": l_CurrencyNameFilterElement.value,
            "convertionRate": l_ConvertionRateFilterElement.value,
            "description": l_CurrencyDescFilterElement.value,
            "Status": "ACTIVE",
            "offset": listOffsetValue,
            "limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openCurrencySelectionModal() {
    $("#div_selectCurrencyModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ClearCurrencyListFilter();
    l_CurrencyList_model.currentPage('1');
    ListCurrencies();
    $('button#btn_selectCurrencyYes').off("click");
    $('button#btn_selectCurrencyYes').on('click', function (_event) {
        l_configPropDetails_model.defaultValue_CURRENCY({ "ItemId": l_CurrencyList_model.selectedCurrencyItemId(), "Name": l_CurrencyList_model.selectedCurrencyName() });
        l_configPropDetails_model.dirtyFlag(true);
    });

}
function clearCurrencySelection() {
    l_configPropDetails_model.defaultValue_CURRENCY("");
    l_configPropDetails_model.dirtyFlag(true);
}
function ClearCurrencyListFilter(event, iSrcElement) {
    l_CurrencyList_model.ClearCurrencyListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    l_CurrencyList_model.isFilterApplied(false);
    l_CurrencyList_model.currentPage('1');
    listOffsetValue = 0;
    ListCurrencies();
    hideCurrencyListFilter();
}
function hideCurrencyListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_CurrencyListData").removeClass("col-md-9");
    $("#div_CurrencyListData").addClass("col-md-12");
}
function ApplyFilterOnCurrencyList(event, iSrcElement) {
    if (document.getElementById("input_CurrencyNameFilter").value != "" || document.getElementById("input_ConversionRateFilter").value != "" || document.getElementById("input_currencyDescFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        l_CurrencyList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        l_CurrencyList_model.isFilterApplied(false);
    }
    l_CurrencyList_model.currentPage('1');
    listOffsetValue = 0;
    ListCurrencies();
    hideCurrencyListFilter();
}
function ListCurrencies(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
        method: "getCurrencieswithfilters",
        parameters: l_CurrencyList_model.getCurrencyListFilterObject(),
        success: function (data) {
            addDataToLookup(data.currencies.FindZ_INT_CurrencyListResponse.Currency, l_CurrencyList_model);
            if (undefined != data.currencies.FindZ_INT_CurrencyListResponse["@total"]) {
                l_CurrencyList_model.numOfRecords(data.currencies.FindZ_INT_CurrencyListResponse["@total"]);
            } else {
                l_CurrencyList_model.numOfRecords(0);
            }

            if (l_CurrencyList_model.numOfRecords() != 0) {
                l_CurrencyList_model.numOfPages(Math.ceil(l_CurrencyList_model.numOfRecords() / listLimitValue));
            } else {
                l_CurrencyList_model.numOfPages(1);
            }
            updatePaginationParams(l_CurrencyList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the countries. Contact your administrator."), 10000);
            return false;
        }
    });
}

//Contract term lookup
function openContractTermModal(attrData) {
    if ($('#ContractTermPreviewModel').css("display") == "none" && l_configPropDetails_model.defaultValue_PERPETUAL() == "false")
        $('#ContractTermPreviewModel').css("display", "block");
    else
        $('#ContractTermPreviewModel').css("display", "none");

    addDataToContractTermLookup();
    $('button#btn_contractTermYes').off("click");
    $('button#btn_contractTermYes').on('click', function (_event) {
        if ($("#input_contractTermMonths").val() != "" && $("#input_contractTermDays").val() != "") {
            l_configPropDetails_model.defaultValue_CONTRACTTERM($("#input_contractTermMonths").val() + " month(s), " + $("#input_contractTermDays").val() + " day(s)");
        }
        else if ($("#input_contractTermMonths").val() != "") {
            l_configPropDetails_model.defaultValue_CONTRACTTERM($("#input_contractTermMonths").val() + " month(s)");
        }
        else if ($("#input_contractTermDays").val() != "") {
            l_configPropDetails_model.defaultValue_CONTRACTTERM($("#input_contractTermDays").val() + " day(s)");
        }
        else {
            l_configPropDetails_model.defaultValue_CONTRACTTERM("");
        }
        $('#ContractTermPreviewModel').css("display", "none");
    });
}

function closeContractTermModal(attrData) {
    $('#ContractTermPreviewModel').css("display", "none");
}

function addDataToContractTermLookup() {
    var months = "";
    var days = "";
    if (l_configPropDetails_model.defaultValue_CONTRACTTERM() && l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf("month(s)") > 0) {
        months = l_configPropDetails_model.defaultValue_CONTRACTTERM().substring(0, l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf(" month(s)"))
    }
    if (l_configPropDetails_model.defaultValue_CONTRACTTERM() && l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf("day(s)") > 0) {
        if (months != "") {
            days = l_configPropDetails_model.defaultValue_CONTRACTTERM().substring(l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf("month(s), ") + "month(s), ".length, l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
        }
        else {
            days = l_configPropDetails_model.defaultValue_CONTRACTTERM().substring(0, l_configPropDetails_model.defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
        }
    }
    $("#input_contractTermMonths").val(months);
    $("#input_contractTermDays").val(days);
}

//common lookup functions
function updatePaginationParams(iModel) {

    if (iModel.currentPage() == 1) {
        $(".li_ListLeftNavigation").css("display", "none");
        $(".li_ListRightNavigation").css("display", "inline");
    }
    if (parseInt(iModel.numOfRecords()) <= parseInt(listLimitValue)) {
        iModel.currentPage('1');
        $('.li_ListLeftNavigation,.li_ListRightNavigation').css('display', 'none');
    }
}
function goToPreviousPage(iModel, listRecords) {
    if (iModel.currentPage() > 1) {
        listOffsetValue = parseInt(listOffsetValue) - parseInt(listLimitValue);
        iModel.currentPage(parseInt(iModel.currentPage()) - 1);
    }
    if (iModel.currentPage() < Math.ceil(iModel.numOfRecords() / listLimitValue)) {
        $(".li_ListRightNavigation").css("display", "inline");
        //document.getElementById("li_ListRightNavigation").style.removeProperty("display");
    }
    if (iModel.currentPage() == 1) {
        $(".li_ListLeftNavigation").css("display", "none");
    }
    if (iModel.currentPage() < 1)
        return;
    listRecords();
}
function goToNextPage(iModel, listRecords) {
    if (iModel.currentPage() < Math.ceil(iModel.numOfRecords() / listLimitValue)) {
        listOffsetValue = parseInt(listOffsetValue) + parseInt(listLimitValue);
        iModel.currentPage(isNaN(parseInt(iModel.currentPage())) ? 0 : parseInt(iModel.currentPage()));
        iModel.currentPage(parseInt(iModel.currentPage()) + 1);
    }
    if (iModel.currentPage() == Math.ceil(iModel.numOfRecords() / listLimitValue)) {
        $(".li_ListRightNavigation").css("display", "none");
    }
    if (iModel.currentPage() > 1) {
        $(".li_ListLeftNavigation").css("display", "inline");
        //document.getElementById("li_ListLeftNavigation").style.removeProperty("display");
    }
    listRecords();
}
function goToLastPage(iModel, listRecords) {
    listOffsetValue = (Math.ceil(iModel.numOfRecords() / listLimitValue) - 1) * listLimitValue;
    iModel.currentPage(Math.ceil(iModel.numOfRecords() / listLimitValue));
    $('.li_ListRightNavigation').css('display', 'none');
    $('.li_ListLeftNavigation').css('display', 'inline');
    listRecords();
}
function goToFirstPage(iModel, listRecords) {
    listOffsetValue = 0;
    iModel.currentPage('1');
    $('.li_ListRightNavigation').css('display', 'inline');
    $('.li_ListLeftNavigation').css('display', 'none');
    listRecords();
}
function addDataToLookup(iElementList, iModel) {
    iModel.RecordsList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.RecordsList.push(iElement);
            });
        }
        else {
            iModel.RecordsList.push(iElementList);
        }
    }
}


$(function () {
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/gc/htm/BasicComponents", i_locale);
    loadRTLIfRequired(i_locale, rtl_css);
    if (window.parent.parent) {
        var configProps = $('[src*="configProps.htm"]', window.parent.parent.document);
        if (configProps) {
            configProps.css('border', 'none');
        }
    }
    createToastDiv();
    l_configProps_model = new ConfigPropsModel();
    ko.applyBindings(l_configProps_model, document.getElementById("div_configPropsData"));
    l_configPropDetails_model = new ConfigPropDetailsModel();
    ko.applyBindings(l_configPropDetails_model, document.getElementById("div_createOrUpdateConfigModal"));
    l_OrgsList_model = new OrgsListModel();
    ko.applyBindings(l_OrgsList_model, document.getElementById("div_selectOrgModal"));
    l_CTRTypesList_model = new CTRTypesListModel();
    ko.applyBindings(l_CTRTypesList_model, document.getElementById("div_selectCTRTypeModal"));
    l_TemplatesList_model = new TemplatesListModel();
    ko.applyBindings(l_TemplatesList_model, document.getElementById("div_selectTemplateModal"));
    l_CountryList_model = new CountryListModel();
    ko.applyBindings(l_CountryList_model, document.getElementById("div_selectCountryModal"));
    l_CurrencyList_model = new CurrencyListModel();
    ko.applyBindings(l_CurrencyList_model, document.getElementById("div_selectCurrencyModal"));
    listConfigProps();

    $(".btn_filterList").click(function (iEventObject) {
        if ($(".div_ListFilter").attr('apps-toggle') == "expanded") {
            $(".div_ListFilter").toggle();
            $('.div_ListFilter').each(function () {
                $(this).attr('apps-toggle', 'collapsed');
            });
            //document.getElementsByClassName("div_ListFilter").setAttribute("apps-toggle", 'collapsed');
            $(".div_ListData").removeClass("col-md-9");
            $(".div_ListData").addClass("col-md-12");
        }
        else if ($(".div_ListFilter").attr('apps-toggle') == "collapsed") {
            $(".div_ListFilter").toggle();
            //setTimeout(function () { $("#div_contractListFilter").toggle('slow'); }, 0);
            $('.div_ListFilter').each(function () {
                $(this).attr('apps-toggle', 'expanded');
            });
            //document.getElementsByClassName("div_ListFilter").setAttribute("apps-toggle", 'expanded');
            $(".div_ListData").removeClass("col-md-12");
            $(".div_ListData").addClass("col-md-9");
        }
    });
    $(".cc-filter-header").click(function (iEventObject) {
        var l_headerSpan = $(this)
        l_headerSpan.next().slideToggle();
        if (l_headerSpan.attr('apps-toggle') == "expanded") {
            hideOrShowContractsFilterContainerBody(l_headerSpan[0], false);
        }
        else if (l_headerSpan.attr('apps-toggle') == "collapsed") {
            hideOrShowContractsFilterContainerBody(l_headerSpan[0], true);
        }
    });
});