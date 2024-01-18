$.cordys.json.defaults.removeNamespacePrefix = true;
const _contract_Definition_ID = "005056C00008A1E795653A59509D399D";
const _contract_Content_Definition_ID = "B4B676CD53D8A1E7A1F7CCB8062AE4BF";
const _contract_Layout_ID = "F8B156D635F3A1E89CB08DDB9883E4C8";
const _contract_Content_Layout_ID = "C4D98747AA4EA1E7B4099DD048208067";
const _template_Definition_ID = "C4D98747A6D9A1E8AC34736789FC486E";
const _template_Content_Definition_ID = "484D7EEB7112A1E98D011E255FBEE518";
const _template_Layout_ID = "C4D98747A6D9A1E8AC6C233A4C55886E";
const _template_Content_Layout_ID = "484D7EEB7112A1E9906567E508B22519";
const BUSINESS_WORKSPACE = "BUSINESS_WORKSPACE";
const NOT_UPDATED = "NOT_UPDATED";

$(document).ready(function () {
    loadAllSearchConfigurations();
    ko.applyBindings(search_list_model, document.getElementById("searchContainer"));
    ko.applyBindings(doc_details_model, document.getElementById("div_docDetails"));
    $("#searchButton").click(function () {
        if ($("#searchField").val() && $("#searchPath").val()) {
            if (DateValidation()) {
                if(search_list_model.repositoryType()===NOT_UPDATED){
                    getRepositoryType(function () {
                        search(true);   
                    });
                }else{
                    search(true);
                }
            }
        }
    });

    $("#searchButton").prop("disabled", true).css({ 'backgroundColor': '#a9a7a7', 'border': '0', 'opacity': 'unset' });

    loadDatePicker();

    $("#btn_closePopup").on("click", function () {
        $("#div_docDetails").removeClass("show");
    });
	document.getElementById("searchResultsTable").addEventListener("wheel", closeMoredetais);
});

var SearchListModel = function () {
    var self = this;
    self.search_paths = ko.observableArray([{ name: getTranslationMessage("- Select search configuration -") }]);
    self.search_response_nodes = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.results_selected_count = ko.observable('');
    self.total_results_count = ko.observable();
    self.include_results_count = ko.observable();
    self.repositoryType = ko.observable(NOT_UPDATED);
}

var DocDetailsModel = function () {
    var self = this;
    self.ItemID = ko.observable();
    self.InstanceID = ko.observable();
	self.DocumentType = ko.observable();
    self.InstanceURL = ko.observable();
    self.DocumentURL = ko.observable();
	self.ContractItemID = ko.observable();
    self.TemplateItemID = ko.observable();
}

var search_list_model = new SearchListModel();
var doc_details_model = new DocDetailsModel();
var is_last_page_clicked = 0;
var is_first_page_clicked = 0;
var offsetValue = 0;
var limitValue = 25;

function loadAllSearchConfigurations() {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/commonsearch/19.2",
        method: "FilteredSearchConfigurations",
        error: function (error) {

        },
        success: function (data) {
            var response = data.FilteredSearchConfig.FindFilteredSearchConfigurationResponse.SearchAssignment;
            if (response) {
                if (response.length) {
                    var duplicates = [];
                    var uniqueResponse = response.filter(function (el) {
                        if (duplicates.indexOf(el["SearchAssignment-id"].Id) == -1) {
                            duplicates.push(el["SearchAssignment-id"].Id);
                            return true;
                        }
                        return false;
                    });
                    if (uniqueResponse.length) {
                        for (var i = 0; i < uniqueResponse.length; i++) {
                            search_list_model.search_paths.push({
                                name: uniqueResponse[i].Owner.Name.text,
                                SearchPath: uniqueResponse[i].Owner.SearchPath.text
                            })
                        }
                    }
                    else {
                        if (uniqueResponse.Owner) {
                            search_list_model.search_paths.push({
                                name: uniqueResponse.Owner.Name.text,
                                SearchPath: uniqueResponse.Owner.SearchPath.text
                            })
                        }
                    }
                }
                else {
                    search_list_model.search_paths.push({
                        name: response.Owner.Name.text,
                        SearchPath: response.Owner.SearchPath.text
                    })
                }
            }
        }
    })
}

function search(isInitialSearch) {
    var inputRequest = formInputRequest(isInitialSearch);
    if (isInitialSearch) {
        resetPagination();
    }
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/commonsearch/19.2",
        method: "SearchDocStore",
        parameters: inputRequest,
        error: function () {
            $("#no_results,#searchResultsTable").hide();
        },
        success: function (data) {
            if (data.Nodes.Node || (data.Nodes.Node && data.Nodes.Node.length > 0)) {
                $("#no_results").hide();
                $("#searchResultsTable").show();
                searchResponse_array = data.Nodes.Node;
                //search_list_model.search_response_nodes(searchResponse_array);
                //formInstanceID(searchResponse_array);
                addDatatoSearchResultsTable(searchResponse_array);
                if (data.Pagination.ActualCount) {
                    search_list_model.total_results_count(data.Pagination.ActualCount);
                    search_list_model.include_results_count(data.Pagination.IncludeCount);
                    $("#paginationID").css({ 'display': 'block' });
                    if (search_list_model.total_results_count() <= limitValue) {
                        search_list_model.currentPage('1');
                        $('#decrementer,#incrementer').css('display', 'none');
                    }
                }
            } else {
                $("#searchResultsTable").hide();
                $("#no_results").show();
            }
        }
    })
}

function formInputRequest(isInitialSearch) {
    const searchText = $("#searchField").val();
    var request;
    request = '<SearchText>' + searchText + '</SearchText>';
    request = addSearchOptions(request);
    request = addOrderByInfo(request);
    request = addPaginationInfo(request, isInitialSearch);
    return request;
}

function addSearchOptions(request) {
    const searchRoot = $("#searchPath").val();
    const createdBy = $("#createdBy").val();
    const createdFromDate = $("#createdFromDate").val();
    const createdToDate = $("#createdToDate").val();
    const modifiedFromDate = $("#modifiedFromDate").val();
    const modifiedToDate = $("#modifiedToDate").val();

    if (searchRoot || createdBy || createdFromDate || createdToDate || modifiedFromDate || modifiedToDate) {
        request += '<SearchOptions>';
        if (searchRoot) {
            request += '<SearchRoot>' + searchRoot + '</SearchRoot>'
        }
        if (createdBy) {
            request += '<CreatedBy>' + createdBy + '</CreatedBy>';
        }
        if (createdFromDate || createdToDate || modifiedFromDate || modifiedToDate) {
            request += '<DateRange>'
            if (createdFromDate && createdToDate)
                request += '<CreatedDate><From>' + createdFromDate + '</From><To>' + createdToDate + '</To></CreatedDate>'
            if (modifiedFromDate && modifiedToDate)
                request += '<LastModifiedDate><From>' + modifiedFromDate + '</From><To>' + modifiedToDate + '</To></LastModifiedDate>'
            request += '</DateRange>'
        }
        request += '</SearchOptions>';
    }
    return request;
}

function addPaginationInfo(request, isInitialSearch) {
    if (isInitialSearch) {
        offsetValue = 0;
    }
    request += '<Pagination>' +
        '<StartPosition>' + (offsetValue + 1) + '</StartPosition>' +
        '<PageSize>' + limitValue + '</PageSize>' +
        '</Pagination>';
    return request;
}

function addOrderByInfo(request) {
    var orderByProperty1 = $("#orderBy").val();
    if (orderByProperty1) {
        request += '<OrderBy>';
        let order = $("#orderByParam1").val();
        order = ('DESC' === order) ? 'descending' : 'ascending';
        switch (orderByProperty1) {
            case "CreatedDate":
                request += '<CreatedDate>' + order + '</CreatedDate>';
                break;
            case "LastModifiedDate":
                request += '<LastModifiedDate>' + order + '</LastModifiedDate>';
                break;
            case "NodeName":
                request += '<NodeName>' + order + '</NodeName>';
                break;
            case "MimeType":
                request += '<MimeType>' + order + '</MimeType>';
                break;
            case "CreatedBy":
                request += '<CreatedBy>' + order + '</CreatedBy>';
                break;
            case "Size":
                request += '<Size>' + order + '</Size>';
                break;
        }
        request += '</OrderBy>';
    }
    return request;
}

function orderByToggle1(orderBy) {
    $("#orderByParam1").val(orderBy);
    if ('DESC' === orderBy) {
        $("#ascButton1").removeClass('active');
        $("#descButton1").addClass('active');
    } else {
        $("#descButton1").removeClass('active');
        $("#ascButton1").addClass('active');
    }
}

function ListAllSearchResults() {
    if (is_first_page_clicked) {
        offsetValue = 0;
        search_list_model.currentPage('1');
        $('#incrementer').css('display', 'inline');
        $('#decrementer').css('display', 'none');
        is_first_page_clicked = 0;
    }
    if (is_last_page_clicked) {
        offsetValue = (Math.ceil(search_list_model.total_results_count() / limitValue) - 1) * limitValue;
        search_list_model.currentPage(Math.ceil(search_list_model.total_results_count() / limitValue));
        $('#incrementer').css('display', 'none');
        $('#decrementer').css('display', 'inline');
        is_last_page_clicked = 0;
    }
    if (search_list_model.currentPage() === 1) {
        offsetValue = 0;
    }
    if (search_list_model.total_results_count() <= limitValue) {
        search_list_model.currentPage('1');
        $('#decrementer,#incrementer').css('display', 'none');
    }
    search(false);
}

function incrementOffsetLimit() {
    search_list_model.results_selected_count('');
    if (search_list_model.currentPage() < Math.ceil(search_list_model.total_results_count() / limitValue)) {
        offsetValue = offsetValue + limitValue;
        search_list_model.currentPage(isNaN(parseInt(search_list_model.currentPage())) ? 0 : parseInt(search_list_model.currentPage()));
        search_list_model.currentPage(parseInt(search_list_model.currentPage()) + 1);
    }
    if (search_list_model.currentPage() == Math.ceil(search_list_model.total_results_count() / limitValue)) {
        document.getElementById("incrementer").style.display = "none";
    }
    if (search_list_model.currentPage() > 1) {
        document.getElementById("decrementer").style.removeProperty("display");
    }
    ListAllSearchResults();
}

function decrementOffsetLimit() {
    search_list_model.results_selected_count('');
    if (search_list_model.currentPage() > 1) {
        offsetValue = offsetValue - limitValue;
        search_list_model.currentPage(parseInt(search_list_model.currentPage()) - 1);
    }
    if (search_list_model.currentPage() < Math.ceil(search_list_model.total_results_count() / limitValue)) {
        document.getElementById("incrementer").style.removeProperty("display");
    }
    if (search_list_model.currentPage() == 1) {
        document.getElementById("decrementer").style.display = "none";
    }
    if (search_list_model.currentPage() < 1)
        return;
    ListAllSearchResults();
}

function incrementToLast() {
    is_last_page_clicked = 1;
    ListAllSearchResults();
}

function decrementToLast() {
    is_first_page_clicked = 1;
    ListAllSearchResults();
}

function resetPagination() {
    offsetValue = 0;
    search_list_model.currentPage('1');
    $('#incrementer').css('display', 'inline');
    $('#decrementer').css('display', 'none');
}

function addDatatoSearchResultsTable(searchResponseArray) {
    var responseLength = searchResponseArray.length;

    if (searchResponseArray && responseLength === undefined) {
        if (searchResponseArray.Name === undefined) {
            searchResponseArray.Name = "";
        }
        if (searchResponseArray.MimeType === undefined) {
            searchResponseArray.MimeType = "";
        }
        if (searchResponseArray.Version === undefined) {
            searchResponseArray.Version = "";
        }
        if (searchResponseArray.CreationDate === undefined) {
            searchResponseArray.CreationDate = "";
        }
        if (searchResponseArray.CreatedBy === undefined) {
            searchResponseArray.CreatedBy = "";
        }
        if (searchResponseArray.LastModifiedDate === undefined) {
            searchResponseArray.LastModifiedDate = "";
        }
    }
    if (responseLength > 0) {
        for (var h = 0; h < responseLength; h++) {
            if (searchResponseArray[h].Name === undefined) {
                searchResponseArray[h].Name = "";
            }
            if (searchResponseArray[h].MimeType === undefined) {
                searchResponseArray[h].MimeType = "";
            }
            if (searchResponseArray[h].Version === undefined) {
                searchResponseArray[h].Version = "";
            }
            if (searchResponseArray[h].CreationDate === undefined) {
                searchResponseArray[h].CreationDate = "";
            }
            if (searchResponseArray[h].CreatedBy === undefined) {
                searchResponseArray[h].CreatedBy = "";
            }
            if (searchResponseArray[h].LastModifiedDate === undefined) {
                searchResponseArray[h].LastModifiedDate = "";
            }
        }
    }

    search_list_model.search_response_nodes(searchResponseArray);
}

function enableDisableSearchButton() {
    if ($("#searchField").val() && $("#searchPath").val()) {
        $("#searchButton").prop("disabled", false).css({ 'backgroundColor': '#232E72' });
    }
    else {
        $("#searchButton").prop("disabled", true).css({ 'backgroundColor': '#a9a7a7', 'border': '0', 'opacity': 'unset' });
    }
}

function loadDatePicker() {
    var dateFormat = "yy-mm-dd",
        createdFrom = $("#createdFromDate")
            .datepicker({
                defaultDate: "+1w",
                numberOfMonths: 1,
                dateFormat: "yy-mm-dd",
                buttonImage: '../img/date_picker18.svg',
                buttonImageOnly: true,
                buttonText: '',
                changeMonth: true,
                changeYear: true,
                showOn: 'button'
            })
            .on("change", function () {
                createdTo.datepicker("option", "minDate", getDate(this));
            }),
        createdTo = $("#createdToDate").datepicker({
            defaultDate: "+1w",
            numberOfMonths: 1,
            dateFormat: "yy-mm-dd",
            buttonImage: '../img/date_picker18.svg',
            buttonImageOnly: true,
            buttonText: '',
            changeMonth: true,
            changeYear: true,
            showOn: 'button'
        })
            .on("change", function () {
                createdFrom.datepicker("option", "maxDate", getDate(this));
            });

    modifiedFrom = $("#modifiedFromDate")
        .datepicker({
            defaultDate: "+1w",
            numberOfMonths: 1,
            dateFormat: "yy-mm-dd",
            buttonImage: '../img/date_picker18.svg',
            buttonImageOnly: true,
            buttonText: '',
            changeMonth: true,
            changeYear: true,
            showOn: 'button'
        })
        .on("change", function () {
            modifiedTo.datepicker("option", "minDate", getDate(this));
        }),
        modifiedTo = $("#modifiedToDate").datepicker({
            defaultDate: "+1w",
            numberOfMonths: 1,
            dateFormat: "yy-mm-dd",
            buttonImage: '../img/date_picker18.svg',
            buttonImageOnly: true,
            buttonText: '',
            changeMonth: true,
            changeYear: true,
            showOn: 'button'
        })
            .on("change", function () {
                modifiedFrom.datepicker("option", "maxDate", getDate(this));
            });
    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
            $("#" + element.id).removeClass("date-error");
            $("#" + element.id + "_InvalidMsg").hide();
        } catch (error) {
            date = null;
            $("#" + element.id).addClass("date-error")
            $("#" + element.id + "_InvalidMsg").show();
        }

        return date;
    }
}

function DateValidation() {
    var validationFlag = true;
    var createdFrom = $("#createdFromDate");
    var createdTo = $("#createdToDate");
    var createdFromErr = $("#createdFrom-error-msg");
    var createdToErr = $("#createdTo-error-msg");
    var modifiedFrom = $("#modifiedFromDate");
    var modifiedTo = $("#modifiedToDate");
    var modifiedFromErr = $("#modifiedFrom-error-msg");
    var modifiedToErr = $("#modifiedTo-error-msg");

    if (createdFrom.val() == "" && createdTo.val() == "") {
        createdFrom.removeClass("date-error");
        createdTo.removeClass("date-error");
        createdFromErr.hide();
        createdToErr.hide();
    }
    if (modifiedFrom.val() == "" && modifiedTo.val() == "") {
        modifiedFrom.removeClass("date-error");
        modifiedTo.removeClass("date-error");
        modifiedFromErr.hide();
        modifiedToErr.hide();
    }
    if (createdFrom.val() && createdTo.val() == "") {
        createdTo.addClass("date-error");
        createdToErr.show();
        validationFlag = false;
    }
    if (createdFrom.val() == "" && createdTo.val()) {
        createdFrom.addClass("date-error");
        createdFromErr.show();
        validationFlag = false;
    }

    if (modifiedFrom.val() && modifiedTo.val() == "") {
        modifiedTo.addClass("date-error");
        modifiedToErr.show();
        validationFlag = false;
    }
    if (modifiedFrom.val() == "" && modifiedTo.val()) {
        modifiedFrom.addClass("date-error");
        modifiedFromErr.show();
        validationFlag = false;
    }
    return validationFlag;
}

function removeErrorClass(e1, e2) {
    $('#' + e2).removeClass("date-error");
    $('#' + e1).hide();
}

function navigateToInstanceURL(i_data) {
    if (i_data.InstanceID != "Not available") {
        document.getElementById("navigateToInstanceURL").innerHTML = i_data.InstanceID;
        document.getElementById("navigateToInstanceURL").setAttribute("href", '../../../../../app/start/web/perform/item/' + i_data.LayoutID);
    }
    else {
        document.getElementById("navigateToInstanceURL").innerHTML = "Not available";
        document.getElementById("navigateToInstanceURL").setAttribute("href", '');
    }
}

function navigateToDocumentURL(i_data) {
    document.getElementById("navigateToDocumentURL").setAttribute("href", '../../../../../app/start/web/perform/item/' + i_data.ItemID + '/%20/4938c4fb24333efe8dff2e3350b3d02b/%20/LWYBC05KIBYIBI6OIOAWOVM364580T5E');
}

function openDocDetails(index, data, event) {
    $("#div_docDetails").removeClass("show");
    var left = event.clientX + "px";
    var top = event.clientY + "px";
    var div = document.getElementById("div_docDetails");
    div.style.right = (window.innerWidth-event.clientX) + "px";
    div.style.top = top;
    if(!isXECM() ){
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/commonsearch/19.2",
            method: "GetDocumentDetails",
            parameters:
            {
                "docLocation": data.Location
            },
            error: function () {
    
            },
            success: function (data) {
                if (data.docdetails) {
                    updateDocDetails(data.docdetails);
                } else {
                    displayInstanceDetails("Not available");
                }
                $("#div_docDetails").addClass("show");
            }
        });
    }else{
        // GetDocumentById
        $.cordys.ajax({
            namespace: "http://schemas.cordys.com/documentstore/default/2.0",
            method: "GetDocumentById",
            parameters:
            {
                "DocumentId": data.Id
            },
            error: function () {
                displayInstanceDetails("Not available");
            },
            success: function (data) {
                if (data && data.Properties && data.Properties.Property) {
                   var contractMetaData= data.Properties.Property.filter(ele=> ele.Name==="ItemID" || ele.Name==="ItemId");
                    updateDocDetails(contractMetaData[0],data);
                } else {
                    displayInstanceDetails("Not available");
                }
                $("#div_docDetails").addClass("show");
            }
        });
    }
}

function updateDocDetails(docdetailsresponse, iData) {
    if (docdetailsresponse) {
        if(!isXECM()){
            doc_details_model.ItemID(docdetailsresponse.ItemID);
        }else{
            doc_details_model.ItemID(docdetailsresponse.Value);
        }
        var temp = doc_details_model.ItemID();
        if (temp != "Not available") {
            var definition_id = temp.split('.')[0];
            if (definition_id === _contract_Content_Definition_ID || definition_id === _contract_Definition_ID) {
                instanceId = 'CTR-' + temp.split('.')[1];
				doc_details_model.DocumentType("Contract");
                l_Contract_Instance_URL = '../../../../../app/start/web/perform/item/' + _contract_Definition_ID + '.' + temp.split('.')[1] + '/' + _contract_Layout_ID;
				doc_details_model.ContractItemID(_contract_Definition_ID + '.' + temp.split('.')[1]) ;
                doc_details_model.InstanceURL(l_Contract_Instance_URL);
                if(!isXECM()){
                    l_Contract_Document_Instance_URL = '../../../../../app/start/web/perform/item/' + temp + '/' + _contract_Content_Layout_ID;
                }else{
                    l_Contract_Document_Instance_URL = '../../../../../app/documentservices/testviewer.html?docId='+iData.Id+'&isPreviewPanel=true&pageId=1';
                }
                doc_details_model.DocumentURL(l_Contract_Document_Instance_URL);
            }
            else if (definition_id === _template_Content_Definition_ID) {
                instanceId = 'TEM-' + temp.split('.')[1];
				doc_details_model.DocumentType("Template");
                l_Template_Instance_URL = '../../../../../app/start/web/perform/item/' + _template_Definition_ID + '.' + temp.split('.')[1] + '/' + _template_Layout_ID;
				doc_details_model.TemplateItemID( _template_Definition_ID + '.' + temp.split('.')[1]);
                doc_details_model.InstanceURL(l_Template_Instance_URL);
                l_Template_Document_Instance_URL = '../../../../../app/start/web/perform/item/' + temp + '/' + _template_Content_Layout_ID;
                doc_details_model.DocumentURL(l_Template_Document_Instance_URL);
            }
            else {
                instanceId = "Not available";
            }
        }
        else {
            instanceId = "Not available";
        }
        displayInstanceDetails(instanceId);
    }else{
        displayInstanceDetails("Not available");
    }
}

function openInstanceURL() {
	if(doc_details_model.ContractItemID()!=undefined){
	navigateToInstance(doc_details_model.ContractItemID(),"Contract",{"layoutID":'F8B156D635F3A1E89CB08DDB9883E4C8', "clearBreadcrumb":false,"breadcrumbName" : ''});
	}
	else if(doc_details_model.TemplateItemID()!=undefined){
	navigateToInstance(doc_details_model.TemplateItemID(),"Template",{"layoutID":'C4D98747A6D9A1E8AC34736789FC486E', "clearBreadcrumb":false,"breadcrumbName" : ''});
	}
}

function openDocumentURL() {
	if(doc_details_model.ContractItemID()!=undefined){
		if(!isXECM()){
				navigateToInstance(doc_details_model.ItemID(),"ContractContent",{"layoutID":_contract_Content_Layout_ID, "clearBreadcrumb":false,"breadcrumbName" : ''});
        }else{
			var xecm_Doc_Window=window.open(l_Contract_Document_Instance_URL);
			xecm_Doc_Window.focus();
		}
	}
	else if(doc_details_model.TemplateItemID()!=undefined){
		navigateToInstance(doc_details_model.ItemID(),"TemplateContent",{"layoutID":_template_Content_Layout_ID, "clearBreadcrumb":false,"breadcrumbName" : ''});
	}
	
}

function displayInstanceDetails(instanceId){
    doc_details_model.InstanceID(instanceId);
    var docdetailsDiv = document.getElementById("div_docDetails");
    if(instanceId == "Not available"){
        docdetailsDiv.style.height = "65px";
        docdetailsDiv.style.width = "250px";
    } else {
        docdetailsDiv.style.height = "85px";
        docdetailsDiv.style.width = "250px";
    }
}

function closeMoredetais() {
  $("#div_docDetails").removeClass("show");
}


function isXECM() {
    return (search_list_model.repositoryType() && search_list_model.repositoryType() === BUSINESS_WORKSPACE);
}

function getRepositoryType(callBackFunc) {
    if (search_list_model.repositoryType()===NOT_UPDATED) {
        $.cordys.ajax({
            method: "GetPropertyByName",
            namespace: "http://schemas/OpenTextBasicComponents/GCProperties/operations",
            parameters: {
                Name: "DOCUMENT_REPOSITORY"
            }
        }).done(function (data) {
            var repoType =  (data.GCProperties && data.GCProperties.value===BUSINESS_WORKSPACE)?  BUSINESS_WORKSPACE: "" ;
            search_list_model.repositoryType(repoType);
            callBackFunc();
        }).fail(function (error) { });
    } else {
        callBackFunc();
    }
}