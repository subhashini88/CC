$.cordys.json.defaults.removeNamespacePrefix = true;
var l_contractSearch_model;
var l_contractSearchResults_model;
var contractProperties = {};
var operands = ["Equals", "Not equals", "Contains", "Empty", "Not empty"];
const attrType = ["GENERAL", "CUSTOM"];
const filterOperators = [
    { name: 'Equal to', value: 'EQUALTO', queryOp: '=', operandDataTypes: "ALL" },
    { name: 'Not equal to', value: 'NOTEQUALTO', queryOp: '!=', operandDataTypes: "ALL" },
    { name: 'Contains', value: 'CONTAINS', queryOp: 'LIKE', operandDataTypes: "TEXT;LONGTEXT;LOOKUP;" },
    { name: 'Not contains', value: 'NOTCONTAINS', queryOp: 'NOT LIKE', operandDataTypes: "" },
    { name: 'Empty', value: 'EMPTY', queryOp: 'IS NULL', operandDataTypes: "TEXT;LONGTEXT;ENUMERATEDTEXT;LOOKUP;ENUM;DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
    { name: 'Not empty', value: 'NOTEMPTY', queryOp: 'IS NOT NULL', operandDataTypes: "TEXT;LONGTEXT;ENUMERATEDTEXT;LOOKUP;ENUM;DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
    { name: 'Less than equal', value: 'LESSTHANEQUAL', queryOp: '<=', operandDataTypes: "DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
    { name: 'Greater than equal', value: 'GREATERTHANEQUAL', queryOp: '>=', operandDataTypes: "DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
];

const advancedFilterOperators = [
    { name: 'Equal to', value: '=', queryOp: '=', operandDataTypes: "ALL" },
    { name: 'Not equal to', value: '!=', queryOp: '!=', operandDataTypes: "ALL" },
    { name: 'Contains', value: 'CONTAINS', queryOp: 'LIKE', operandDataTypes: "TEXT;LONGTEXT;LOOKUP;" },
    { name: 'Not contains', value: 'NOTCONTAINS', queryOp: 'NOT LIKE', operandDataTypes: "" },
    { name: 'Empty', value: 'IS', queryOp: 'IS NULL', operandDataTypes: "TEXT;LONGTEXT;ENUMERATEDTEXT;LOOKUP;ENUM;DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
    { name: 'Not empty', value: 'IS', queryOp: 'IS NOT NULL', operandDataTypes: "TEXT;LONGTEXT;ENUMERATEDTEXT;LOOKUP;ENUM;DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
    { name: 'Less than equal', value: '<=', queryOp: '<=', operandDataTypes: "DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" },
    { name: 'Greater than equal', value: '>=', queryOp: '>=', operandDataTypes: "DATE;DECIMAL;DURATION;NUMBER;FLOAT;INTEGER;" }
];

const filterParamsPlaceholders = [
    { dataTypes: 'DECIMAL;FLOAT;INTEGER;NUMBER;DURATION;', placeholder: 'Enter a numeric value', errorText: 'Enter a numeric value.', typeCheck: 'NUMERIC' },
    { dataTypes: 'BOOLEAN', placeholder: 'Enter Yes or No', errorText: 'Enter Yes or No.', typeCheck: 'BOOLEAN' },
    { dataTypes: 'DATE', placeholder: 'Enter date (YYYY/MM/DD)', errorText: 'Enter a date in YYYY/MM/DD.', typeCheck: 'DATE' },
    { dataTypes: 'DEFAULT', placeholder: 'Enter text', errorText: 'Enter a value.', typeCheck: 'STRING' }
]

const advancedFilterTypecheck = [
    { dataTypes: 'DECIMAL;FLOAT;NUMBER;', errorText: 'Validation failed:- Enter valid numeric value for the property: ', typeCheck: 'NUMERIC' },
    { dataTypes: 'INTEGER', errorText: 'Validation failed:- Enter valid integer for the property: ', typeCheck: 'INTEGER' },
    { dataTypes: 'DURATION', errorText: 'Validation failed: Enter duration in months ( example "12M" for 12 months ) for the property: ', typeCheck: 'DURATION' },
    { dataTypes: 'BOOLEAN', errorText: 'Validation failed:- Boolean value can be "Yes" or "No" for the property: ', typeCheck: 'BOOLEAN' },
    { dataTypes: 'DATE', errorText: 'Validation failed:- Enter the date in the valid format as "YYYY/MM/DD" for the property: ', typeCheck: 'DATE' },
    { dataTypes: 'DEFAULT', errorText: 'Validation failed:- Enter valid text for the property: ', typeCheck: 'STRING' }
]

const paginationParams = [
    { name: '1 per page', value: 1 },
    { name: '10 per page', value: 10 },
    { name: '25 per page', value: 25 },
]

const numericDataTypes = ['DECIMAL', 'FLOAT', 'INTEGER', 'NUMBER'];
const noresultsInfoMsg = "No results found";
const searchInfoMsg = "Add search criteria to start a new search or use a saved/favorite search";

function changeAttrType() {

    var targetElement = event.currentTarget.firstElementChild
    var l_currentClassName = targetElement.className;
    if (l_currentClassName == "cc-select-column cc-radio-off") {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on").addClass("cc-radio-off");
        $(targetElement).removeClass("cc-radio-off")
        $(targetElement).addClass("cc-radio-on")
    }
    l_contractSearch_model.isGeneralAttrList(event.currentTarget.id == "div_generalAttr");
}

function changePreviewType() {

    var targetElement = event.currentTarget.firstElementChild
    var l_currentClassName = targetElement.className;
    if (l_currentClassName == "cc-select-column cc-radio-off") {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on").addClass("cc-radio-off");
        $(targetElement).removeClass("cc-radio-off");
        $(targetElement).addClass("cc-radio-on");
    }
    if (event.currentTarget.id == "div_ctrPreview") {
        l_contractDetails_model.isContractPreviewActive(true);
        $("#div_defaultDocPreview").addClass('hidden');
        $("#div_contractDetailsPreview").removeClass('hidden');
    }
    else if (event.currentTarget.id == "div_docpreview") {
        l_contractDetails_model.isContractPreviewActive(false);

        $("#div_contractDetailsPreview").addClass('hidden');
        $("#div_defaultDocPreview").removeClass('hidden');
    }
}

function addDataToContractsDetails(iElementList) {
    l_contractDetails_model.contractDetailsList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                l_contractDetails_model.contractDetailsList.push(iElement);
            });
        } else {
            l_contractDetails_model.contractDetailsList.push(iElementList);
        }
    }
}


function addDataToFilterParamLeftOperandLookup(iElementList, iModel) {
    iModel.generalAttrList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.generalAttrList.push(iElement);
            });
        } else {
            iModel.generalAttrList.push(iElementList);
        }
    }
}

function ListAllAttrs() {
    if (l_contractSearch_model.isGeneralAttrList()) {
        l_searchService.ListAllGenOperands(l_contractSearch_model, $("#input_SearchFilter").val());
    } else {
        l_searchService.ListAllCustOperands(l_contractSearch_model, $("#input_SearchFilter").val());
    }
}

function addDataToFilterParamCustAttrLeftOperandLookup(iElementList, iModel) {
    iModel.customAttrList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iElement.DataType = changeType(iElement.DataType);
                iModel.customAttrList.push(iElement);
            });
        }
        else {
            iElementList.DataType = changeType(iElementList.DataType);
            iModel.customAttrList.push(iElementList);
        }
    }

    function changeType(iType) {
        if (iType === "NUMBER") {
            return "DECIMAL";
        } else if (iType === "ENUM") {
            return "ENUMERATEDTEXT";
        } else {
            return iType;
        }
    }
}


function openFilterParamLeftOperandSelectionModal() {

    $("#div_selectFilterParamLeftOperandModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    l_searchService.ListAllGenOperands(l_contractSearch_model);
    l_searchService.ListAllCustOperands(l_contractSearch_model);

    $('button#btn_selectFilterParamLeftOperandYes').off("click");
    $('button#btn_selectFilterParamLeftOperandYes').on('click', function (_event) {
        if (document.getElementById("div_custAttr").children[0].classList.value.indexOf("cc-radio-off") > -1) {
            l_contractSearch_model.filterParamLeftOperandItemID(l_contractSearch_model.selectedFilterParamLeftOperandItemID());
            l_contractSearch_model.filterParamLeftOperandName(l_contractSearch_model.selectedFilterParamLeftOperandName());
            l_contractSearch_model.filterParamLeftOperandLabel(l_contractSearch_model.selectedFilterParamLeftOperandLabel());
            l_contractSearch_model.filterParamLeftOperandType(l_contractSearch_model.selectedFilterParamLeftOperandType());
            l_contractSearch_model.filterParamLeftOperandDataType(l_contractSearch_model.selectedFilterParamLeftOperandDataType());
            l_contractSearch_model.filterParamLeftOperandPath(l_contractSearch_model.selectedFilterParamLeftOperandPath());
            l_contractSearch_model.filterParamLeftOperandXpath(l_contractSearch_model.selectedFilterParamLeftOperandXpath());
            l_contractSearch_model.filterParamLeftOperandAttrType("GENERAL");
        } else {
            l_contractSearch_model.filterParamLeftOperandName(l_contractSearch_model.selectedFilterParamLeftOperCustomAttrName());
            l_contractSearch_model.filterParamLeftOperandLabel(l_contractSearch_model.selectedFilterParamLeftOperCustomAttrLabel());
            l_contractSearch_model.filterParamLeftOperandDataType(l_contractSearch_model.selectedFilterParamLeftOperCustomAttrType());
            l_contractSearch_model.filterParamLeftOperandPath('');
            l_contractSearch_model.filterParamLeftOperandXpath('');
            l_contractSearch_model.filterParamLeftOperandAttrType("CUSTOM");
        }

        l_contractSearch_model.filterParamSelectedOperator("");
        l_contractSearch_model.filterParamValue("");
        l_contractSearch_model.durationMonthValue("");
        l_contractSearch_model.durationDayValue("");

    });

}

function addDataToSavedSearchesView(iElementList, iModel) {
    iModel.allSavedSearches.removeAll();
    iModel.favoriteSearches.removeAll();

    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iElement.IsFavorite = iElement.IsFavorite === 'true';
                if (iElement.IsFavorite) {
                    iModel.favoriteSearches.push(iElement);
                }
                iModel.allSavedSearches.push(iElement);
            });
        }
        else {
            iElementList.IsFavorite = iElementList.IsFavorite === 'true';
            if (iElementList.IsFavorite) {
                iModel.favoriteSearches.push(iElementList);
            }
            iModel.allSavedSearches.push(iElementList);
        }
    }
}

var ContractSearchModel = function () {

    var self = this;
    self.savedSearchItemId = ko.observable('');
    self.generalAttrList = ko.observableArray([]);
    self.customAttrList = ko.observableArray([]);
    self.customModalSelectAttr = ko.observableArray([]);
    self.filtersAddedList = ko.observableArray([]);
    self.advancedSearchText = ko.observable('');
    self.enableBasicSearch = ko.observable(true);
    self.ADSearchError = ko.observable('');
    self.customSelectAttr = ko.observable();
    self.searchName = ko.observable('Untitled search');
    self.isFavoriteSearch = ko.observable();
    self.savedSearchName = ko.observable('');
    self.queryLogic = ko.observable('');
    self.newSearchName = ko.observable('');
    self.isGeneralAttrList = ko.observable(true);

    self.isEditMode = ko.observable(false);
    self.isDirty = ko.observable(false);
    self.addFilterAttempt = ko.observable(false);

    self.selectedSearchIndex = ko.observable(0);

    self.enableSearch = ko.observable(false);
    self.enableSave = ko.observable(false);

    self.filterOperandsList = ko.observableArray([]);
    self.modalcustomSelectAttr = ko.observable();
    self.modalcustomOpSelectAttr = ko.observable();

    self.visibleButtonOptions = ko.observable("hidden");
    self.selectedFilterParamLeftOperandItemID = ko.observable('');
    self.selectedFilterParamLeftOperandName = ko.observable('');
    self.selectedFilterParamLeftOperandLabel = ko.observable('');
    self.selectedFilterParamLeftOperandType = ko.observable('');
    self.selectedFilterParamLeftOperandDataType = ko.observable('');
    self.selectedFilterParamLeftOperandPath = ko.observable('');
    self.selectedFilterParamLeftOperandXpath = ko.observable('');

    self.filterParamLeftOperandAttrType = ko.observable('');
    self.filterParamLeftOperandXpath = ko.observable('');
    self.filterParamLeftOperandPath = ko.observable('');
    self.filterParamLeftOperandDataType = ko.observable('');
    self.filterParamLeftOperandType = ko.observable('');
    self.filterParamLeftOperandName = ko.observable('');
    self.filterParamLeftOperandLabel = ko.observable('');

    self.filterParamLeftOperandItemID = ko.observable('');
    self.selectedFilterParamLeftOperCustomAttrName = ko.observable('');
    self.selectedFilterParamLeftOperCustomAttrLabel = ko.observable('');

    self.selectedFilterParamLeftOperandAttrType = ko.observable(attrType[0]);
    self.filterParamLeftOperCustomAttrName = ko.observable('');
    self.filterParamLeftOperCustomAttrType = ko.observable('');
    self.selectedFilterParamLeftOperCustomAttrType = ko.observable('');

    self.filterParamValue = ko.observable('');
    self.durationMonthValue = ko.observable('');
    self.durationDayValue = ko.observable('');
    self.filterParamSelectedOperator = ko.observable('');

    self.filterParamLeftOperandErrorMsg = ko.observable('Select a value.');
    self.filterParamOperatorErrorMsg = ko.observable('Select a value.');
    self.filterParamValueErrorMsg = ko.observable('');
    self.filterParamPlaceholder = ko.observable('');
    self.partitionIndex = ko.observable(-1);
    self.searchClicked = ko.observable(false);

    function hideAddlFilters() {
        let partitionInd = -1;
        const chicklets = $('#div_filters .chicklet');

        if (chicklets.length) {
            const parentOffHeight = chicklets[0].offsetParent.offsetHeight;
            for (let i = 0; i < chicklets.length; i++) {
                if (chicklets[i].offsetTop >= parentOffHeight) {
                    partitionInd = i; break;
                }
            }
        }
        self.partitionIndex(partitionInd);
    }

    self.validateSearch = function () {
        if (!(this.searchName().length > 0)) {
            self.searchName('Untitled search');
        }
        return true;
    }

    self.clearSearches = function () {
        $('#id_addlFilters').css('display', 'none');
        self.filtersAddedList.removeAll();
        self.enableSave(false);
        self.partitionIndex(-1);
    }

    self.toggleAddlFilters = function (data, event) {
        const xPostion = $("#div_filters .more-button").position();
        if (xPostion) {
            $('#id_addlFilters').css("transform", `translate3d(${xPostion.left}px, -8px, 0px)`)
            $('#id_addlFilters').toggle();
        }
    }

    self.clearContractSearchModel = function () {
        self.enableSearch(false);
        self.enableSave(false);
        self.isDirty(false);
        self.searchName('Untitled search');
        self.visibleButtonOptions("hidden");
        self.isEditMode(false);
        self.savedSearchItemId('');
        self.isFavoriteSearch(false);
        self.filtersAddedList.removeAll();
    }

    self.clearContractSearchModelOnToggle = function () {
        if (self.savedSearchItemId().length < 1) {
            self.searchName('Untitled search');
            self.savedSearchItemId('');
            self.isFavoriteSearch(false);
            self.isEditMode(false);
        }
        self.enableSearch(false);
        self.enableSave(false);
        self.isDirty(false);
        self.visibleButtonOptions("hidden");
        self.filtersAddedList.removeAll();
    }

    self.clearFilterModal = function () {
        self.addFilterAttempt(false);
        self.filterParamLeftOperandItemID('');
        self.filterParamLeftOperandName('');
        self.filterParamLeftOperandLabel('');
        self.filterParamLeftOperandType('');
        self.filterParamLeftOperandDataType('');
        self.filterParamLeftOperandPath('');
        self.filterParamLeftOperandXpath('');
        self.filterParamSelectedOperator('');
        self.filterParamPlaceholder('');
        self.filterParamValue('');
        self.durationMonthValue('');
        self.durationDayValue('');
        self.filterParamLeftOperandAttrType("GENERAL");
        self.selectedFilterParamLeftOperandItemID('');
        self.selectedFilterParamLeftOperandName('');
        self.selectedFilterParamLeftOperandLabel('');
        self.selectedFilterParamLeftOperandType('');
        self.selectedFilterParamLeftOperandDataType('');
        self.selectedFilterParamLeftOperandPath('');
        self.selectedFilterParamLeftOperandXpath('');
        self.filterOperandsList([]);
        self.partitionIndex(-1);
    }

    self.searchName.subscribe(function (newVal) {
        self.newSearchName(newVal);
    });


    self.filterParamSelectedOperator.subscribe(function (newVal) {
        if (newVal != undefined && newVal == 'EMPTY' || newVal == 'NOTEMPTY') {
            self.filterParamValue('');
            self.durationMonthValue('');
            self.durationDayValue('');
        }
    });

    self.filterParamLeftOperandDataType.subscribe(function () {
        self.addFilterAttempt(false);
        self.filterOperandsList(
            filterOperators.filter(function (e) {
                return e.operandDataTypes.includes(self.selectedFilterParamLeftOperandDataType()) || e.operandDataTypes.includes('ALL');
            })
        );

        var targetObj = filterParamsPlaceholders.find(e => e.dataTypes.includes(self.selectedFilterParamLeftOperandDataType()) || e.dataTypes.includes('DEFAULT'));
        self.filterParamPlaceholder(targetObj.placeholder);
    });

    self.selectFilterParamLeftOperandRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        _populateSelectedContractProperty(iItem);
    }
    self.onFilterParamLeftOperandRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        _populateSelectedContractProperty(iItem);
        event.stopPropagation();
    }

    function _populateSelectedContractProperty(iItem) {
        if (document.getElementById("div_custAttr").children[0].classList.value.indexOf("cc-radio-off") > -1) {
            if (iItem["RelatedGCProps-id"]) {
                var l_itemId = iItem["RelatedGCProps-id"].ItemId1;
                self.selectedFilterParamLeftOperandAttrType(attrType[0]);
                self.selectedFilterParamLeftOperandItemID(l_itemId);
                self.selectedFilterParamLeftOperandName(iItem.Name);
                self.selectedFilterParamLeftOperandLabel(iItem.DisplayName);
                self.selectedFilterParamLeftOperandType(iItem.Type);
                self.selectedFilterParamLeftOperandDataType(iItem.DataType);
                self.selectedFilterParamLeftOperandPath(iItem.Path);
                self.selectedFilterParamLeftOperandXpath(iItem.Xpath);
            }
        } else {
            self.selectedFilterParamLeftOperandAttrType(attrType[1]);
            self.selectedFilterParamLeftOperCustomAttrLabel(getTextValue(iItem.RelatedLabel.Label.text));
            self.selectedFilterParamLeftOperCustomAttrName(getTextValue(iItem.Name));
            self.selectedFilterParamLeftOperandDataType(iItem.DataType);
            self.selectedFilterParamLeftOperCustomAttrType(getTextValue(iItem.DataType));
        }
    }

    self.openButtonOptions = function () {

        if ("visible" !== self.visibleButtonOptions()) {
            self.visibleButtonOptions("visible");
        } else {
            self.visibleButtonOptions("hidden");
        }
    };

    self.applyAddedFilter = function (openSearch) {
        if (self.enableBasicSearch()) {
            openSearch == true ? self.searchClicked(false) : self.searchClicked(true);
            self.refreshList(paginationParams[2].value);
        } else {
            openSearch == true ? self.searchClicked(false) : self.searchClicked(true);
            self.applyAdvancedSearch();
        }
    }

    self.toggleSearch = function () {
        if (self.enableBasicSearch()) {
            self.filtersAddedList().length > 0 ? discardSearchChanges() : self.enableBasicSearch(!self.enableBasicSearch());
        } else {
            (self.advancedSearchText() !== null && self.advancedSearchText().length) > 0 ? discardSearchChanges() : self.enableBasicSearch(!self.enableBasicSearch());
        }
    }

    self.refreshList = function (limit = 25, offset = 0, inputReq = undefined) {
        var req = (inputReq === undefined) ? _prepareSearchInputReq() : inputReq;
        req.limit = limit;
        req.offset = offset;
        l_searchService.getContractJSONDataTable(req, function (data, status) {
            if (status === "SUCCESS") {
                var elements = {};
                if (data.tuple.old.getContractJsonData) {
                    elements = JSON.parse(data.tuple.old.getContractJsonData.getContractJsonData);
                }
                l_contractSearchResults_model.populateDataTableFromJsonTable(elements);
                self.enableButtonsAfterSearch();
                if (offset == 0) {
                    l_contractSearchResults_model.resetPaginationParams();
                }
            }
        });
    }

    self.convertOperand = function (l_dataType, l_oper) {
        if (l_dataType == 'DURATION') {
           // l_oper = l_oper == 'NOTEQUALTO' ? 'NOTCONTAINS' : l_oper == 'EQUALTO' ? 'CONTAINS' : l_oper;
            l_oper = l_oper == 'NOTEMPTY' ? 'NOTEQUALTO' : l_oper == 'EMPTY' ? 'EQUALTO' : l_oper;

        }
        return filterOperators.find(iItem => iItem.value == l_oper).queryOp;
    }

    self.convertValue = function (l_name, l_dataType, l_val) {
        if (l_dataType === "BOOLEAN") {
            l_val = l_val == 'Yes' ? 'true' : 'false';
        } else if (l_dataType === "DATE") {
            l_val = moment(l_val).format("YYYY-MM-DD");

        } else if (l_dataType === "DURATION") {
            //deprecated 23.3
           // l_val = ( l_val && !l_contractSearch_model.enableBasicSearch())  ? l_val.substring(0, l_val.indexOf('M')):l_val;
            if(l_val){
                let days = 0, mindex=0;
                if(l_val.indexOf('M')>-1){
                    days=parseInt(l_val.substring(0, l_val.indexOf('M'))) * 30;
                    mindex = l_val.indexOf('M')+1;
                }
                if(l_val.indexOf('D')>-1){
                    days = days + parseInt(l_val.substring(mindex, l_val.indexOf('D')));
                }
                l_val = days;
            }

            if (!l_val) {
                l_val = 0;
            }
        } else if (l_dataType === "ENUMERATEDTEXT") {
            if (l_name === "PriceProtection") {
                l_val = l_val == 'Yes' ? '1' : '0';
            }
        }
        return l_val;
    }

    self.enableButtonsAfterSearch = function () {
        if (self.searchClicked()) {
            self.enableSearch(false);
            self.searchClicked(false);
            self.enableSave(true);
        }
    }

    self.removeFilter = function (data, event) {
        $('#id_addlFilters').css('display', 'none');
        self.enableSave(false);
        self.isDirty(true);
        self.filtersAddedList.remove(data);
        self.enableSearch(self.filtersAddedList().length > 0);
        hideAddlFilters(false);
    }

    self.updateSearch = function (data, event) {
        if (self.validateSearch()) {
            if (!l_contractSearch_model.isEditMode()) {
                l_searchService.saveSearch();
            } else {
                l_searchService.updateSavedSearch();
            }
        }
    }

    self.updateSearchName = function (data, event) {
        l_contractSearch_model.visibleButtonOptions("hidden");

        $("#div_saveAsModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        $('button#btn_searchNameSaveAs').off("click");
        $('button#btn_searchNameSaveAs').on('click', function (_event) {
            self.searchName(self.newSearchName());
            if (self.validateSearch()) {
                l_searchService.saveSearch();
            }
        });
        event.stopPropagation();
    }

    self.updateToNewSearchName = function () {
        self.enableSave(false);
        l_searchService.loadAllSavedSearches();
        self.isDirty(false);
    }

    self.addToFavorites = function (data) {
        l_searchService.UpdateIsFavorite(l_contractSearch_model, function (status) {
            if (status == "SUCCESS") {
                self.isFavoriteSearch(!self.isFavoriteSearch());
                var targetObj = l_contractSavedSearches_model.allSavedSearches().find(
                    (search) => search["GCSavedSearch-id"].ItemId == data.savedSearchItemId());
                if (self.isFavoriteSearch()) {
                    l_contractSavedSearches_model.favoriteSearches.push(targetObj);
                } else {
                    l_contractSavedSearches_model.favoriteSearches.remove(targetObj);
                }
            }
        });
    }

    self.openFilterAddModel = function (data) {
        self.clearFilterModal();
        $("#addFilterModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        $('button#addFilterYes').off("click");
        $('button#addFilterYes').on('click', function (_event) {
            self.addFilterAttempt(true);
            if (validateMandatoryFields(data)) {
                self.pushTofiltersAddedList();
                $('#addFilterModal').modal('hide');
                self.enableSearch(true);
                self.enableSave(false);
                self.isDirty(true);
            }
        });
    }

    self.pushTofiltersAddedList = function () {
        var filter = new FilterModel();
        if (self.filterParamLeftOperandAttrType() == 'GENERAL') {
            filter.fieldDisplayName(self.selectedFilterParamLeftOperandLabel());
            filter.fieldName(self.selectedFilterParamLeftOperandName());
            filter.fieldDataType(self.selectedFilterParamLeftOperandDataType());
        } else {
            filter.fieldDisplayName(self.selectedFilterParamLeftOperCustomAttrLabel());
            filter.fieldName(self.selectedFilterParamLeftOperCustomAttrName());
            filter.fieldDataType(self.selectedFilterParamLeftOperandDataType());
        }
        filter.type(self.filterParamLeftOperandAttrType());
        filter.operator(self.filterParamSelectedOperator());
        filter.value(self.filterParamValue().trim());
        self.filtersAddedList.push(filter);
        hideAddlFilters(false);
    }

    self.populatefiltersAddedList = function (filterParametersJSON) {
        self.filtersAddedList.removeAll();
        var filter = new FilterModel();
        var jsonObj = JSON.parse(filterParametersJSON);
        var keys = Object.keys(jsonObj);
        keys.forEach(function (ind) {
            filter.fieldDisplayName(jsonObj[ind].fieldDisplayName);
            filter.fieldName(jsonObj[ind].fieldName);
            filter.fieldDataType(jsonObj[ind].fieldDataType);
            filter.type(jsonObj[ind].type);
            filter.operator(jsonObj[ind].operator);
            if(filter.fieldDataType==='DURATION'){
                $.isNumeric(jsonObj[ind].value) ? filter.value(jsonObj[ind].value+'M') : filter.value(jsonObj[ind].value);
                
            }else {
                filter.value(jsonObj[ind].value);
            }
            self.filtersAddedList.push(filter);
            filter = new FilterModel();
        });
        hideAddlFilters(false);
    }

    self.searchNameUpdate = function () {
        if (!self.enableSearch()) {
            if (self.isEditMode() && (self.filtersAddedList().length > 0 || (self.advancedSearchText() !== null && self.advancedSearchText().length > 0))) {
                self.enableSave(true);
            }
        }
        self.isDirty(true);
    }

    self.enableSave.subscribe(function (enabled) {
        $("#btn_save_filter").attr('disabled', !enabled);
        enabled ? $("#btn_save_filter").css({ 'pointer-events': 'auto', 'cursor': 'pointer' }) : $("#btn_save_filter").css('pointer-events', 'none');
    });
    /*
        self.searchName.subscribe(function (newValue) {
            if (newValue && newValue.length > 0) {
                $("#untitled").css('width', newValue.length + "ch");
            }
        });
    */
    self.applyAdvancedSearch = function () {
        if (l_ContractAdvancedSearch_model.isPropertiesLoaded()) {
            if (self.advancedSearchText()) {
                l_ContractAdvancedSearch_model.applySearchWithValidation(self.advancedSearchText().trim());
            }
        }
    }
    var checkTextarea = (e) => {
        const content = $("#input_AdvancedSearchtxt").val().trim();
        content === '' ? (self.enableSearch(false), l_contractSearch_model.isDirty(false), self.ADSearchError('')) : (self.enableSearch(true), l_contractSearch_model.isDirty(true), self.enableSave(false));
    };
    $(document).on('keyup', '#input_AdvancedSearchtxt', checkTextarea);

}


function _prepareSearchInputReq() {
    var req = {
        xmlNomNode: {
            SearchQuery: { QueryElement: [] }
        }
    };
    var id = 0, order = 0;
    req.xmlNomNode.SearchQuery.QueryElement.push({ Id: id, Type: "CONTAINER", Order: order, ParentElement: null });
    var parentId = id;
    var filterlen = l_contractSearch_model.filtersAddedList().length;
    l_contractSearch_model.filtersAddedList().forEach((filter, index) => {
        id++;
        order++;
        req.xmlNomNode.SearchQuery.QueryElement.push({
            Id: id,
            Type: "EXPRESSION",
            Order: order,
            ParentElement: parentId,
            AttrType: filter.type(),
            Expression: {
                OperandName: filter.fieldName(),
                Operand: l_contractSearch_model.convertOperand(filter.fieldDataType(), filter.operator()),
                OperandValue: l_contractSearch_model.convertValue(filter.fieldName(), filter.fieldDataType(), filter.value()),
                OperandDataType: filter.fieldDataType()
            }
        });
        if (index < (filterlen - 1)) {
            id++;
            order++;
            req.xmlNomNode.SearchQuery.QueryElement.push({
                Id: id,
                Type: "CONNECTOR",
                Order: order,
                ParentElement: parentId,
                Connector: "and"
            });
        }
    });
    return req;
}

var ContractDetailsModel = function () {

    var self = this;
    self.contractFieldsList = ko.observableArray([]);
    self.contractDetailsList = ko.observableArray([]);
    self.allContractPropertiesForPreview = ko.observableArray([]);
    self.isContractPreviewActive = ko.observable(true);
    self.docRepoType = ko.observable('');

    self.contractFieldsList.subscribe(function () {
        if (self.contractFieldsList().length < 1) {
            $("#div_ContractDetails").css('visibility', "hidden");
        }
    });

    self.clearContractDetailsModel = function (data) {
        self.contractFieldsList.removeAll();
        self.allContractPropertiesForPreview.removeAll();
    }

    self.loadPreview = function (data) {

        if (!self.docRepoType()) {
            l_searchService.getDocRepositoryType(l_contractDetails_model);
        }

        let pairs = {};
        self.allContractPropertiesForPreview.removeAll();

        l_contractDetails_model.contractDetailsList().forEach(function (iElement) {
            pairs = {};
            pairs.label = iElement.DisplayName;

            if (numericDataTypes.includes(iElement.DataType)) {
                pairs.value = formateNumbertoLocale(data.contractData()[iElement.Name]);
            } else {
                pairs.value = data.contractData()[iElement.Name];
                if(pairs.value==undefined && pairs.value==null){
                    pairs.value = data.fixedData()[iElement.Name];
                }
            }
            self.allContractPropertiesForPreview.push(pairs);
        });
        l_searchService.getAllContractProperties("005056C00008A1E795653A59509D399D." + data.contractId());
    };

    self.dismissPreview = function () {
        $("#div_ContractDetails").css('visibility', 'hidden');
    }

    self.addToPreviewList = function () {
        var ctrObj;
        var maxLen = l_contractSearchResults_model.selectedContracts().length > 3 ? 3 : l_contractSearchResults_model.selectedContracts().length;
        for (var ind = 0; ind < maxLen - 1; ind++) {
            ctrObj = l_contractSearchResults_model.selectedContracts()[ind];
            ctrObj.liClass("nav-item");
            ctrObj.tabPaneClass("tab-pane fade");
            self.contractFieldsList.push(ctrObj);
        }
        ctrObj = l_contractSearchResults_model.selectedContracts()[ind];
        ctrObj.liClass("nav-item active");
        ctrObj.tabPaneClass("tab-pane active");
        self.contractFieldsList.push(ctrObj);
        self.loadPreview(ctrObj);
    }

    self.removeFromPreviewList = function (data, event) {
        if (!self.contractFieldsList().includes(data)) { return; }
        if (self.contractFieldsList().length > 1) {
            if (document.getElementById(`#${data.contractId()}`).classList.contains('active')) {
                if (self.contractFieldsList().indexOf(data) == 0) {
                    self.contractFieldsList()[1].liClass("nav-item active");
                    self.contractFieldsList()[1].tabPaneClass("tab-pane active");
                } else {
                    self.contractFieldsList()[self.contractFieldsList().indexOf(data) - 1].liClass("nav-item active");
                    self.contractFieldsList()[self.contractFieldsList().indexOf(data) - 1].tabPaneClass("tab-pane active");
                }
            }
        }
        self.contractFieldsList.remove(data);
    }
}

var ContractSavedSearchesModel = function () {
    var self = this;
    self.favoritesExpanded = ko.observable(true);
    self.allSavedSearchesExpanded = ko.observable(true);
    self.allSavedSearchesList = ko.observableArray([]);

    self.allSavedSearches = ko.observableArray([]);
    self.favoriteSearches = ko.observableArray([]);

    self.newSearch = function () {

        $('#id_addlFilters').css('display', 'none');
        if (l_contractSearch_model.isDirty()) {
            $("#div_discardChangesModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            $('button#btn_discardChanges').off("click");
            $('button#btn_discardChanges').on('click', function (_event) {
                clearSearchForm();
                l_contractSearch_model.advancedSearchText('');
                l_contractSearch_model.ADSearchError('');
                l_contractSearch_model.enableBasicSearch(true);
            });
        } else {
            clearSearchForm();
            l_contractSearch_model.advancedSearchText('');
            l_contractSearch_model.ADSearchError('');
            l_contractSearch_model.enableBasicSearch(true);
        }
    }

    self.confirmDeleteSearch = function (iItem, event) {
        event.stopPropagation();
        if (iItem["GCSavedSearch-id"].ItemId) {
            deleteSavedSearch(iItem["GCSavedSearch-id"].ItemId);
        }
    }

    self.collapseOrExpandAllSavedFilters = function () {
        self.allSavedSearchesExpanded(!self.allSavedSearchesExpanded());
        $("#allSavedFiltersList").toggle();

    }
    self.collapseOrExpandFavoriteSearches = function () {
        self.favoritesExpanded(!self.favoritesExpanded());
        $("#favoriteFiltersList").toggle();
    }

    self.openSelectedSearch = function (data) {
        $('#id_addlFilters').css('display', 'none');
        if (l_contractSearch_model.savedSearchItemId() != data['GCSavedSearch-id'].ItemId) {
            if (l_contractSearch_model.isDirty()) {
                $("#div_discardChangesModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('button#btn_discardChanges').on('click', function (_event) {
                    l_searchService.readSavedSearch(data);
                });
            } else {
                l_searchService.readSavedSearch(data);
            }
        }
    }
}

var ContractSearchResultModel = function () {
    var self = this;

    self.contractResultsList = ko.observableArray([]);
    self.contractsList = ko.observableArray([]);
    self.allContractsList = ko.observableArray([]);

    self.paginationPerPage = ko.observableArray(paginationParams);
    self.limitValue = ko.observable(paginationParams[2].value);
    self.numOfPages = ko.observable(1);
    self.currentPage = ko.observable(1);
    self.numOfContractsInCurrentPage = ko.observable('');
    self.totalCurrentPageContractsCount = ko.observable('');
    self.totalContractsCount = ko.observable(0);

    self.isCollapsed = ko.observable(false);
    self.isCollapsedPreview = ko.observable(false);
    self.selectedContracts = ko.observableArray([]);

    self.noResultsMsg = ko.observable(searchInfoMsg);


    self.clearSearchResultsModel = function () {
        self.totalContractsCount(0);
        self.currentPage(1);
        self.numOfPages(1);
        self.limitValue(paginationParams[2].value);
        self.contractsList.removeAll();
        self.noResultsMsg(searchInfoMsg);
    }

    self.onPerPageCountChange = function () {
        if (self.contractsList().length > 0) {
            self.resetPaginationParams();
            self.renderContractsList();
        }
    }

    self.resetPaginationParams = function () {
        self.currentPage(1);
        var totalPages = Math.ceil(self.totalContractsCount() / self.limitValue());
        self.numOfPages(totalPages < 1 ? 1 : totalPages);
    }

    self.renderContractsList = function () {
        if (l_contractSearch_model.enableBasicSearch()) {
            l_contractSearch_model.refreshList(self.limitValue(), self.limitValue() * (self.currentPage() - 1));
        } else {
            l_ContractAdvancedSearch_model.ADSearchWithoutValidation(self.limitValue(), self.limitValue() * (self.currentPage() - 1));
        }

    }

    self.goToFirstPage = function () {
        self.currentPage(1);
        self.renderContractsList();
    }
    self.goToPreviousPage = function () {
        self.currentPage(self.currentPage() - 1);
        self.renderContractsList();
    }
    self.goToNextPage = function () {
        self.currentPage(self.currentPage() + 1);
        self.renderContractsList();
    }
    self.goToLastPage = function () {
        self.currentPage(self.numOfPages());
        self.renderContractsList();
    }

    self.showPreview = function (data) {
        l_contractDetails_model.contractFieldsList.removeAll();
        $("#div_ContractDetails").css('visibility', "visible");
        l_contractDetails_model.addToPreviewList();
    }

    self.selectedContracts.subscribe(function (newVal) {
        $("#btn_openContract").attr("disabled", !(self.selectedContracts().length == 1));
        $("#btn_exportContracts").attr("disabled", !(self.selectedContracts().length > 0));
        if (self.selectedContracts().length == 0 || self.selectedContracts().length > 3) {
            $("#btn_previewContracts").attr("disabled", true);
        } else {
            $("#btn_previewContracts").attr("disabled", false);
        }
    });

    self.populateDataTableFromJsonTable = function (iElement_res) {

        l_contractDetails_model.clearContractDetailsModel();
        self.selectedContracts.removeAll();
        self.contractsList.removeAll();

        if (iElement_res) {
            const count = iElement_res.count;
            const data = iElement_res.data;
            if (count < 1) {
                self.noResultsMsg(noresultsInfoMsg);
            }
            if (Array.isArray(data)) {
                self.totalCurrentPageContractsCount(data.length);
                data.forEach(function (iElement) {
                    var contractModal = self.populateContractModal(iElement);
                    self.contractsList.push(contractModal);
                });
            } else {
                self.totalCurrentPageContractsCount('1');
                self.contractsList.push(self.populateContractModal(data));
            }
            self.totalContractsCount(count);
        }
    }

    self.populateContractModal = function (iElement) {

        var model = new ContractModel();
        const currentLoc = window.location.href;
        const homeInd = currentLoc.lastIndexOf("/home/") + 6;
        let contractData = iElement.ctrpropjson_cjson;
        let customData = iElement.custpropjson_cjson;
        let ctrFixedData = iElement.fixedpropjson_cjson;

        //Parsing boolean values
        contractData.AutoRenew = contractData.AutoRenew === "true" ? "Yes" : "No";
        contractData.ClientEarlyTermRight = contractData.ClientEarlyTermRight === "true" ? "Yes" : "No";
        contractData.IsExecuted = ctrFixedData.IsExecuted === "true" ? "Yes" : "No";
        contractData.ContractDocumentType = ctrFixedData.ContractDocumentType === "true" ? "Yes" : "No";
        contractData.Perpetual = contractData.Perpetual === "true" ? "Yes" : "No";
        contractData.Validated = contractData.Validated === "true" ? "Yes" : "No";
        contractData.PriceProtection = contractData.PriceProtection === "1" ? "Yes" : "No";


        //Parsing Date values
        _parseDate('MinStartdate');
        _parseDate('CurrentEndDate');
        _parseDate('CurrentStartDate');
        _parseDate('InitialExpiryDate');
        _parseDate('NextExpirationDate');
        _parseDate('StartDate');
        _parseDate('PriceProtectionDate');
        _parseDate('SignatureDate');
        _parseDate('CancellationDate');
        _parseDate('ValidatedOn');

        //Parsing Duration values
        _parseDuration('AutoRenewDuration', contractData.AutoRenewDuration);
        _parseDuration('InitialContractTenure', contractData.InitialContractTenure);

        model.contractterm(contractData.InitialContractTenure);
        model.contractData(contractData);
        model.customData(customData);
        model.fixedData(ctrFixedData)
        model.contractId(contractData.ID);
        model.genContractId(ctrFixedData.GeneratedContractId);
        model.liClass("nav-item");
        model.tabPaneClass("tab-pane fade");

        model.previewDocUrl = ko.observable("/home/" + currentLoc.substring(homeInd, homeInd + currentLoc.substring(homeInd).indexOf("/")) + "/app/start/web/item/"
            + "005056C00008A1E795653A59509D399D." + contractData.ID + "/005056C00008A1E7AA661CA0C93D1C4A");
        model.templateName(ctrFixedData.Template);
        model.contractName(contractData.ContractName);
        model.contractIdAttr = ko.observable("#" + contractData.ID);
        model.contractType(ctrFixedData.ContractType);

        model.startDate(contractData.MinStartdate);
        model.organization(ctrFixedData.RelatedOrganization);
        model.isexternal(ctrFixedData.ContractDocumentType);
        model.isexecuted(ctrFixedData.IsExecuted);

        function _parseDuration(name, value) {
            let durationArray = [];
            if (value) {
                if (value.includes('P') && value.includes('M')) {
                    let months = parseInt(value.substring(value.indexOf('P') + 1, value.indexOf('M')));
                    if (months > 0) {
                        durationArray.push(months.toString().concat(months > 1 ? " months" : " month"));
                    }
                }
                if (value.includes('M') && value.includes('D')) {
                    const days = parseInt(value.substring(value.indexOf('M') + 1, value.indexOf('D')));
                    if (days > 0) {
                        durationArray.push(days.toString().concat(days > 1 ? " days" : " day"));
                    }
                }
                contractData[name] = durationArray.length > 0 ? durationArray.join(', ') : "No duration sepcified."
            }
        }

        function _parseDate(name) {
            if (contractData[name]) {
                contractData[name] = formateDatetoLocale(contractData[name]);
            }
        }
        return model;
    }

    self.openContract = function (iItem) {
        var url = "../../../../../app/start/web/perform/item/005056C00008A1E795653A59509D399D." + iItem.contractId();
        window.open(url, '_blank');
    }

    self.removeUncheckedContract = function (iItem) {
        self.selectedContracts.remove(function (contract) {
            return contract.contractId == iItem.contractId;
        });
    }

    self.openContractFromActionBar = function (iItem) {
        if (self.selectedContracts().length == 1) {
            var url = "../../../../../app/start/web/perform/item/005056C00008A1E795653A59509D399D." + self.selectedContracts()[0].contractId();
            window.open(url, '_blank');
        }
    }

    self.onContractRowCheckboxValueChanged = function (iItem, event) {

        event.stopPropagation();
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off");
            $(event.currentTarget).addClass("cc-checkbox-on");
            self.selectedContracts.push(iItem);
            $(event.currentTarget.parentElement.parentElement).css("background-color", "#CBD3D9");
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            self.removeUncheckedContract(iItem);
            l_contractDetails_model.removeFromPreviewList(iItem, event);
            $(event.currentTarget.parentElement.parentElement).css("background-color", "transparent")
        }
        if (self.selectedContracts().length <= 0) {
            $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllContracts").addClass("cc-checkbox-select-all-off");
        } else if (self.selectedContracts().length == 1) {
            if (1 == self.totalCurrentPageContractsCount()) {
                $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-partial");
                $("#id_selectAllContracts").addClass("cc-checkbox-select-all-on");

            } else {
                $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-on");
                $("#id_selectAllContracts").addClass("cc-checkbox-select-all-partial");
            }
        } else if (self.selectedContracts().length > 1 && self.selectedContracts().length < self.totalCurrentPageContractsCount()) {
            $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllContracts").addClass("cc-checkbox-select-all-partial");
        } else if (self.selectedContracts().length == self.totalCurrentPageContractsCount()) {
            $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllContracts").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllContracts").addClass("cc-checkbox-select-all-on");
        }
    }

    self.onAllContractsCheckboxValueChanged = function (iItem, event) {
        if (self.contractsList().length > 0) {
            let l_currentClassName = event.currentTarget.className;
            if (l_currentClassName.includes('cc-checkbox-select-all-off') || l_currentClassName.includes("cc-checkbox-select-all-partial")) {
                $(event.currentTarget).removeClass("cc-checkbox-select-all-off");
                $(event.currentTarget).removeClass("cc-checkbox-select-all-partial");
                $(event.currentTarget).addClass("cc-select-column cc-checkbox-select-all-on");
                $("#id_contractsTable").find('tbody .cc-select-column').removeClass("cc-checkbox-off");
                $("#id_contractsTable").find('tbody .cc-select-column').addClass("cc-checkbox-on");
                $("#id_contractsTable").find('tbody tr').css("background-color", "#CBD3D9");

                self.contractsList().forEach(ctr => self.selectedContracts.push(ctr));
            } else if (l_currentClassName.includes("cc-checkbox-select-all-on")) {
                $(event.currentTarget).removeClass("cc-checkbox-select-all-on");
                $(event.currentTarget).addClass("cc-select-column cc-checkbox-select-all-off");
                $("#id_contractsTable").find('tbody .cc-select-column').removeClass("cc-checkbox-on");
                $("#id_contractsTable").find('tbody .cc-select-column').addClass("cc-checkbox-off");
                $("#id_contractsTable").find('tbody tr').css("background-color", "transparent")
                self.selectedContracts.removeAll();
            }
            event.stopPropagation();
        }
    }

};

var ContractModel = function (data) {

    var self = this;
    self.contractItemId = ko.observable(data ? data['Contract-id'].ItemId : null);
    self.contractData = ko.observable('');
    self.customData = ko.observable('');
    self.fixedData = ko.observable('');
    self.organization = ko.observable('');
    self.isexternal = ko.observable('');
    self.isexecuted = ko.observable('');
    self.contractId = ko.observable('');
    self.genContractId = ko.observable('');
    self.contractIdAttr = ko.observable('');
    self.liClass = ko.observable('');
    self.tabPaneClass = ko.observable('');
    self.previewDocUrl = ko.observable('');

    self.templateName = ko.observable('');
    self.contractName = ko.observable('');
    self.contractType = ko.observable('');
    self.startDate = ko.observable('');
    self.contractterm = ko.observable('');

    return self;
}

var ContractAdvancedSearchModel = function () {

    var self = this;
    self.isPropertiesLoaded = ko.observable(false);
    self.generalAttrList = ko.observableArray([]);
    self.customAttrList = ko.observableArray([]);
    self.ADFilterOperandsList = ko.observableArray([]);
    self.CCExpressionList;
    self.queryExpression;
    self.advancedQueryReq;
    self.l_searchCriteria2;
    self.l_isFailed;
    self.isPropertiesLoaded.subscribe(function (newVal) {
        if (newVal != undefined && newVal == true) {
            genListProps = l_ContractAdvancedSearch_model.generalAttrList();
            custListProps = l_ContractAdvancedSearch_model.customAttrList();
            updateData();
            autocomplete();
        }
    });

    self.applySearchWithValidation = function (inputText) {
        if (self.parseAdvancedSearch(inputText)) {
            if (self.validateExpression()) {
                l_contractSearch_model.refreshList(paginationParams[2].value, undefined, self.advancedQueryReq);
                l_contractSearch_model.ADSearchError('S');
            } else {
                l_contractSearch_model.enableSearch(false);
            }
        }
    }

    self.ADSearchWithoutValidation = function (limit, page) {
        l_contractSearch_model.refreshList(limit, page, self.advancedQueryReq);
    }

    self.parseAdvancedSearch = function (inputText) {

        var isFailed = false;
        var searchCriteria = inputText;
        var searchCriteria2 = inputText;
        const expressionRegex = /(\w+)\s*(=|!=|<=|>=|CONTAINS|IS )\s*(".*?"|EMPTY|NOTEMPTY)/g;
        var match;
        const expressions = [];
        const myoperators = ["=", "!=", "CONTAINS", ">=", "<=", "IS"];

        var index = -1;
        while ((match = expressionRegex.exec(searchCriteria)) !== null) {
            index = index + 1;
            const express = match[0];
            var field = match[1];
            var operator = match[2];
            var value = match[3];

            operator = (operator==="IS ") ? "IS" : operator;
            // Remove quotes from value if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            // Remove quotes from value if present
            if (field.startsWith('"') && field.endsWith('"')) {
                field = field.substring(1, field.length - 1);
            }
            //expressions.push({ field, operator, value, express });

            //Replace expression with numbers
            searchCriteria2 = searchCriteria2.replace(express, index + ' ');
            var propObj = undefined, propType = null;
            //check for predefined operators only
            if (myoperators.includes(operator)) { //check for predefined cnotracts operands
                var aliasDisplayname = field;
                var actualName = fetchNamefromAlias(field);
                field = actualName != undefined ? actualName : field;
                propObj = self.generalAttrList().find(o => o.Name === field);
                if (propObj != undefined) {
                    propType = 'GENERAL';
                } else {  //check for predefined custom operands
                    propObj = self.customAttrList().find(o => o.Name === field);
                    propObj != undefined ? propType = 'CUSTOM' : "";
                }
                if (propObj === undefined) {
                    propType = null;
                    l_contractSearch_model.ADSearchError(`Validation failed: '${aliasDisplayname}' is an invalid property.`);
                    isFailed = true;
                    break;
                } else {
                    if (!self.validateDatatypes(propObj, operator, value, aliasDisplayname)) {
                        isFailed = true;
                        break;
                    }
                    propObj.DataType = self.changeDataType(propObj.DataType);
                    operator = self.changeOperator(propObj.DataType, operator, value);
                    value = self.changeEmptyTONUll(propObj.DataType, operator, value);
                    value = l_contractSearch_model.convertValue(propObj.Name, propObj.DataType, value);
                    expressions.push({ 'field': propObj.Name, operator, value, express, 'DataType': propObj.DataType, propType });
                }

            } else {
                l_contractSearch_model.ADSearchError(`Validation failed: '${operator}' is an invalid comparision operator.`);
                isFailed = true;
                break;
            }

        }

        if (isFailed === false && index !== -1) {
            self.CCExpressionList = expressions;
            self.l_searchCriteria2 = searchCriteria2;
            self.l_isFailed = isFailed;
            return true;
        } else {
            index === -1 ? l_contractSearch_model.ADSearchError('Validation failed: Enter a valid expression, for example: ContractValue >= "12345.67"') : "";
        }
        return false;
    }
    self.changeOperator = function (l_dataType, l_oper, l_value) {
        if (l_dataType == 'DURATION') {
            // l_oper = l_oper == '!=' ? 'NOT LIKE' : l_oper == '=' ? 'LIKE' : l_oper;
            if (l_oper == 'IS'){
                l_oper = (l_value == 'EMPTY') ? '=' : '!=';
            }
        }
        if (l_oper == 'IS') {
            l_oper = (l_value == 'EMPTY') ? 'IS NULL' : 'IS NOT NULL';
        }
        l_oper = (l_oper == "CONTAINS") ? 'LIKE' : l_oper;

        return l_oper;
    }

    self.changeEmptyTONUll = function (l_dataType, l_oper, l_value) {
        if (l_dataType == 'DURATION') {
            l_value = (l_value == 'EMPTY' || l_value == 'NOTEMPTY') ? 0 : l_value;
        } else {
            l_value = (l_oper == 'IS NULL' || l_oper == 'IS NOT NULL') ? "" : l_value;
        }
        return l_value;
    }

    self.changeDataType = function (iType) {
        if (iType === "NUMBER") {
            return "DECIMAL";
        } else if (iType === "ENUM") {
            return "ENUMERATEDTEXT";
        } else {
            return iType;
        }
    }
    self.validateDatatypes = function (propObj, operator, value, aliasDisplayname) {

        var isValid = true;
        //Validate operator
        // NUmber check, date format check, duration check 
        self.ADFilterOperandsList(
            advancedFilterOperators.filter(function (e) {
                return e.operandDataTypes.includes(propObj.DataType) || e.operandDataTypes.includes('ALL');
            })
        );
        var filterItem = self.ADFilterOperandsList().find(iItem => iItem.value == operator);
        if (filterItem == undefined) {
            isValid = false;
            l_contractSearch_model.ADSearchError(`Validation failed: The '${operator}' operator is not allowed for the property '${aliasDisplayname}'`);
        } else {
            var typeCheckObj = advancedFilterTypecheck.find(e => e.dataTypes.includes(propObj.DataType) || e.dataTypes.includes('DEFAULT'));
            isValueValid(typeCheckObj);
        }

        //validate value based on data type 
        function isValueValid(typeCheckObj) {

            if (filterItem.value == 'IS' && value != 'NOTEMPTY' && value != 'EMPTY') {
                l_contractSearch_model.ADSearchError(`Validation failed: The '${aliasDisplayname}' value can be EMPTY or NOTEMPTY for 'IS' operator`);
                isValid = false;
                return false;
            }
            if (value.match(/[^A-Za-z0-9_.@$&#/\s-]/)) {
                l_contractSearch_model.filterParamValueErrorMsg("Value has restricted characters");
                l_contractSearch_model.ADSearchError(`Validation failed: The '${aliasDisplayname}' Value has restricted characters`);
                isValid = false;
                return false;
            } else if (value.length == 0 && filterItem.value != 'IS') {
                isValid = false;
            } else if (typeCheckObj.typeCheck == 'NUMERIC' && filterItem.value != 'IS') {
                isValid = $.isNumeric(value);
            } else if ((typeCheckObj.typeCheck == 'INTEGER') && filterItem.value != 'IS') {
                isValid = value >= 0 ? (Number.isInteger(Number(value)) && !value.includes('.')) : false;
            } else if ((typeCheckObj.typeCheck == 'DURATION') && filterItem.value != 'IS') {
                /*Deprecated 23.3*/
               /* if(value.substring(0, value.indexOf('M'))=='' || (value.substring(value.indexOf('M')+1, value.length).length>0 && value.indexOf('D')<0)){
                    isValid =false;
                }else if(value.indexOf('D')>-1 && value.substring(value.indexOf('D')+1, value.length).length>0) {
                    isValid =false;
                }else if(value.indexOf('D')>-1) {
                    let mvalue = value.substring(0, value.indexOf('M'))
                    isValid = (mvalue >= 0)? (Number.isInteger(Number(mvalue)) && !mvalue.includes('.')) : false;
                    let dvalue = value.substring(value.indexOf('M')+1, value.indexOf('D'));
                    isValid = (isValid && dvalue!='' && dvalue >= 0)? (Number.isInteger(Number(dvalue)) && !dvalue.includes('.')) : false;
                } else {
                    value = value.substring(0, value.indexOf('M'))
                    isValid = (value >= 0)? (Number.isInteger(Number(value)) && !value.includes('.')) : false;
                }*/
                let mvalue = false;
                if(value.indexOf('M')>-1){
                   mvalue =  value.substring(0, value.indexOf('M'))=='' ? false : value.substring(0, value.indexOf('M'));
                   isValid = (value.indexOf('D')<0 && value.substring(value.indexOf('M')+1, value.length).length>0) ? false : isValid;
                   isValid = (isValid && mvalue!=false && mvalue!='' && mvalue >= 0 && mvalue<1000)? (Number.isInteger(Number(mvalue)) && !mvalue.includes('.')) : false;
                }if(value.indexOf('D')>-1 && isValid){
                    let dvalue = false;
                    isValid = (value.substring(value.indexOf('D')+1, value.length).length>0) ? false : isValid;

                    if(mvalue!=false && isValid){
                    dvalue = value.substring(value.indexOf('M')+1, value.indexOf('D'));
                    isValid = (dvalue!='' && dvalue >= 0 && dvalue<1000)? (Number.isInteger(Number(dvalue)) && !dvalue.includes('.')) : false;
                    }else{
                        dvalue =  value.substring(0, value.indexOf('D'))=='' ? false : value.substring(0, value.indexOf('D'));
                        isValid = (dvalue!='' && dvalue >= 0 && dvalue<1000)? (Number.isInteger(Number(dvalue)) && !dvalue.includes('.')) : false;
                    }

                }if(value.indexOf('M')<0 && value.indexOf('D')<0){
                    isValid=false;
                }
            } else if (typeCheckObj.typeCheck == 'DATE' && filterItem.value != 'IS') {
                isValid = moment(value, "YYYY/MM/DD", true).isValid();
            } else if (typeCheckObj.typeCheck == 'BOOLEAN' && filterItem.value != 'IS') {
                isValid = value == 'Yes' || value == 'No';
            }
            isValid == false ? l_contractSearch_model.ADSearchError(typeCheckObj.errorText + aliasDisplayname) : "";
            return isValid;
        }
        return isValid;
    }

    self.validateExpression = function () {
        var numberEXp = null;
        var searchCriteria3 = self.l_searchCriteria2;
        var isFailed = self.l_isFailed;
        // Replace and with &, or with |.
        searchCriteria3 = searchCriteria3.replace(new RegExp("(AND)", "g"), "&")
        searchCriteria3 = searchCriteria3.replace(new RegExp("(OR)", "g"), "|");
        // Remove all spaces.
        // searchCriteria3 = searchCriteria3.replace(new RegExp("[ ]+", "g"), "");
        let regex = /^[0-9&|()\s]+$/;
        let match1 = regex.test(searchCriteria3);
        if (match1) {
            numberEXp = searchCriteria3;
            //replace numbers with true and trim spaces
            searchCriteria3 = searchCriteria3.replace(new RegExp("[0-9]+", "g"), "true");
            if (searchCriteria3.indexOf('&&') > -1) {
                l_contractSearch_model.ADSearchError("Validation failed: 'AND AND' is not allowed in the expression");
                isFailed = true;
            } else if (searchCriteria3.indexOf('||') > -1) {
                l_contractSearch_model.ADSearchError("Validation failed: 'OR OR' is not allowed in the expression");
                isFailed = true;
            } else {
                try {
                    eval(searchCriteria3);
                } catch (err) {
                    if (err.message.includes('true')) {
                        l_contractSearch_model.ADSearchError("Validation failed: Operators [AND, OR] is missed between an expression");
                    } else {
                        l_contractSearch_model.ADSearchError("Validation failed: " + err.message.replace(/\|/g, "OR").replace(/&/g, "AND"));
                    }
                    isFailed = true;
                }
            }
        } else {
            let invalidSubstring = searchCriteria3.match(/[^0-9&|()\s]+/)[0];
            l_contractSearch_model.ADSearchError(`Validation failed: Invalid expression near '${invalidSubstring}'`);
            isFailed = true;
        }

        if (!isFailed) {
            self.queryExpression = numberEXp.replace(new RegExp("[ ]+", "g"), "");
            var nmatch = self.queryExpression.match(/\d+/g);
            if (nmatch != null && nmatch.length == self.CCExpressionList.length) {
                self.advancedQueryReq = self.ADSearchPrepareReuqest();
                return true;
            } else {
                l_contractSearch_model.ADSearchError('Validation failed: Number is used after or before an operator');
                return false;
            }

        }
        return false;
    }

    self.ADSearchPrepareReuqest = function () {

        // var splitexpressArr = numberExpression.replaceAll('(','$').replaceAll(')','$').replaceAll('&','$').replaceAll('|','$').split('$');
        var numberExpression = self.queryExpression;
        var splitexpressArr = numberExpression.replace(/\d+/g, '$').split('');
        var expressionsList = self.CCExpressionList;
        var req = {
            xmlNomNode: {
                SearchQuery: { QueryElement: [] }
            }
        };

        req.xmlNomNode.SearchQuery.QueryElement.push({ Id: 0, Type: "CONTAINER", Order: 0, ParentElement: null });
        var parentId = 0, prevParentId = 0;
        var order = 0, expressIndex = 0;
        splitexpressArr.forEach((element, index) => {

            if (element === '(') {
                prevParentId = parentId;
                req.xmlNomNode.SearchQuery.QueryElement.push({ Id: index + 1, Type: "CONTAINER", Order: 0, ParentElement: prevParentId });
                parentId = index + 1;
            } else if (element === '$') {
                req.xmlNomNode.SearchQuery.QueryElement.push({
                    Id: index + 1,
                    Type: "EXPRESSION",
                    Order: index + 1,
                    ParentElement: parentId,
                    AttrType: expressionsList[expressIndex].propType,
                    Expression: {
                        OperandName: expressionsList[expressIndex].field,
                        Operand: expressionsList[expressIndex].operator,
                        OperandValue: expressionsList[expressIndex].value,
                        OperandDataType: expressionsList[expressIndex].DataType
                    }
                }); ++expressIndex;
            } else if (element === '&') {
                req.xmlNomNode.SearchQuery.QueryElement.push({
                    Id: index + 1,
                    Type: "CONNECTOR",
                    Order: index + 1,
                    ParentElement: parentId,
                    Connector: "and"
                });
            } else if (element === '|') {
                req.xmlNomNode.SearchQuery.QueryElement.push({
                    Id: index + 1,
                    Type: "CONNECTOR",
                    Order: index + 1,
                    ParentElement: parentId,
                    Connector: "or"
                });
            } else if (element === ')') {
                // req.xmlNomNode.SearchQuery.QueryElement.push({ 
                //     Id: index+1,
                //     Type: "CLOSECONTAINER",
                //     Order: index+1,
                //     ParentElement: parentId
                // });
                parentId = prevParentId;
            } else {
                l_contractSearch_model.ADSearchError("Encountered unexpected character");
            }

        });
        // req.xmlNomNode.SearchQuery.QueryElement.push({ Id: splitexpressArr.length+1, Type: "CLOSECONTAINER", Order: 0, ParentElement: parentId });
        return req;
    }
}

function enableSearchName() {
    $("#untitled").select();
}

var FilterModel = function () {
    var self = this;
    self.fieldName = ko.observable('');
    self.fieldDisplayName = ko.observable('');
    self.fieldDataType = ko.observable('');
    self.type = ko.observable('');
    self.operator = ko.observable('');
    self.value = ko.observable('');
    return self;
}

function getQueryOperator(iOperator) {
    var l_operator;
    switch (iOperator) {
        case 'Equals':
            l_operator = "=";
            break;
        case 'Not equals':
            l_operator = "!=";
            break;
        case 'Contains':
            l_operator = "LIKE";
            break;
    }
    return l_operator;
}

function getDatatypeText(iDatatype) {
    var l_dataTypeText;
    switch (iDatatype) {
        case 'BOOLEAN':
            l_dataTypeText = "Boolean";
            break;
        case 'DATE':
            l_dataTypeText = "Date";
            break;
        case 'DECIMAL':
            l_dataTypeText = "Decimal";
            break;
        case 'DURATION':
            l_dataTypeText = "Duration";
            break;
        case 'FLOAT':
            l_dataTypeText = "Float";
            break;
        case 'INTEGER':
            l_dataTypeText = "Integer";
            break;
        case 'LONGTEXT':
            l_dataTypeText = "Long text";
            break;
        case 'TEXT':
            l_dataTypeText = "Text";
            break;
        case 'NUMBER':
            l_dataTypeText = "Number";
            break;
        case 'ENUM':
            l_dataTypeText = "Enum";
            break;
        case 'ENUMERATEDTEXT':
            l_dataTypeText = "Enumerated Text";
            break;
        case 'LOOKUP':
            l_dataTypeText = "Text";
    }
    return getTranslationMessage(l_dataTypeText);
}
function getOperatorText(iOperator) {
    return filterOperators.find(iItem => iItem.value == iOperator()).name;
}

function collapseSavedSearch() {

    if ($("#caretdown").hasClass("hidden")) {
        $("#caretdown").removeClass("hidden");
        $("#caretup").addClass("hidden")
    } else {
        $("#caretup").removeClass("hidden");
        $("#caretdown").addClass("hidden")
    }

    if ($("#div_savedsearches").attr('apps-toggle') == "expanded") {
        $("#div_savedSearchesPanel").css('display', 'none');
        $("#div_savedsearches").attr("apps-toggle", "collapsed");
        $("#div_searchResultsAndPreview").attr('class', 'col-md-12');
    } else {
        $("#div_savedsearches").attr("apps-toggle", "expanded");
        $("#div_savedSearchesPanel").css('display', 'flex');
        $("#div_searchResultsAndPreview").attr('class', 'col-md-10');

    }
}

function exportSelectedContracts() {
    let reqContractProps = Object.assign({}, contractProperties);
    let ctrObj = {};
    ctrObj.contracts = {};
    ctrObj.contracts.contract = []
    ctrObj.contracts.contract.push(JSON.stringify(contractProperties));
    l_contractSearchResults_model.selectedContracts().forEach(function (ctr) {
        Object.entries(contractProperties).forEach(([key, val]) => reqContractProps[key] = ctr.contractData()[key])
        ctrObj.contracts.contract.push(JSON.stringify(reqContractProps));
        reqContractProps = Object.assign({}, contractProperties);
    });
    l_searchService.downloadReport(ctrObj);
}

function exportAllContracts() {

    var req = l_contractSearch_model.enableBasicSearch() ? _prepareSearchInputReq() : l_ContractAdvancedSearch_model.ADSearchPrepareReuqest();
    req.limit = 1000000;
    req.offset = 0;
    l_searchService.getContractJSONDataTable(req, function (data, status) {
        if (status === "SUCCESS") {
            var elements = {};
            if (data.tuple.old.getContractJsonData) {
                elements = JSON.parse(data.tuple.old.getContractJsonData.getContractJsonData);
            }
            l_contractSearchResults_model.allContractsList.removeAll();
            var data = elements.data;
            if (Array.isArray(data)) {
                data.forEach(function (iElement) {
                    l_contractSearchResults_model.allContractsList.push(l_contractSearchResults_model.populateContractModal(iElement));
                });
            } else {
                l_contractSearchResults_model.allContractsList.push(l_contractSearchResults_model.populateContractModal(data));
            }
        }
        let reqContractProps = Object.assign({}, contractProperties);
        let ctrObj = {};
        ctrObj.contracts = {};
        ctrObj.contracts.contract = []
        ctrObj.contracts.contract.push(JSON.stringify(contractProperties));
        l_contractSearchResults_model.allContractsList().forEach(function (ctr) {
            Object.entries(contractProperties).forEach(([key, val]) => reqContractProps[key] = ctr.contractData()[key] ? ctr.contractData()[key] : "");
            ctrObj.contracts.contract.push(JSON.stringify(reqContractProps));
            reqContractProps = Object.assign({}, contractProperties);
        });
        l_searchService.downloadReport(ctrObj);
    });
}


function loadSavedSearchData(data) {
    resetClasses();
    l_contractSearch_model.savedSearchItemId(data['GCSavedSearch-id'].ItemId);
    l_contractSearch_model.enableSave(false);
    l_contractSearch_model.isDirty(false);
    l_contractSearch_model.isEditMode(true);
    l_contractSearch_model.searchName(data.SearchName);
    l_contractSearch_model.isFavoriteSearch(data.IsFavorite === 'true');
    l_contractSearch_model.queryLogic(data.QueryLogic);
    l_contractSearch_model.enableBasicSearch(data.SearchType === "Advanced" ? false : true);
    if (l_contractSearch_model.enableBasicSearch()) {
        l_contractSearch_model.populatefiltersAddedList(data.FilterParametersJSON);
        l_contractSearch_model.advancedSearchText('');
        l_contractSearch_model.ADSearchError('');
    } else {
        l_contractSearch_model.advancedSearchText(data.AdvancedSearchExpression);
        l_contractSearch_model.ADSearchError('S');
    }
    l_contractSearch_model.applyAddedFilter(true);
    l_contractSearch_model.visibleButtonOptions("hidden");
}

function deleteSavedSearch(iItemID) {
    $("#div_SearchConfirmModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#modal_heading_1").text("Delete");
    $("#modal_content_1").text("Delete the selected items?");
    $("#btn_modalAction_1").text("Delete");
    $('button#btn_modalAction_1').off("click");
    $('button#btn_modalAction_1').on('click', function (_event) {
        l_searchService.deleteSearch(iItemID, function (status) {
            if (status == "SUCCESS" && l_contractSearch_model.savedSearchItemId() == iItemID) {
                if (l_contractSearch_model.enableBasicSearch()) {
                    clearSearchForm();
                } else {
                    l_contractSearchResults_model.clearSearchResultsModel();
                    l_contractSearch_model.clearContractSearchModel();
                    l_contractDetails_model.clearContractDetailsModel();
                    l_contractSearch_model.advancedSearchText('');
                    l_contractSearch_model.ADSearchError('');
                }
            }
        });
    });
}

function discardSearchChanges() {
    $("#div_SearchConfirmModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#modal_heading_1").text("Discard");
    $("#modal_content_1").text("This action will discard the current search query. Do you want to continue?");
    $("#btn_modalAction_1").text("Yes");
    $('button#btn_modalAction_1').off("click");
    $('button#btn_modalAction_1').on('click', function (_event) {
        if (l_contractSearch_model.enableBasicSearch()) {
            l_contractSearchResults_model.clearSearchResultsModel();
            l_contractSearch_model.clearContractSearchModelOnToggle();
            l_contractSearch_model.clearFilterModal();
            l_contractDetails_model.clearContractDetailsModel();
            resetClasses();
        } else {
            l_contractSearchResults_model.clearSearchResultsModel();
            l_contractSearch_model.clearContractSearchModelOnToggle();
            l_contractDetails_model.clearContractDetailsModel();
            l_contractSearch_model.advancedSearchText('');
            l_contractSearch_model.ADSearchError('');
        }
        l_contractSearch_model.enableBasicSearch(!l_contractSearch_model.enableBasicSearch());
    });
}

function addDataToPreviewProperties(iElementList) {

    l_contractDetails_model.allContractPropertiesForPreview.push(
        {
            "label": "Internal parties",
            "value": iElementList.CTRAddlProps.AllInternalParties
        },
        {
            "label": "External parties",
            "value": iElementList.CTRAddlProps.AllExternalParties
        }
    );

    if (iElementList) {
        var customAttrList = iElementList.GetMappedCustomAttributesResponse.FindZ_INT_RelatedAttributesListResponse.RelatedAttributes;
        var pairs = {};
        if (customAttrList.length) {
            customAttrList.forEach(function (iElement) {
                pairs.label = iElement.RelatedLabel.Label.text;
                pairs.value = numericDataTypes.includes(iElement.DataType) ? formateNumbertoLocale(iElement.Value) : iElement.Value;
                l_contractDetails_model.allContractPropertiesForPreview.push(pairs);
                pairs = {};
            });
        } else {
            pairs.label = customAttrList.RelatedLabel.Label.text;
            pairs.value = customAttrList.Value;
            l_contractDetails_model.allContractPropertiesForPreview.push(pairs);
        }
    }
}

function clearSearchForm() {
    l_contractSearchResults_model.clearSearchResultsModel();
    l_contractSearch_model.clearContractSearchModel();
    l_contractSearch_model.clearFilterModal();
    l_contractDetails_model.clearContractDetailsModel();
    resetClasses();
}
function resetClasses() {
    $('#id_selectAllContracts').attr('class', 'cc-select-column cc-checkbox-select-all-off');
}

function validateMandatoryFields(i_Item) {
    var isValid = true;
    var filterParamVal = i_Item.filterParamValue();
    if(l_contractSearch_model.selectedFilterParamLeftOperandDataType()==='DURATION'){
       let mdays='';
       if(i_Item.durationMonthValue()!=''){
            mdays = i_Item.durationMonthValue()+'M'
            filterParamVal = i_Item.durationMonthValue();
       }
       if(i_Item.durationDayValue()!=''){
            mdays = mdays + i_Item.durationDayValue()+'D';
            filterParamVal = i_Item.durationDayValue();
       }
       i_Item.filterParamValue(mdays);
    }
    

    if (i_Item.filterParamLeftOperandName().length == 0 || i_Item.filterParamSelectedOperator() == undefined) {
        return false;
    }
    var targetObj = filterParamsPlaceholders.find(e => e.dataTypes.includes(l_contractSearch_model.selectedFilterParamLeftOperandDataType()) || e.dataTypes.includes('DEFAULT'));
    if (!isValueValid(filterParamVal)) {
        l_contractSearch_model.filterParamValueErrorMsg(targetObj.errorText);
        return false;
    } if (filterParamVal.match(/[^A-Za-z0-9_.@$&#/\s-]/)) {
        l_contractSearch_model.filterParamValueErrorMsg("Value has restricted characters");
        return false;
    }
    l_contractSearch_model.filterParamValueErrorMsg('');
    return true;

    function isValueValid(filterParamVal) {
        if (i_Item.filterParamSelectedOperator() == 'EMPTY' || i_Item.filterParamSelectedOperator() == 'NOTEMPTY') {
            return true;
        }
        if (filterParamVal.length == 0) {
            isValid = false;
        } else if (targetObj.typeCheck == 'NUMERIC') {
            isValid = $.isNumeric(filterParamVal);
        } else if (targetObj.typeCheck == 'DATE') {
            isValid = moment(filterParamVal, "YYYY/MM/DD", true).isValid();
        } else if (targetObj.typeCheck == 'BOOLEAN') {
            isValid = filterParamVal == 'Yes' || filterParamVal == 'No';
        }
        return isValid;
    }
}

function formSaveSearchObject(iModel, iIsUpdate) {
    var l_savedSearch = {};
    if (iIsUpdate) {
        l_savedSearch.SavedSearchItemId = iModel.savedSearchItemId();
    }
    l_savedSearch.SearchName = iModel.searchName();
    l_savedSearch.SearchType = l_contractSearch_model.enableBasicSearch() == true ? "Basic" : "Advanced";
    if (l_contractSearch_model.enableBasicSearch()) {
        l_savedSearch.QueryLogic = formQueryLogic(iModel);
        l_savedSearch.FilterParametersJSON = formFilterParamsJSON(iModel);
        l_savedSearch.AdvancedSearchExpression = "";
    } else {
        l_savedSearch.AdvancedSearchExpression = l_contractSearch_model.advancedSearchText();
        l_savedSearch.QueryLogic = "";
        l_savedSearch.FilterParametersJSON = "";
    }
    return l_savedSearch;
}


function formQueryLogic(iModel) {
    var arr = [];
    for (var ind = 0; ind < iModel.filtersAddedList().length; ind++) {
        arr.push(ind + 1);
    }
    return arr.join(' and ');
}

function formFilterParamsJSON(iModel) {
    var filterParams = {};

    for (var ind = 0; ind < iModel.filtersAddedList().length; ind++) {
        var param = iModel.filtersAddedList()[ind];
        filterParams[ind + 1] = {
            "type": param.type(),
            "fieldDisplayName": param.fieldDisplayName(),
            "fieldDataType": param.fieldDataType(),
            "fieldName": param.fieldName(),
            "operator": param.operator(),
            "value": param.value()
        }
    }
    return JSON.stringify(filterParams);
}

function truncateValue(attrValue) {
    return attrValue().length > 24 ? `${attrValue().substring(0, 24)}...` : attrValue;
}

function truncateString(val) {
    return val.length > 46 ? `${val.substring(0, 46)}...` : val;
}

l_contractSearch_model = new ContractSearchModel();
l_contractSearchResults_model = new ContractSearchResultModel();
l_contractDetails_model = new ContractDetailsModel();
l_contractSavedSearches_model = new ContractSavedSearchesModel();
l_ContractAdvancedSearch_model = new ContractAdvancedSearchModel();

$(function () {
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/CCConfigurableWorkflow/contractEnhancedSearch", i_locale);
    loadRTLIfRequired(i_locale, rtl_css);

    if (window.parent.parent) {
        customModullarIframe = $('[src*="contractEnhancedSearch.htm"]', window.parent.parent.document);
        if (customModullarIframe) {
            customModullarIframe.css('border', 'none');
        }
    }
    createToastDiv();
    ko.applyBindings(l_contractSearch_model, document.getElementById("div_ContractSearch"));
    ko.applyBindings(l_contractSavedSearches_model, document.getElementById("div_savedSearchesPanel"));
    ko.applyBindings(l_contractSearchResults_model, document.getElementById("div_ContractSearchResults"));
    ko.applyBindings(l_contractDetails_model, document.getElementById("div_ContractDetails"));
    ko.applyBindings(l_contractSearch_model, document.getElementById("div_search_filters"));
    ko.applyBindings(l_contractSearch_model, document.getElementById("div_selectFilterParamLeftOperandModal"));
    $("#div_main_searchpage").show();

    l_searchService.getGeneralCTRPreviewDetails(function (status) {
        if (status == "SUCCESS") {
            l_contractDetails_model.contractDetailsList().forEach(prop => contractProperties[prop.Name] = prop.DisplayName);
        }
    });
    l_searchService.loadAllSavedSearches();

    if (!l_ContractAdvancedSearch_model.isPropertiesLoaded()) {
        l_searchService.ListAllGenOperands(l_ContractAdvancedSearch_model, "", function () {
            l_searchService.ListAllCustOperands(l_ContractAdvancedSearch_model, "", function () {
                l_ContractAdvancedSearch_model.isPropertiesLoaded(true);
            });
        });

    }
});