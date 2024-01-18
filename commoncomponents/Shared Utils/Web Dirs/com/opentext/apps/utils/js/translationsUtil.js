var mBundle;
var ilocale;
var l_globalize = getGlobalizeObject();

function getGlobalizeObject() {
    var l_globalizeObj;
    var l_window = window;
    do {
        l_window = l_window.parent;
        if (l_window.Globalize) {
            l_globalizeObj = l_window.Globalize;
            return l_globalizeObj;
        }
    } while (l_window.parent != l_window);
}

function getlocale() {
    var finalLocale = "en-US";
    queryStringLocale = getQueryStringLocale();
    browserLocale = getBrowserLocale();
    if (queryStringLocale === '') {
        if (!(browserLocale === '')) {
            finalLocale = browserLocale;
        }
    } else {
        finalLocale = queryStringLocale;
    }
    return finalLocale;
}

function getQueryStringLocale() {
    var l_paramValue = "";
    var l_curLocation = window.location.search;
    if (l_curLocation && l_curLocation.length) {
        var l_parArray = l_curLocation.split("?")[1];
        if (l_parArray && l_parArray.length) {
            var l_parameters = l_parArray.split("&");
            for (var i = 0; i < l_parameters.length; i++) {
                l_parameter = l_parameters[i].split("=");
                if (l_parameter[0] && l_parameter[0].toLowerCase() == 'language'.toLowerCase()) {
                    //return decodeURIComponent(l_parameter[1]); will uncomment this line when url language parameter is supported
                    return "";
                }
            }
        }
    }
    return l_paramValue;
}

function getBrowserLocale() {
    var browserLocale = window.navigator.userLanguage || window.navigator.language;
    if (browserLocale === undefined || browserLocale === null) {
        browserLocale = '';
    }
    return browserLocale;
}

function translateLabels(i_jsBundleLocation, i_locale, bTranslateplaceHolders) {
    $.cordys.translation.getBundle(i_jsBundleLocation, i_locale).done(function (messageBundle) {
        mBundle = messageBundle;
        mBundle.translate();
        if ((bTranslateplaceHolders == true) && (typeof(translatePlaceHolders)!='undefined')) {
            translatePlaceHolders();
        }
    });
}

function getTranslationMessage(i_translationText, i_arr) {
    if (mBundle && mBundle.getMessage(i_translationText)) {
        if (arguments.length > 1)
            return mBundle.getMessage(arguments[0], arguments[1], arguments[2], arguments[3]);
        else
            return mBundle.getMessage(arguments[0]);
    }
    else {
        return arguments[0];
    }
}

function loadRTLIfRequired(locale, cssFileLocation) {
    if (locale) {
        if ('ar' === locale.substring(0, 2)) {
            var cssId = 'rtl-css';
            if (!document.getElementById(cssId)) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
				const bodyElement = document.querySelector("body");
                link.id = cssId;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = cssFileLocation;
                head.appendChild(link);
				bodyElement.classList.remove("cc-ltr");
				bodyElement.classList.add("cc-rtl");
			    
            }
        }
    }
}

function translatePage() {
    if (mBundle) { mBundle.translate(); }
}

function getDateObject() {
    var l_dateObj;
    var l_window = window;
    do {
        l_window = l_window.parent;
        if (l_window.Date) {
            l_dateObj = l_window.Date;
            return l_dateObj;
        }
    } while (l_window.parent != l_window);
}
// Code from here is taken form AWP client code -- need to change depending upon their updates

function formateNumbertoLocale(val, options) {
    if (val) {
        val = Number(val);
        if (l_globalize === undefined) {
            l_globalize = getGlobalizeObject();
        }
        return l_globalize.formatNumber(val);
    }
    return '';
}

function formateCurrencyInUSD(val) {
    if (val) {
        val = Number(val);
        if (l_globalize === undefined) {
            l_globalize = getGlobalizeObject();
        }
        return l_globalize.formatCurrency(val, "USD");
    }
    return '';
}

function formateDatetoLocale(val, options) {
    if (l_globalize === undefined) {
        l_globalize = getGlobalizeObject();
    }
    val = val.replace('Z', '')
    if (typeof val === 'string') {
        var parts = val.split('-');
        l_dateObj = getDateObject();
        val = new l_dateObj(parts[0], parts[1] - 1, parts[2])
    }
    var formatOptions = generateDateFormatOptionsforLocale(options, 'Date');
    return l_globalize.formatDate(val, formatOptions);
}

function generateDateFormatOptionsforLocale(options, type) {
    var formatOptions = {};
    if (!options) {
        return {
            skeleton: 'yMd'
        };
    }
    if (options.PatternType === 'Skeleton') {
        formatOptions[options.PatternType.toLowerCase()] = options.Pattern;
    } else if (options.PatternType === 'ISO8601') {
        if (type === 'DateTime') {
            formatOptions.raw = 'yyyy-MM-dd HH:mm:ss';
        } else {
            formatOptions.raw = options.Pattern;
        }
    }
    return formatOptions;
}

function getFormattedIntegertoLocale(value) {
    if (l_globalize === undefined) {
        l_globalize = getGlobalizeObject();
    }
    if (Number.isInteger(parseInt(value))) {
        return formatedValue = l_globalize.formatNumber(Number(cleanNumber(value)), {
            style: 'decimal',
            useGrouping: true
        });;
    }
}

function cleanNumber(value) {
    var val = String(value);
    var returnValue = '';
    var decimalSeperator = getDecimalSeparator(getlocale());
    //remove the group separator
    for (var pos = 0; pos < val.length; pos++) {
        if (val.charAt(pos) !== decimalSeperator.group) {
            returnValue += val.charAt(pos);
        }
    }
    //if the decimal separator is not a full stop, replace it with one
    if (decimalSeperator.decimal !== '.') {
        returnValue = returnValue.replace(decimalSeperator.decimal, '.');
    }
    return returnValue;
}

function getFormattedBigDecimaltoLocale(value, format, originalType, type, options) {
    var decimalSeperator = getDecimalSeparator();
    if (value === decimalSeperator.decimal || value === '-') {
        return value;
    }
    return formatBigDecimal(value, "2");
}

function formatBigDecimal(value, scale) {
    var decimalSeparator;
    var groupSeparator;
    if (!decimalSeparator || !groupSeparator) {
        var sep = getDecimalSeparator();
        decimalSeparator = sep ? sep.decimal : '.';
        groupSeparator = sep ? sep.group : ',';
    }
    var stringValue = (typeof value === 'string') ? value : value.toString();
    var split;
    if (value.indexOf('.') > -1) {
        split = stringValue.split('.');
    } else {
        split = stringValue.split(decimalSeparator);
    }
    var right = split.length > 1 ? split[1] : '';
    var left;
    if (split[0].indexOf('-') !== -1) {
        var leftPartWithOutNeg = split[0].split('-')[1];
        left = formatNumberWithGroupSeparator(leftPartWithOutNeg, undefined, groupSeparator, decimalSeparator, '');
        left = '-' + left;
    } else {
        left = formatNumberWithGroupSeparator(split[0], undefined, groupSeparator, decimalSeparator, '');
    }


    // zero pad if defined scale is longer.  if defined scale is short, no truncate
    if (scale > 0) {
        right = right.length < scale ? zeroPad(right, scale) : right;
    }

    return right ? left + decimalSeparator + right : left;
}

function zeroPad(str, count, left) {
    var l;
    for (l = str.length; l < count; l += 1) {
        str = (left ? ('0' + str) : (str + '0'));
    }
    return str;
}

function getDecimalSeparator() {
    var data = {};
    data.group = getGroupSeparatorFunc(getlocale());
    data.decimal = getDecimalSeparatorFunc(getlocale());
    return data;
}

function getGroupSeparatorFunc(locale) {
    if (l_globalize === undefined) {
        l_globalize = getGlobalizeObject();
    }
    return l_globalize.formatNumber(Number(10000.10), {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 0
    }).substring(2, 3);
}

function getDecimalSeparatorFunc(locale) {
    if (l_globalize === undefined) {
        l_globalize = getGlobalizeObject();
    }
    return l_globalize.formatNumber(Number(10000.10), {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 1,
        minimumFractionDigits: 1
    }).substring(6, 7);
}

function formatNumberWithGroupSeparator(val, groupFormat, grpSym, decimalSym, fraction) {
    if (groupFormat == '' || groupFormat == undefined) {
        groupFormat = '3';
    }
    var groupSizes = groupFormat.replace(/,/, '').split('');
    var stringIndex = val.length - 1;
    grpSym = grpSym ? grpSym : ',';
    decimalSym = decimalSym ? decimalSym : '.';
    var curSize = +groupSizes[0];
    var curGroupIndex = 1;
    var ret = '';
    if (fraction !== undefined && fraction === '') {
        decimalSym = '';
    }
    while (stringIndex >= 0) {
        if (curSize === 0 || curSize > stringIndex) {
            ret = val.slice(0, stringIndex + 1) + (ret.length ? (grpSym + ret + decimalSym) : decimalSym);
            break;
        }
        ret = val.slice(stringIndex - curSize + 1, stringIndex + 1) + (ret.length ? (grpSym + ret) : '');

        stringIndex -= curSize;

        if (curGroupIndex < groupSizes.length) {
            curSize = +groupSizes[curGroupIndex];
            curGroupIndex++;
        }
    }
    return `${ret}${fraction}`;
}