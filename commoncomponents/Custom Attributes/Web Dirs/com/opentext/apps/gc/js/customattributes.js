$.cordys.json.defaults.removeNamespacePrefix = true;
var l_customAttributes_model;
var l_customAttributesFilter_model;
var l_contractTypes_model;
var customAttributesOffsetValue = 0;
var customAttributesLimitValue = 25;
var customAttributes_is_last_page_clicked = 0;
var customAttributes_is_first_page_clicked = 0;
var selectedCustomAttributesMap = {};
var defaultIDforSelectDropdown = "";
const DATA_TYPE_BOOLEAN = "BOOLEAN";
const DATA_TYPE_NUMBER = "NUMBER";
const DATA_TYPE_TEXT = "TEXT";
const DATA_TYPE_DATE = "DATE";
const DATA_TYPE_ENUM = "ENUM";
var CustomAttributesListModel = function () {
    var self = this;
    self.CustomAttributes = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalCustomAttributesCount = ko.observable('');
    self.totalCurrentPageCustomAttributesCount = ko.observable('');
    self.totalCustomAttributesPageCount = ko.observable('');

    self.selectedIndex = ko.observable();
    // Flags
    self.isMoreDetailsOpen = ko.observable(true);

    // Selecting task.
    self.selectAttribute = function (index) {
        self.selectedIndex(index);
        //updateMandatoryConditions(getTaskOrder(self));
        // Open more details.
        l_customAttributes_model.isMoreDetailsOpen(true);
    };

    self.editCustomAttribute = function (index, iItem) {
        if (iItem.id && !iItem.isNewlyCreated && !iItem.isContractTypesLoaded) {
            getMappedContractTypes(iItem.id, self.CustomAttributes()[index]);
            iItem.isContractTypesLoaded = true;
        }
        $("#property_name").removeClass("cc-error");
        $("#property_datatype").removeClass("cc-error");
        $("#property_label").removeClass("cc-error");
        self.selectedIndex(index);
        l_customAttributes_model.isMoreDetailsOpen(true);
        self.CustomAttributes()[index].isEditable(true);
        // $("#btn_addNewAtrribute").prop("disabled", true);
    }

    self.confirmDeleteCustomAttributes = function (iItem, event) {
        if (iItem.id && !iItem.isNewlyCreated) {
            callDeleteCustomAttributes(iItem.id);
        } else {
            self.CustomAttributes.remove(iItem);
            $("#btn_addNewAtrribute").prop("disabled", false);
        }
        event.stopPropagation();
    }

    self.openMapContractTypes = function (iItem, event) {
        if (self.selectedIndex() >= 0 && self.CustomAttributes() && self.CustomAttributes()[self.selectedIndex()]) {
            var selectedAttribute = self.CustomAttributes()[self.selectedIndex()];
            openContractTypes(selectedAttribute);
        }
    }

    self.addNewCustomAttribute = function () {
        newCustomAttribute = new CustomAttributeModel();
        newCustomAttribute.isEditable(true);
        newCustomAttribute.isDirty(true);
        newCustomAttribute.isNewlyCreated = true;
        self.CustomAttributes.unshift(newCustomAttribute);
        self.selectedIndex(0);
        l_customAttributes_model.isMoreDetailsOpen(true);
        $("#btn_addNewAtrribute").prop("disabled", true);
    }

    self.saveAttribute = function () {
        if (self.selectedIndex() >= 0 && self.CustomAttributes() && self.CustomAttributes()[self.selectedIndex()]) {
            var selectedAttribute = self.CustomAttributes()[self.selectedIndex()];
            var newValuesAdded = false;
            selectedAttribute.selectOptions().forEach(e => !e.id1 ? (newValuesAdded = true) : false);
            if (selectedAttribute.isNewlyCreated && !selectedAttribute.id) {
                saveNewAttribute(selectedAttribute);
            } else {
                updateAttributeValues(selectedAttribute);
            }
        }
    }

    self.cancelSaveOREdit = function () {
        // self.isMoreDetailsOpen(false);
        self.selectedIndex(null);
        $("#btn_addNewAtrribute").prop("disabled", false);
        if (l_customAttributes_model.CustomAttributes()[0].isNewlyCreated == true) {
            l_customAttributes_model.CustomAttributes.splice(0, 1);
        }
    }

    self.updateMetadataFlag = function () {
        self.CustomAttributes()[self.selectedIndex()].isMetadataUpdated = true
        self.CustomAttributes()[self.selectedIndex()].isDirty(true);
    }

    self.updateLabelChangeFlag = function () {
        self.CustomAttributes()[self.selectedIndex()].isLabelUpdated = true
        self.CustomAttributes()[self.selectedIndex()].isDirty(true);
    }
}

var EnumModel = function () {
    var self = this;
    self.optionOrder = ko.observable('');
    self.optionId = ko.observable('');
    self.optionValue = ko.observable('');


}


var CustomAttributesFilterModel = function () {
    var self = this;
    var l_labelFilterField = document.getElementById("filter_customAttributesLabel");
    var l_inputTypeFilterField = document.getElementById("filter_customAttributesInputType");
    self.ClearFilter = function () {
        l_labelFilterField.value = "";
        l_inputTypeFilterField.value = "";
    }
    self.getFilterObject = function () {
        self.CurrentFilterObject = {
            "label": l_labelFilterField.value,
            "datatype": l_inputTypeFilterField.value,
            "offset": customAttributesOffsetValue,
            "limit": customAttributesLimitValue,
        };
        return self.CurrentFilterObject;
    }
}

var CustomAttributeModel = function () {
    var self = this;

    self.id = null;

    // Attribute properties.
    self.name = ko.observable("");
    self.label = ko.observable("");
    self.labelid = "";
    self.dataType = ko.observable("");
    self.attributeMedadata = "";
    self.dateFormat = ko.observable("");
    self.selectOptions = ko.observableArray([]);
    self.selectDeletedOptions = ko.observableArray([]);
    self.initialClonedCTRTypes = [];
    self.oldEnumValues = [];
    self.ContractTypes = ko.observableArray([]);
    self.enumValues = ko.observableArray([]);

    self.deletedEnumValues = ko.observable([]);
    self.allOptions = ko.observable([]);

    // Flags to handle
    self.isNewlyCreated = false;
    self.isMetadataUpdated = false;
    self.isLabelUpdated = false;
    self.isContractTypesLoaded = false;

    self.allowDecimal = ko.observable(false);
    self.isEditable = ko.observable(false);
    self.isDirty = ko.observable(false);

    //behavior.
    self.addIntoSelectOptions = function () {
        var option = $("#datatype_dropdown_option").val();
        if (option) {
            option = option.trim();
            var existedItem = false;
            for (var i = 0; i < self.selectOptions().length; i++) {
                if (option == self.selectOptions()[i].option) {
                    existedItem = true;
                    break;
                }
            }
            if (!existedItem && self.selectOptions().length < 100) {
                var optionObject = {};
                if (self.id) {
                    optionObject.id = self.id;
                }
                optionObject.option = option;
                optionObject.order = self.selectOptions().length + 1;
                self.selectOptions.push(optionObject);
                self.isMetadataUpdated = true;
                self.isDirty(true);
            }
        }
        $("#datatype_dropdown_option").val("");
    }

    self.removeOption = function (option) {
        //CHANGE
        if (option) {
            var rmIndex = self.selectOptions().indexOf(option);
            self.selectDeletedOptions.push(option);
            self.selectOptions.remove(option);
            for (let index = rmIndex; index < self.selectOptions().length; index++) {
                self.selectOptions()[index].order = index + 1;
            }
            self.isMetadataUpdated = true;
            self.isDirty(true);
        }
        //Update order

        self.selectOptions().forEach(function (option) {

        });
    }

    self.allowDecimalCheckboxChanged = function (iItem, event) {
        if ($(event.currentTarget).hasClass("cc-checkbox-on")) {
            self.allowDecimal(false);
            self.isMetadataUpdated = true;
            self.isDirty(true);
        }
        else if ($(event.currentTarget).hasClass("cc-checkbox-off")) {
            self.allowDecimal(true);
            self.isMetadataUpdated = true;
            self.isDirty(true);

        }
        event.stopPropagation();
    }

    self.removefromMappedTypes = function (i_type) {
        if (i_type) {
            self.ContractTypes.remove(i_type);
            self.mappingsUpdated = true;
            self.isDirty(true);
        }
    }

    self.removefromEnum = function (i_val) {
        if (i_type) {
            self.enumValues.remove(i_val);
            self.enumUpdated = true;
            self.isDirty(true);
        }
    }
}

var ContractTypesModel = function () {
    var self = this;

    // Observables.
    self.ContractTypesList = ko.observableArray([]);
    self.ContractTypesSelectedList = ko.observableArray([]);

    // Computed observables.
    self.selectedAll = ko.pureComputed({
        read: function () {
            return self.ContractTypesSelectedList().length === self.ContractTypesList().length;
        },
        write: function (value) {
            self.ContractTypesSelectedList(value ? self.ContractTypesList().slice(0) : []);
        },
        owner: self
    });

    // Behaviour methods.
    self.mapContractTypestoAttribute = function () {
        updateContractTypeMapping(self.ContractTypesSelectedList());
        l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()].isDirty(true);
        l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()].isMappingsUpdated = true;
    };
    self.clearContractTypesModalData = function () {
        self.cardIndex = 0;
        self.ContractTypesSelectedList.removeAll();
        $("#id_contractTypesSearchElement").val("");
        l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()].isDirty(true);
        l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()].isMappingsUpdated = true;
    }
    self.removeItemFromSelectedList = function () {
        self.ContractTypesSelectedList.remove(this);
        l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()].isDirty(true);
        l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()].isMappingsUpdated = true;
    }
}

$(function () {
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/CustomAttributes/CustomAttributes", i_locale);
    loadRTLIfRequired(i_locale, rtl_css);

    if (window.parent.parent) {
        customAttributesFrame = $('[src*="customattributes.htm"]', window.parent.parent.document);
        if (customAttributesFrame) {
            customAttributesFrame.css('border', 'none');
        }
    }

    createToastDiv();
    l_customAttributes_model = new CustomAttributesListModel();
    ko.applyBindings(l_customAttributes_model, document.getElementById("id_customAttributesData"));
    l_customAttributesFilter_model = new CustomAttributesFilterModel();
    ko.applyBindings(l_customAttributesFilter_model, document.getElementById("filter_panel_body"));
    l_contractTypes_model = new ContractTypesModel();
    ko.applyBindings(l_contractTypes_model, document.getElementById("div_contractTypesDialog"));

    hideFilter();
    ListAllCustomAttributes();

    $("#id_filterCustomAttributes").click(function (iEventObject) {
        if ($("#id_customAttributesFilter").attr('apps-toggle') == "expanded") {
            $("#id_customAttributesFilter").toggle();
            document.getElementById("id_customAttributesFilter").setAttribute("apps-toggle", 'collapsed');
            $("#id_customAttributesData").removeClass("col-md-9");
            $("#id_customAttributesData").addClass("col-md-12");
        }
        else if ($("#id_customAttributesFilter").attr('apps-toggle') == "collapsed") {
            $("#id_customAttributesFilter").toggle();
            //setTimeout(function () { $("#id_customAttributesFilter").toggle('slow'); }, 0);
            document.getElementById("id_customAttributesFilter").setAttribute("apps-toggle", 'expanded');
            $("#id_customAttributesData").removeClass("col-md-12");
            $("#id_customAttributesData").addClass("col-md-9");
        }
    });
    $("#id_cancelFilter").click(function (iEventObject) {
        hideFilter();
    });
    $(".cc-filter-header").click(function (iEventObject) {
        var l_headerSpan = $(this)
        $(this).next().slideToggle();
        if ($(this).attr('apps-toggle') == "expanded") {
            hideOrShowFilterBody($(this)[0], false);
        }
        else if ($(this).attr('apps-toggle') == "collapsed") {
            hideOrShowFilterBody($(this)[0], true);
        }
    });
    $('.toggle-btn-checkbox').click(function () {
        var mainParent = $(this).parent('.toggle-btn');
        if ($(mainParent).find('input.toggle-btn-checkbox').is(':checked')) {
            $(mainParent).addClass('active');
        } else {
            $(mainParent).removeClass('active');
        }
    });
});

function getMappedContractTypes(i_ID, i_attributeObj) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
        method: "GetCTRtypesforAttribute",
        parameters:
        {
            "attrDefID": i_ID
        },
        success: function (data) {
            if (data && data.FindZ_INT_TypeAttrMappingResponse) {
                var iElementList = data.FindZ_INT_TypeAttrMappingResponse.AttributeMapping;
                if (iElementList) {
                    var index = 0;
                    if (iElementList.length) {
                        iElementList.forEach(function (iElement) {
                            var l_ctrTypeObj = {};
                            l_ctrTypeObj.id = iElement.RelatedAttributeConfig.RelatedType["GCType-id"].Id;
                            l_ctrTypeObj.displayName = getTextValue(iElement.RelatedAttributeConfig.RelatedType.Name);
                            l_ctrTypeObj.Name = getTextValue(iElement.RelatedAttributeConfig.RelatedType.Name);
                            l_ctrTypeObj.Description = getTextValue(iElement.RelatedAttributeConfig.RelatedType.Description);
                            i_attributeObj.ContractTypes.push(l_ctrTypeObj);
                            i_attributeObj.initialClonedCTRTypes[index++] = l_ctrTypeObj.id;
                        });
                    }
                    else {
                        var l_ctrTypeObj = {};
                        l_ctrTypeObj.id = iElementList.RelatedAttributeConfig.RelatedType["GCType-id"].Id;
                        l_ctrTypeObj.displayName = getTextValue(iElementList.RelatedAttributeConfig.RelatedType.Name);
                        l_ctrTypeObj.Name = getTextValue(iElementList.RelatedAttributeConfig.RelatedType.Name);
                        l_ctrTypeObj.Description = getTextValue(iElementList.RelatedAttributeConfig.RelatedType.Description);
                        i_attributeObj.ContractTypes.push(l_ctrTypeObj);
                        i_attributeObj.initialClonedCTRTypes[index++] = l_ctrTypeObj.id;
                    }
                }
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while loading the mapped contract types. Contact your administrator."), 10000);
            return false;
        }
    });
}

function compareOptionsOrder(a, b) {
    if (parseInt(a.order) < parseInt(b.order)) {
        return -1;
    }
    if (parseInt(a.order) > parseInt(b.order)) {
        return 1;
    }
    return 0;
}

function getEnumValues(attributeId, l_model) {
    var dropdown = [];
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextCustomAttributes/AttributeDefinition/operations",
        method: "GetRelatedEnums",
        parameters: {
            "AttributeDefinition-id": {
                "Id": attributeId
            }
        },
        success: function (data) {
            if (data && data.RelatedEnums) {
                var iElementList = data.RelatedEnums;
                if (iElementList) {
                    var index = 0;
                    if (iElementList.length) {
                        iElementList.forEach(function (iElement) {
                            var l_EnumObj = {};
                            l_EnumObj.id = iElement["RelatedEnums-id"].Id;
                            l_EnumObj.id1 = iElement["RelatedEnums-id"].Id1;
                            l_EnumObj.option = getTextValue(iElement.enumvalue);
                            l_EnumObj.order = getTextValue(iElement.order);
                            dropdown.push(l_EnumObj);
                        });
                    }
                    else {
                        var l_EnumObj = {};
                        l_EnumObj.id = iElementList["RelatedEnums-id"].Id;
                        l_EnumObj.id1 = iElementList["RelatedEnums-id"].Id1;
                        l_EnumObj.option = getTextValue(iElementList.enumvalue);
                        l_EnumObj.order = getTextValue(iElementList.order);
                        dropdown.push(l_EnumObj);
                    }
                    dropdown = dropdown.sort(compareOptionsOrder);
                    if (dropdown.length > 0) {
                        dropdown.forEach(e => {
                            l_model.selectOptions.push(e)
                        });
                    }
                }
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while loading Enum values. Contact your administrator."), 10000);
            return false;
        }
    });
}

function addDataCustomAttributesToView(iElementList, iModel) {
    //Clear old values.
    //iModel.isMoreDetailsOpen(false);
    iModel.selectedIndex(null);
    iModel.CustomAttributes.removeAll();

    if (iElementList) {
        if (iElementList.length) {
            iModel.totalCurrentPageCustomAttributesCount(iElementList.length);
            iElementList.forEach(function (iElement) {
                customAttributeModel = formCustomAttributeModel(iElement);
                iModel.CustomAttributes.push(customAttributeModel);
            });
        }
        else {
            iModel.totalCurrentPageCustomAttributesCount("1");
            customAttributeModel = formCustomAttributeModel(iElementList);
            iModel.CustomAttributes.push(customAttributeModel);
        }
    }
}

function formCustomAttributeModel(iElement) {
    var customAttributeModel = null;
    customAttributeModel = new CustomAttributeModel();
    if (iElement) {
        if (iElement['AttributeDefinition-id']) {
            customAttributeModel.id = iElement['AttributeDefinition-id'].Id;
        }
        customAttributeModel.name(iElement.Name);
        customAttributeModel.label(getTextValue(iElement.RelatedLabel.Label));
        customAttributeModel.labelid = iElement.RelatedLabel["GCLabel-id"].Id;
        customAttributeModel.dataType(iElement.DataType);
        customAttributeModel.attributeMedadata = iElement.AttributeMetaData;
        readMetaDataJSONAndFillModel(customAttributeModel);
    }
    return customAttributeModel;
}

function callDeleteCustomAttributes(i_ID) {
    $("#deleteCustomAttributesModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $('button#deleteCustomAttributesYes').off("click");
    $('button#deleteCustomAttributesYes').on('click', function (_event) {
        deleteCustomAttributes(i_ID);
    });
}

function deleteCustomAttributes(i_ID) {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextCustomAttributes/AttributeDefinition/operations",
        method: "DeleteAttributeDefinition",
        parameters:
        {
            "AttributeDefinition-id": { "Id": i_ID },
        },
        success: function (data) {
            successToast(3000, getTranslationMessage("Custom attribute deleted"));
            ListAllCustomAttributes();
        },
        error: function (responseFailure) {
            var errorMsg = "";
            if (responseFailure.responseJSON.faultstring) {
                errorMsg = getTranslationMessage(getTextValue(responseFailure.responseJSON.faultstring));
            }
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("Unable to delete the custom attribute.") + " " + errorMsg, 10000);
            return false;
        }
    });
}

function ListAllCustomAttributes() {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
        method: "GetCustAttrWithFilters",
        parameters: l_customAttributesFilter_model.getFilterObject(),
        success: function (data) {
            if (data && data.FindZ_INT_CustAttrListResponse) {
                $("#btn_addNewAtrribute").prop("disabled", false);
                addDataCustomAttributesToView(data.FindZ_INT_CustAttrListResponse.AttributeDefinition, l_customAttributes_model);
                if (undefined != data.FindZ_INT_CustAttrListResponse["@total"]) {
                    l_customAttributes_model.totalCustomAttributesCount(data.FindZ_INT_CustAttrListResponse["@total"]);
                } else {
                    l_customAttributes_model.totalCustomAttributesCount(0);
                }
                if (l_customAttributes_model.totalCustomAttributesCount() != 0) {
                    l_customAttributes_model.totalCustomAttributesPageCount(Math.ceil(l_customAttributes_model.totalCustomAttributesCount() / customAttributesLimitValue));
                } else {
                    l_customAttributes_model.totalCustomAttributesPageCount(1);
                }
                updatePaginationParams();
                //l_customAttributes_model.cancelSaveOREdit();
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while loading the custom attributes. Contact your administrator."), 10000);
            return false;
        }
    });
}

function updatePaginationParams() {
    if (l_customAttributes_model.currentPage() == 1) {
        document.getElementById("li_customAttrListLeftNavigation").style.display = "none";
        document.getElementById("li_customAttrListRightNavigation").style.display = "inline";
    }
    if (parseInt(l_customAttributes_model.totalCustomAttributesCount()) <= parseInt(customAttributesLimitValue)) {
        l_customAttributes_model.currentPage('1');
        $('#li_customAttrListLeftNavigation,#li_customAttrListRightNavigation').css('display', 'none');
    }
}

function goToPreviousPage() {
    if (l_customAttributes_model.currentPage() > 1) {
        customAttributesOffsetValue = parseInt(customAttributesOffsetValue) - parseInt(customAttributesLimitValue);
        l_customAttributes_model.currentPage(parseInt(l_customAttributes_model.currentPage()) - 1);
    }
    if (l_customAttributes_model.currentPage() < Math.ceil(l_customAttributes_model.totalCustomAttributesCount() / customAttributesLimitValue)) {
        document.getElementById("li_customAttrListRightNavigation").style.removeProperty("display");
    }
    if (l_customAttributes_model.currentPage() == 1) {
        document.getElementById("li_customAttrListLeftNavigation").style.display = "none";
    }
    if (l_customAttributes_model.currentPage() < 1)
        return;
    ListAllCustomAttributes();
}

function goToNextPage() {
    if (l_customAttributes_model.currentPage() < Math.ceil(l_customAttributes_model.totalCustomAttributesCount() / customAttributesLimitValue)) {
        customAttributesOffsetValue = parseInt(customAttributesOffsetValue) + parseInt(customAttributesLimitValue);
        l_customAttributes_model.currentPage(isNaN(parseInt(l_customAttributes_model.currentPage())) ? 0 : parseInt(l_customAttributes_model.currentPage()));
        l_customAttributes_model.currentPage(parseInt(l_customAttributes_model.currentPage()) + 1);
    }
    if (l_customAttributes_model.currentPage() == Math.ceil(l_customAttributes_model.totalCustomAttributesCount() / customAttributesLimitValue)) {
        document.getElementById("li_customAttrListRightNavigation").style.display = "none";
    }
    if (l_customAttributes_model.currentPage() > 1) {
        document.getElementById("li_customAttrListLeftNavigation").style.removeProperty("display");
    }
    ListAllCustomAttributes();
}

function goToLastPage() {
    customAttributesOffsetValue = (Math.ceil(l_customAttributes_model.totalCustomAttributesCount() / customAttributesLimitValue) - 1) * customAttributesLimitValue;
    l_customAttributes_model.currentPage(Math.ceil(l_customAttributes_model.totalCustomAttributesCount() / customAttributesLimitValue));
    $('#li_customAttrListRightNavigation').css('display', 'none');
    $('#li_customAttrListLeftNavigation').css('display', 'inline');
    ListAllCustomAttributes();
}

function goToFirstPage() {
    customAttributesOffsetValue = 0;
    l_customAttributes_model.currentPage('1');
    $('#li_customAttrListRightNavigation').css('display', 'inline');
    $('#li_customAttrListLeftNavigation').css('display', 'none');
    ListAllCustomAttributes()
}

function updateLimitValue(iElement) {
    customAttributesOffsetValue = 0;
    l_customAttributes_model.currentPage('1');
    customAttributesLimitValue = $(iElement).val();
    ListAllCustomAttributes();
}

function ApplyFilter(event, iSrcElement) {
    ListAllCustomAttributes();
    if (document.getElementById("filter_customAttributesLabel").value != "" || document.getElementById("filter_customAttributesInputType").value != "") {
        $("#id_clearFilterActionBar").css('display', 'inline');
    } else {
        $("#id_clearFilterActionBar").css('display', 'none');
    }
    hideFilter();
}

function ClearFilter(event, iSrcElement) {
    l_customAttributesFilter_model.ClearFilter();
    ListAllCustomAttributes();
    $("#id_clearFilterActionBar").css('display', 'none');
    hideFilter();
}

function hideFilter() {
    $("#id_customAttributesFilter").hide();
    document.getElementById("id_customAttributesFilter").setAttribute("apps-toggle", 'collapsed');
    $("#id_customAttributesData").removeClass("col-md-9");
    $("#id_customAttributesData").addClass("col-md-12");
}

function validateMandatoryFields(i_attribute) {
    var validationFlag = true;
	var specialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
	var startingWithNumber = /^\d/;
    if (i_attribute.name() == "" || i_attribute.name() == undefined) {
        $("#property_name").addClass("cc-error");
        validationFlag = false;
		
    }else if(i_attribute.name().match(specialChars)){
		$("#property_name").addClass("cc-error");
		validationFlag = false;
		showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Name must be composed of letters, numbers, underscores."), 10000);
	}
	else if(i_attribute.name().match(startingWithNumber)){
		$("#property_name").addClass("cc-error");
		validationFlag = false;
		showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Names must begin with letter or an underscore"), 10000);
	}
	
    if (i_attribute.dataType() == "" || i_attribute.dataType() == undefined) {
        $("#property_datatype").addClass("cc-error");
        validationFlag = false;
    }
    if (i_attribute.label() == "" || i_attribute.label() == undefined) {
        $("#property_label").addClass("cc-error");
        validationFlag = false;
    }

    if (i_attribute.dataType() == DATA_TYPE_ENUM && i_attribute.selectOptions().length < 1) {
        $("#datatype_dropdown_option").addClass("cc-error");
        validationFlag = false;
    }
    return validationFlag;
}

function removeErrorClass(iEvent) {
    $(iEvent).removeClass("cc-error");
}

function hideOrShowFilterBody(iElement, iShow) {
    if (iShow) {
        iElement.setAttribute("apps-toggle", 'expanded');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_up.svg";
    }
    else {
        iElement.setAttribute("apps-toggle", 'collapsed');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_down.svg";
    }
}

function formMetaDataInJSONFormat(model) {
    if (model) {
        var metaDataObj = {};
        switch (model.dataType()) {
            case DATA_TYPE_BOOLEAN:
                break;
            case DATA_TYPE_NUMBER:
                metaDataObj.decimal = model.allowDecimal();
                break;
            case DATA_TYPE_TEXT:
                break;
            case DATA_TYPE_DATE:
                metaDataObj.dateformat = model.dateFormat();
                break;
            case DATA_TYPE_ENUM:
                metaDataObj.dropdown = {};
                metaDataObj.dropdown.options = model.selectOptions();
                break;
        }
        model.attributeMedadata = JSON.stringify(metaDataObj);
    }
}

function readMetaDataJSONAndFillModel(model) {
    if (model && model.attributeMedadata) {
        var metaDataObj = JSON.parse(model.attributeMedadata);
        switch (model.dataType()) {
            case DATA_TYPE_BOOLEAN:
                break;
            case DATA_TYPE_NUMBER:
                model.allowDecimal(metaDataObj.decimal);
                break;
            case DATA_TYPE_TEXT:
                break;
            case DATA_TYPE_DATE:
                model.dateFormat(metaDataObj.dateformat);
                break;
            case DATA_TYPE_ENUM:
                //CHANGE
                getEnumValues(model.id, model);
                //model.oldEnumValues = allOptions;
                //model.selectOptions = ko.observableArray(allOptions);

                //EnumValues observable
                break;
        }
    }

    //Future values.
    // model.defaultValue = metaDataObj.defaultvalue;
    // model.defaultSelectedOption = metaDataObj.dropdown.defaultoption;
    // model.minLength = metaDataObj.validations.minLength;
    // model.maxLength = metaDataObj.validations.maxLength;
    // model.regex = metaDataObj.validations.regex;
}

function saveNewAttribute(attribute) {
    if (attribute && attribute.isNewlyCreated && validateMandatoryFields(attribute)) {
        var requestObj = formSaveAttributeObject(attribute);
        if (requestObj) {
            $.cordys.ajax({
                method: "CreateAttributeWithMappings",
                namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
                parameters: requestObj,
                success: function (responseSuccess) {
                    if (responseSuccess) {
                        successToast(3000, getTranslationMessage("Custom attribute created"));
                        ListAllCustomAttributes();
                    } else {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the custom attribute. Contact your administrator."), 10000);
                    }
                },
                error: function (responseFailure) {
                    if (responseFailure.responseText.includes("NAME_UNIQUE_ERROR")) {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("The attribute with the name '" + requestObj.name + "' already exists."), 10000);
                    }
                    else {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the custom attribute. Contact your administrator."), 10000);
                    }
                    return false;
                }
            });
        }
    }
}

function updateAttributeValues(attribute) {
    if (attribute && attribute.id && validateMandatoryFields(attribute)) {
        var requestObj = formSaveAttributeObject(attribute);
        if (requestObj) {
            $.cordys.ajax({
                method: "UpdateAttributeWithMappings",
                namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
                parameters: requestObj,
                success: function (responseSuccess) {
                    if (responseSuccess) {
                        successToast(3000, getTranslationMessage("Custom attribute updated"));
                        ListAllCustomAttributes();
                    } else {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating the custom attribute. Contact your administrator."), 10000);
                    }
                },
                error: function (responseFailure) {
                    showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating the custom attribute. Contact your administrator."), 10000);
                    return false;
                }
            });
        }
    }
}

function formSaveAttributeObject(attribute) {
    var requestObj = {};
    if (attribute) {
        if (!attribute.isNewlyCreated && attribute.id) {
            requestObj.id = attribute.id;
            requestObj.labelUpdate = (attribute.isLabelUpdated) ? "true" : "false";
            requestObj.metaDataUpdate = (attribute.isMetadataUpdated) ? "true" : "false";
            requestObj.labelid = attribute.labelid;
            requestObj.mappingsUpdated = (attribute.isMappingsUpdated) ? "true" : "false";
            requestObj.mappings = {};
            requestObj.mappings.newCTRTypeMappings = getNewCTRTypeMappings(attribute.initialClonedCTRTypes, attribute.ContractTypes());
            requestObj.mappings.deletedCTRTypeMappings = getDeletedCTRTypeMappings(attribute.initialClonedCTRTypes, attribute.ContractTypes());

            requestObj.dropdownOptions = {};
            requestObj.dropdownOptions.newDropDownOptions = getNewOptions(attribute.selectOptions());
            requestObj.dropdownOptions.deletedDropDownOptions = getDeletedOptions(attribute.selectDeletedOptions());


        } else {
            requestObj.name = attribute.name();
            requestObj.datatype = attribute.dataType();
            requestObj.mappings = {};
            requestObj.mappings.newCTRTypeMappings = getNewCTRTypeMappings(attribute.initialClonedCTRTypes, attribute.ContractTypes())
            requestObj.dropdownOptions = getEnums(attribute);
        }
        requestObj.label = attribute.label();
        formMetaDataInJSONFormat(attribute);
        attribute.selectOptions();
        requestObj.attributemetadata = attribute.attributeMedadata;
        //requestObj.dropdownOptions = getEnums(attribute);
    }
    return requestObj;
}

function getNewCTRTypeMappings(i_oldMappings, i_newMappings) {
    var l_mappings = {}
    l_mappings.CTRType = [];
    if (i_newMappings.length) {
        i_newMappings.forEach(function (i_mapping) {
            if (!(i_oldMappings.includes(i_mapping.id))) {
                var l_ctrType = {};
                l_ctrType.CTRTypeID = i_mapping.id;
                l_mappings.CTRType.push(l_ctrType);
            }
        });
    }
    return l_mappings;
}

function getEnums(attribute) {
    var l_options = {};
    l_options["RelatedEnums-create"] = [];
    attribute.selectOptions().forEach(function (val) {
        var l_value = {};
        l_value.enumvalue = val.option;
        l_value.enumlabel = val.option;
        l_value.order = val.order;
        l_options["RelatedEnums-create"].push(l_value);
    })
    return l_options;
}

function getDeletedCTRTypeMappings(i_oldMappings, i_newMappings) {
    var l_mappings = {}
    l_mappings.CTRType = [];
    if (i_oldMappings.length) {
        i_oldMappings.forEach(function (i_mapping) {
            if (i_newMappings.length > 0) {
                var findFlag = false;
                for (var i = 0; i < i_newMappings.length; i++) {
                    if (i_newMappings[i].id == i_mapping) {
                        findFlag = true;
                        break;
                    }
                }
                if (!findFlag) {
                    var l_ctrType = {};
                    l_ctrType.CTRTypeID = i_mapping;
                    l_mappings.CTRType.push(l_ctrType);
                }
            } else {
                var l_ctrType = {};
                l_ctrType.CTRTypeID = i_mapping;
                l_mappings.CTRType.push(l_ctrType);
            }
        });
    }
    return l_mappings;
}


function getDeletedOptions(i_newOptions) {
    var deletedOptions = {}
    deletedOptions.OldOptions = [];
    if (i_newOptions.length) {
        i_newOptions.forEach(function (i_option) {
            var l_option = {};
            l_option.enumID = i_option.id1;
            deletedOptions.OldOptions.push(l_option);
        });
    }
    return deletedOptions;
}

function getNewOptions(i_newOptions) {

    var l_newOptions = {}
    l_newOptions["RelatedEnums-create"] = [];
    if (i_newOptions.length) {
        i_newOptions.forEach(function (val) {
            if (!val.id1) {
                var l_value = {};
                l_value.order = val.order;
                l_value.enumvalue = val.option;
                l_value.enumlabel = val.option;
                l_newOptions["RelatedEnums-create"].push(l_value);
            }
        });
    }
    return l_newOptions;
}


function getDisplayValue(dataType) {
    var displayValue = "";
    if (dataType) {
        dataType = dataType.toUpperCase();
        if (dataType == DATA_TYPE_BOOLEAN) {
            displayValue = "Boolean";
        } else if (dataType == DATA_TYPE_NUMBER) {
            displayValue = "Number";
        } else if (dataType == DATA_TYPE_TEXT) {
            displayValue = "Text";
        } else if (dataType == DATA_TYPE_DATE) {
            displayValue = "Date";
        } else if (dataType == DATA_TYPE_ENUM) {
            displayValue = "Dropdown";
        }
    }
    return displayValue;
}

function openContractTypes(i_attributeObj) {
    $("#div_contractTypesDialog").modal();
    l_contractTypes_model.ContractTypesSelectedList.removeAll();
    for (var i = 0; i < i_attributeObj.ContractTypes().length; i++) {
        l_contractTypes_model.ContractTypesSelectedList.push(i_attributeObj.ContractTypes()[i]);
    }
    loadContractTypes();
}

// Contract types lookup.
function loadContractTypes() {
    if ($('#id_contractTypesSearchElement').val()) {
        searchElement = $('#id_contractTypesSearchElement').val();
    }
    else {
        searchElement = "";
    }
    ContractTypesModel = $.cordys.ajax(
        {
            namespace: "http://schemas/OpenTextBasicComponents/GCType/operations",
            method: "GetTypesbyName",
            parameters:
            {
                "contractTypeName": searchElement,
                "Cursor": {
                    '@xmlns': 'http://schemas.opentext.com/bps/entity/core',
                    '@offset': 0,
                    '@limit': 100
                }
            },
            success: function (data) {
                if (data) {
                    addDataToContractTypesView(data.GCType, l_contractTypes_model);
                }
            }
        });
}

function addDataToContractTypesView(iElementList, iModel) {
    iModel.ContractTypesList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            for (var i = 0; i < iElementList.length; i++) {
                var iElement = iElementList[i];
                var id = iElement['GCType-id'].Id;
                var foundElement = existsInArray(l_contractTypes_model.ContractTypesSelectedList(), id);
                if (foundElement) {
                    iModel.ContractTypesList.push(foundElement);
                } else {
                    iElement.id = id;
                    iElement.displayName = iElement.Name;
                    var l_ctrTypeObj = {};
                    l_ctrTypeObj.id = iElement['GCType-id'].Id;
                    l_ctrTypeObj.displayName = iElement.Name;
                    l_ctrTypeObj.Name = getTextValue(iElement.Name);
                    l_ctrTypeObj.Description = getTextValue(iElement.Description);
                    iModel.ContractTypesList.push(l_ctrTypeObj);
                }
            }
        }
        else {
            var id = iElementList['GCType-id'].Id;
            var foundElement = existsInArray(l_contractTypes_model.ContractTypesSelectedList(), id);
            if (foundElement) {
                iModel.ContractTypesList.push(foundElement);
            } else {
                iElementList.id = id;
                iElementList.displayName = iElementList.Name;
                var l_ctrTypeObj = {};
                l_ctrTypeObj.id = iElementList['GCType-id'].Id;
                l_ctrTypeObj.displayName = iElementList.Name;
                l_ctrTypeObj.Name = getTextValue(iElementList.Name);
                l_ctrTypeObj.Description = getTextValue(iElementList.Description);
                iModel.ContractTypesList.push(l_ctrTypeObj);
            }
        }
    }
}

// Return false is not exists. Return element if exists.
function existsInArray(array, id) {
    for (var _i = 0; _i < array.length; _i++) {
        if (array[_i].id == id) {
            return array[_i];
        }
    }
    return false;
}
function updateContractTypeMapping(selectedTypes) {
    var i_attributeObj = l_customAttributes_model.CustomAttributes()[l_customAttributes_model.selectedIndex()];
    i_attributeObj.ContractTypes.removeAll();
    if (selectedTypes) {
        for (var i = 0; i < selectedTypes.length; i++) {
            i_attributeObj.ContractTypes.push(selectedTypes[i]);
        }
    }
}