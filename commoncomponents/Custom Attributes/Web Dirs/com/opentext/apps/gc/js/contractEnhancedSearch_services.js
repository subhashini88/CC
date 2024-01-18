$.cordys.json.defaults.removeNamespacePrefix = true;
var a = 10;
var l_searchService = (function () {
    var self = this;
    self.ListAllGenOperands = function (iModel, searchString = "", callbackfunc) {

        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            method: "GetGeneralAttrWithFilters",
            parameters: {
                "label": searchString,
            },
            success: function (data) {
                addDataToFilterParamLeftOperandLookup(data.GeneralAttributes.FindZ_INT_GeneralAttrListResponse.RelatedGCProps, iModel);
                (typeof callbackfunc === 'function') ? callbackfunc(): "";
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the contract properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.getGeneralCTRPreviewDetails = function (callback) {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            method: "GetGeneralAttrWithFilters",
            async: false,
            parameters: {},
            success: function (data) {
                addDataToContractsDetails(data.GeneralAttributes.FindZ_INT_GeneralAttrListResponse.RelatedGCProps);
                callback("SUCCESS");
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the contract properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.loadAllSavedSearches = function () {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            method: "GetPersonalSavedSearches",
            parameters: {},
            success: function (data) {
                addDataToSavedSearchesView(data.GetUserRelatedSearchesResponse.GCSavedSearch, l_contractSavedSearches_model);
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the rules. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.getContractJSONDataTable = function (inreq, callbackfunc) {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
            method: "GetContractJsonData",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the contract properties. Contact your administrator."), 35000);
                return false;
            }
        });
    }

    self.saveSearch = function () {
        l_contractSearch_model.enableSave(false);
        $.cordys.ajax({
            method: "SaveSearch",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: formSaveSearchObject(l_contractSearch_model, false),
            success: function (responseSuccess) {
                if (responseSuccess) {
                    successToast(3000, "Search saved.");
                    $("#search_rename").css('display', 'none');
                    $('.new-search-hide').attr("style", "display: none");
                    l_contractSearch_model.isDirty(false);
                    l_contractSearch_model.isEditMode(true);
                    l_contractSearch_model.isFavoriteSearch(responseSuccess.CreateGCSavedSearchResponse.GCSavedSearch.IsFavorite === 'true');
                    l_contractSearch_model.savedSearchItemId(responseSuccess.CreateGCSavedSearchResponse.GCSavedSearch['GCSavedSearch-id'].ItemId);
                    self.loadAllSavedSearches();
                } else {
                    showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while saving the search. Contact your administrator."), 10000);
                }
            },
            error: function (responseFailure) {
                l_contractSearch_model.enableSave(true);
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while saving the search. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.updateSavedSearch = function () {
        l_contractSearch_model.enableSave(false);
        $.cordys.ajax({
            method: "UpdateSavedSearch",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: formSaveSearchObject(l_contractSearch_model, true),
            success: function (responseSuccess) {
                if (responseSuccess) {
                    successToast(3000, "Saved search updated.");
                    $("#search_rename").css('display', 'none');
                    $('.new-search-hide').attr("style", "display: none");
                    l_contractSearch_model.isDirty(false);
                    self.loadAllSavedSearches();
                } else {
                    showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while saving the search. Contact your administrator."), 10000);
                }
            },
            error: function (responseFailure) {
                l_contractSearch_model.enableSave(true);
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while saving the search. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.UpdateIsFavorite = function (iModel, callback) {
        $.cordys.ajax({
            method: "UpdateSavedSearch",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            showLoadingIndicator: false,
            parameters: {
                "SavedSearchItemId": iModel.savedSearchItemId(),
                "IsFavorite": (!iModel.isFavoriteSearch()).toString()
            },
            success: function (responseSuccess) {
                callback("SUCCESS");
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while adding to favorites. Contact your administrator."), 10000);
                callback("ERROR")
                return false;
            }
        });
    }

    self.readSavedSearch = function (data) {
        $.cordys.ajax({
            method: "ReadGCSavedSearch",
            namespace: "http://schemas/OpenTextBasicComponents/GCSavedSearch/operations",
            parameters: {
                "GCSavedSearch-id": { "ItemId": data['GCSavedSearch-id'].ItemId }
            },
            success: function (responseSuccess) {
                loadSavedSearchData(responseSuccess.GCSavedSearch);
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while adding to favorites. Contact your administrator."), 10000);
                callback("ERROR")
                return false;
            }
        });
    }

    self.deleteSearch = function (iItemID, callback) {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            method: "DeleteSavedSearch",
            parameters:
            {
                "SavedSearchItemId": iItemID
            },
            success: function (data) {
                successToast(3000, getTranslationMessage("Search deleted."));
                self.loadAllSavedSearches();
                callback("SUCCESS");
            },
            error: function (responseFailure) {
                let errorMsg = responseFailure.responseJSON ? getTextValue(responseFailure.responseJSON.faultstring) : "An error occurred while deleting the saved search.";
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage(`${errorMsg} Contact your administrator.`), 10000);
                return false;
            }
        });
    }

    self.getAllContractProperties = function (iItemID) {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
            method: "GetConPreviewDetails",
            parameters:
            {
                "ContractItemId": iItemID,
            },
            success: function (data) {
                addDataToPreviewProperties(data.ContractProperties);
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading contract details. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.ListAllCustOperands = function (iModel, searchString = "", callbackfunc) {
        $.cordys.ajax({
            method: "GetCustAttrWithFilters",
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            parameters: {
                "label": searchString,
                "offset": "0",
                "limit": "200"
            },
        }).done(function (data) {
            var iElementList = data.FindZ_INT_CustAttrListResponse.AttributeDefinition;
            iModel.customAttrList.removeAll();
            if (iElementList) {
                addDataToFilterParamCustAttrLeftOperandLookup(iElementList, iModel);
                (typeof callbackfunc === 'function') ? callbackfunc(): "";
            }
        }).fail(function (error) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes. Contact your administrator."), 10000);
            return false;
        });
    }

    
self.downloadReport = function(allContractDataJSON) {

    var fileName = "Contracts.xlsx"
    $(".export-button").addClass('disable-click');
    
    $.cordys.ajax
      ({
        namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
        method: "ExportData",
        parameters: allContractDataJSON,
        success: function (data) {
          if (data && data.DownloadExcelResponse && data.DownloadExcelResponse.tuple && data.DownloadExcelResponse.tuple.old && data.DownloadExcelResponse.tuple.old.downloadExcel &&
            data.DownloadExcelResponse.tuple.old.downloadExcel.downloadExcel) {
            self.downloadReportIntoLocal(self.base64ToArrayBuffer(data.DownloadExcelResponse.tuple.old.downloadExcel.downloadExcel), fileName);
            $(".export-button").removeClass('disable-click');

          }
        },
        error: function (error) {
            $(".export-button").removeClass('disable-click');
            errorToast(3000, getTranslationMessage('Unable to export contracts. Ensure that the WS-App services are running.'));
          }
      });
  }
  
  self.downloadReportIntoLocal = function(data, fileName) {
  
    var mimeType = "data:application/vnd.ms-excel;base64";
    var fileName = fileName || "Contracts.xlsx";
    var content = data;
  
    toString = function (a) { return String(a); };
    var blobContent = (window.Blob || window.MozBlob || window.WebKitBlob || toString);
  
    blobContent = blobContent.call ? blobContent.bind(window) : Blob;
  
    var blob = content instanceof blobContent ? content : new blobContent([content], { type: mimeType });
  
    // For IE.
    if (navigator.msSaveBlob) {
      return navigator.msSaveBlob(blob, fileName);
    }
    // Chrome, FF and others.
    if (window.URL) {
      self.downloader(window.URL.createObjectURL(blob), fileName);
    }
    return true;
  }

  self.base64ToArrayBuffer = function(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  
  self.downloader = function(url, fileName) {
    var link = document.createElement("a");
    if ('download' in link) {
      link.href = url;
      link.setAttribute("download", fileName);
      link.style.display = "none";
      document.body.appendChild(link);
      setTimeout(function () {
        link.click();
        document.body.removeChild(link);
        setTimeout(function () { window.URL.revokeObjectURL(link.href); }, 250);
      }, 66);
      return true;
    }
}

self.getDocRepositoryType = function(iModel) {

    $.cordys.ajax
        ({
            namespace: "http://schemas/OpenTextBasicComponents/GC/operations",
            method: "ReadGC",
            async: false,
            success: function (data) {
                if (data && data.GC && data.GC.Document_Repository) {
                    docRepoType = data.GC.Document_Repository;
                    iModel.docRepoType(docRepoType);
                }
            },
            error: function (error) {
                errorToast(3000, getTranslationMessage('Unable to get Document repository type'));
              }
        })}
        
    return self;
}());