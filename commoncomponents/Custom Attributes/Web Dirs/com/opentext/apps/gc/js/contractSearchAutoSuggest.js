$.cordys.json.defaults.removeNamespacePrefix = true;

var l_Operators = {
    "TEXT": "IS EMPTY,IS NOTEMPTY,CONTAINS,=,!=",
    "LOOKUP": "IS EMPTY,IS NOTEMPTY,CONTAINS,=,!=",
    "INTEGER": "IS EMPTY,IS NOTEMPTY,>=,<=,=,!=",
    "BOOLEAN": "=,!=",
    "DURATION": "IS EMPTY,IS NOTEMPTY,>=,<=,=,!=",
    "LONGTEXT": "IS EMPTY,IS NOTEMPTY,CONTAINS,=,!=",
    "DATE": "IS EMPTY,IS NOTEMPTY,>=,<=,=,!=",
    "DECIMAL": "IS EMPTY,IS NOTEMPTY,>=,<=,=,!=",
    "ENUMERATEDTEXT": "IS EMPTY,IS NOTEMPTY,=,!="
};
const aliasNames = {
    'ActionDuration': 'ActBeforeExpirationInDays',
    'AmendType': 'AmendmentType',
    'CancellationComments': 'TerminationComments',
    'CancellationDate': 'TerminationDate',
    'ClientEarlyTermRight': 'ClientEarlyTerminationRight',
    'ContractDocumentType': 'IsExternal',
    'CRMOpportunityID': 'OpportunityID',
    'CRMQuoteID': 'QuoteID',
    'CurrentEndDate': 'CurrentTermEndDate',
    'CurrentStartDate': 'CurrentTermStartDate',
    'CustomerManagerComments': 'AccountManagerComments',
    'DocumentOrigination': 'ContractOrigination',
    'EarlyTerminationConditions': 'TerminationConditions',
    'EndUser': 'EndUserSegment',
    'GeneratedContractId': 'ContractID',
    'InitialContractTenure': 'ContractTerm',
    'InitialExpiryDate': 'InitialExpirationDate',
    'IsExecuted': 'IsExecutedContract',
    'MinStartdate': 'ActualStartDate',
    'NotificationDuration': 'NotifyBeforeExpirationInDays',
    'RelatedOrganization': 'Organization',
    'RenewalDiscount': 'DiscountOnRenewal',
    'RenewalFlagStatus': 'RenewalFlag',
    'SAPOrderID': 'OrderID',
    'StartDate': 'PlannedStartDate',
    'TerminationNoticePeriod': 'TerminationNoticePeriodInDays',
    'ValidatedOn': 'ValidatedDate'
}
var currentFocus;
var genListProps;
var custListProps;
var l_Props = {}; var ctrDisplayNames = []
var nextDataSet = { "Properties": "conditions", "conditions": "value", "value": "operator", "operator": "Properties" };
const myoperatorsAuto = ["=", "!=", "CONTAINS", ">=", "<="];
var l_currentdataset = "Properties";

function checkForAutosuggest() {

    var inp = document.getElementById("input_AdvancedSearchtxt");
    var arr = ctrDisplayNames;
    var lVal = inp.value.substring(0, inp.selectionStart);
    var arrinp = lVal.split(' ');
    var lastVal = arrinp[arrinp.length - 1];
    l_currentdataset = "";
    if (arrinp.length == 1 || lVal.trim == "") {
        l_currentdataset = "Properties";
        autoSuggest(arr);
    } else if (lastVal.startsWith('(')) {
        l_currentdataset = "Properties";
        autoSuggest(arr);
    } else if (lastVal.endsWith('(') || lastVal.startsWith(')') || lastVal.endsWith(')')) {
        //do nothing
    }
    else {
        var lastBefore = arrinp[arrinp.length - 2];
        if (lastBefore == "AND" || lastBefore == "OR" || lastBefore.endsWith('(')) {
            l_currentdataset = "Properties";
            autoSuggest(arr);
        } else if (lastBefore == "EMPTY" || lastBefore == "NOTEMPTY" || lastBefore.endsWith(')') || (lastBefore.endsWith('"') && lastBefore.trim().length > 1)) {
            l_currentdataset = "operator";
            autoSuggest(["AND", "OR"], true);
        } else if (l_Props[lastBefore]) {
            l_currentdataset = "conditions";
            var l_Ops = l_Operators[l_Props[lastBefore]];
            autoSuggest(l_Ops.split(','), true);
        }
    }

    if (!l_currentdataset) {
        closeAllLists();
    }
}
function autocomplete() {
    var inp = document.getElementById("input_AdvancedSearchtxt");
    inp.addEventListener("input", function (e) {
        checkForAutosuggest();
    });


    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            e.preventDefault();
            currentFocus++;
            if(x[currentFocus]){
                x[currentFocus].scrollIntoView({block: "nearest", inline: "nearest"});
            }else {
                currentFocus--;
            }
            addActive(x);
        } else if (e.keyCode == 38) {
            e.preventDefault();
            currentFocus--;
            if(x[currentFocus]){
                x[currentFocus].scrollIntoView({block: "nearest", inline: "nearest"});
            }else {
                currentFocus++;
            }
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }   
        } else if(e.keyCode == 27) {
            closeAllLists();
        }
        return true;
    });


    document.addEventListener('click', function (event) {
        if(event.target.matches('#input_AdvancedSearchtxt')) {
            var inp =  document.getElementById("input_AdvancedSearchtxt");
            if(inp.value=='' || inp.value.length<1){
                checkForAutosuggest();
                return false;
            }
        }
        if(!event.target.parentElement.matches('#input_AdvancedSearchtxtautocomplete-list') && !event.target.matches('#input_AdvancedSearchtxtautocomplete-list')) {
            closeAllLists();
        }
    });

}

function autoSuggest(arr, iSkipCompare) {
    var elm = document.getElementById("input_AdvancedSearchtxt");
    var a, b, i;
    var l_val = elm.value;
    var l_selecStar = elm.selectionStart;
    var l_curStar = l_val.substring(0, l_selecStar).lastIndexOf(" ");
    var braceRemoved = false;
    var val = l_val.substring(l_curStar + 1, l_selecStar + 1).trim();
    if (val.startsWith('(')) {
        braceRemoved = true;
        val = val.substring(1);
    }
    closeAllLists();
    currentFocus = -1;

    a = document.createElement("DIV");
    a.setAttribute("id", elm.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    elm.parentNode.appendChild(a);

    for (var i = 0; i < arr.length; i++) {
        if (iSkipCompare || val.toUpperCase().length == 0 || (arr[i].toUpperCase().indexOf(val.toUpperCase()) >= 0)) {
            b = document.createElement("DIV");

            if (val.toUpperCase().length == 0 || iSkipCompare) {
                b.innerHTML = arr[i];
            } else {
                var index = arr[i].toUpperCase().indexOf(val.toUpperCase());
                if (index > 0) {
                    var startStr = arr[i].substr(0, index);
                    b.innerHTML = startStr + "<strong>" + arr[i].substr(index, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(startStr.length + val.length);
                } else {
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                }

            }

            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

            b.addEventListener("click", function (e) {
                var l_selectedValue = this.getElementsByTagName("input")[0].value;
                if (braceRemoved) {
                    l_selectedValue = '(' + l_selectedValue;
                }
                var textWithSelectedValue = l_val.substring(0, l_curStar + 1) + l_selectedValue;
                elm.value = textWithSelectedValue + ' ' + l_val.substring(l_selecStar);
                closeAllLists();
                l_contractSearch_model.enableSearch(true);
                l_contractSearch_model.isDirty(true);
                elm.focus();
                elm.selectionStart = textWithSelectedValue.length + 1;
                elm.selectionEnd = textWithSelectedValue.length + 1;
                SuggestNextDataset(l_selectedValue);
            });
            a.appendChild(b);
        }
    }
}

function SuggestNextDataset(iSelectedValue) {
    l_currentdataset = nextDataSet[l_currentdataset];
    if (l_currentdataset == "conditions") {
        var l_Ops = l_Operators[l_Props[iSelectedValue]];
        autoSuggest(l_Ops.split(','), true);
    }
    else if (l_currentdataset == "Properties") {
        autoSuggest(ctrDisplayNames);
    }
    else if (l_currentdataset == "value") {
        if (iSelectedValue.trim() == "IS EMPTY" || iSelectedValue.trim() == "IS NOTEMPTY") {
            l_currentdataset = "operator"
            autoSuggest(["AND", "OR"], true);
        }
    }
}


function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
}
function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}
function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    var inp = document.getElementById("input_AdvancedSearchtxt");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

function updateData() {
    Object.keys(genListProps).forEach(function (key) {

        if (aliasNames[genListProps[key].Name]) {
            l_Props[aliasNames[genListProps[key].Name]] = genListProps[key].DataType;
            ctrDisplayNames.push(aliasNames[genListProps[key].Name]);
        } else {
            l_Props[genListProps[key].Name] = genListProps[key].DataType;
            ctrDisplayNames.push(genListProps[key].Name);
        }
    });

    Object.keys(custListProps).forEach(function (key) {
        l_Props[custListProps[key].Name] = custListProps[key].DataType;
        ctrDisplayNames.push(custListProps[key].Name);
    });
}

function fetchNamefromAlias(l_value) {
    var actualname = Object.keys(aliasNames).find(key => aliasNames[key] === l_value);
    return actualname;
}