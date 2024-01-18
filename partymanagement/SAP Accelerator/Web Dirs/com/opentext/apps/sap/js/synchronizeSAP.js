function syncVendors() {
  $.cordys.ajax
    ({
      namespace: "http://schemas.cordys.com/default",
      method: "CreateOrUpdateSAPVendors",
      error: function (error) {
        errorToast(3000, getTranslationMessage('Vendors synchronisation failed. Synchronize again.'));
      },
      success: function (data) {
        successToast(3000, getTranslationMessage('Vendors synchronisation started.'));
      }
    });
}

function syncCustomers() {
  $.cordys.ajax
    ({
      namespace: "http://schemas.cordys.com/default",
      method: "CreateOrUpdateSAPCustomers",
      error: function (error) {
        errorToast(3000, getTranslationMessage('Customers synchronisation failed. Synchronize again.'));
      },
      success: function (data) {
        successToast(3000, getTranslationMessage('Customers synchronisation started.'));
      }
    });
}

function syncCompanies() {
  $.cordys.ajax
    ({
      namespace: "http://schemas.cordys.com/default",
      method: "CreateOrUpdateSAPCompanies",
      error: function (error) {
        errorToast(3000, getTranslationMessage('Companies synchronisation failed. Synchronize again.'));
      },
      success: function (data) {
        successToast(3000, getTranslationMessage('Companies synchronisation started.'));
      }
    });
}
function syncCustomerContacts() {
  $.cordys.ajax
    ({
      namespace: "http://schemas.cordys.com/default",
      method: "CreateOrUpdateSAPCustomerContacts",
      error: function (error) {
        errorToast(3000, getTranslationMessage('Customer contacts synchronisation failed. Synchronize again.'));
      },
      success: function (data) {
        successToast(3000, getTranslationMessage('Customer contacts synchronisation started.'));
      }
    });	
}
