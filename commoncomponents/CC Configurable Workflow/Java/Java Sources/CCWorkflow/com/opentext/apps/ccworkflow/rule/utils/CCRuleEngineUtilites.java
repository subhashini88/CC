package com.opentext.apps.ccworkflow.rule.utils;

import java.util.Date;
import java.util.List;
import java.util.Objects;

public class CCRuleEngineUtilites {

	/** String or Text Operations. */

	public static boolean equals(final String str1, final String str2) {
		if (Objects.nonNull(str1)) {
			return str1.equalsIgnoreCase(str2);
		}
		if (Objects.nonNull(str2)) {
			return str2.equalsIgnoreCase(str1);
		}
		return false;
	}

	public static boolean equals(final List<String> strList, final String str2) {
		if (Objects.nonNull(str2) && !strList.isEmpty()) {
			return strList.contains(str2);
		}
		return false;
	}

	public static boolean empty(final String str) {
		return (Objects.isNull(str) || str.isEmpty()) ? true : false;
	}

	public static boolean empty(List<String> multiPropValues) {
		if (null != multiPropValues && !multiPropValues.isEmpty()) {
			return true;
		}
		return false;
	}

	public static boolean contains(final String str, final String subString) {
		return (Objects.nonNull(str) && Objects.nonNull(subString)
				&& str.toLowerCase().contains(subString.toLowerCase())) ? true : false;
	}

	public static boolean inList(final String string, final List<String> list) {
		if (Objects.nonNull(list) && !list.isEmpty() && Objects.nonNull(string)) {
			for (String str : list)
				if (str.toLowerCase().contains(string.toLowerCase()))
					return true;
		}
		return false;
	}

	/** ------------------------------------------------------ */

	/** Integer Operations. */

	public static boolean equals(final Integer int1, final Integer int2) {
		if (Objects.nonNull(int1)) {
			return int1.equals(int2);
		}
		if (Objects.nonNull(int2)) {
			return int2.equals(int1);
		}
		return false;
	}

	public static boolean empty(final Integer integer) {
		return (Objects.isNull(integer)) ? true : false;
	}

	public static boolean greaterThan(Integer integer1, Integer integer2) {
		if (Objects.isNull(integer1))
			return false;
		if (Objects.isNull(integer2))
			return false;
		return integer1.intValue() > integer2.intValue();
	}

	public static boolean greaterThanOrEqual(Integer integer1, Integer integer2) {
		if (Objects.isNull(integer1))
			return false;
		if (Objects.isNull(integer2))
			return false;
		return integer1.intValue() >= integer2.intValue();
	}

	public static boolean lessThan(Integer integer1, Integer integer2) {
		if (Objects.isNull(integer1))
			return false;
		if (Objects.isNull(integer2))
			return false;
		return integer1.intValue() < integer2.intValue();
	}

	public static boolean lessThanOrEqual(Integer integer1, Integer integer2) {
		if (Objects.isNull(integer1))
			return false;
		if (Objects.isNull(integer2))
			return false;
		return integer1.intValue() <= integer2.intValue();
	}

	/** ------------------------------------------------------ */

	/** Decimal or Long Operations. */

	public static boolean equals(final Long long1, final Long long2) {
		if (Objects.nonNull(long1)) {
			return long1.equals(long2);
		}
		if (Objects.nonNull(long2)) {
			return long2.equals(long1);
		}
		return false;
	}

	public static boolean empty(final Long longValue) {
		return (Objects.isNull(longValue)) ? true : false;
	}

	public static boolean greaterThan(Long long1, Long long2) {
		if (Objects.isNull(long1))
			return false;
		if (Objects.isNull(long2))
			return false;
		return long1.longValue() > long2.longValue();
	}

	public static boolean greaterThanOrEqual(Long long1, Long long2) {
		if (Objects.isNull(long1))
			return false;
		if (Objects.isNull(long2))
			return false;
		return long1.longValue() >= long2.longValue();
	}

	public static boolean lessThan(Long long1, Long long2) {
		if (Objects.isNull(long1))
			return false;
		if (Objects.isNull(long2))
			return false;
		return long1.longValue() < long2.longValue();
	}

	public static boolean lessThanOrEqual(Long long1, Long long2) {
		if (Objects.isNull(long1))
			return false;
		if (Objects.isNull(long2))
			return false;
		return long1.longValue() <= long2.longValue();
	}

	/** ------------------------------------------------------ */

	/** Decimal Operations. */

	public static boolean equals(final Double double1, final Double double2) {
		if (Objects.nonNull(double1)) {
			return double1.equals(double2);
		}
		if (Objects.nonNull(double2)) {
			return double2.equals(double1);
		}
		return false;
	}

	public static boolean empty(final Double floatObj) {
		return (Objects.isNull(floatObj)) ? true : false;
	}

	public static boolean greaterThan(Double double1, Double double2) {
		if (Objects.isNull(double1))
			return false;
		if (Objects.isNull(double2))
			return false;
		return double1.doubleValue() > double2.doubleValue();
	}

	public static boolean greaterThanOrEqual(Double double1, Double double2) {
		if (Objects.isNull(double1))
			return false;
		if (Objects.isNull(double2))
			return false;
		return double1.doubleValue() >= double2.doubleValue();
	}

	public static boolean lessThan(Double double1, Double double2) {
		if (Objects.isNull(double1))
			return false;
		if (Objects.isNull(double2))
			return false;
		return double1.doubleValue() < double2.doubleValue();
	}

	public static boolean lessThanOrEqual(Double double1, Double double2) {
		if (Objects.isNull(double1))
			return false;
		if (Objects.isNull(double2))
			return false;
		return double1.doubleValue() <= double2.doubleValue();
	}

	/** ------------------------------------------------------ */

	public static boolean equals(final Date date1, final Date date2) {

		if (Objects.nonNull(date1)) {
			return date1.equals(date2);
		}
		if (Objects.nonNull(date2)) {
			return date2.equals(date1);
		}
		return false;
	}

	public static boolean empty(final Date date) {
		return (Objects.isNull(date)) ? true : false;
	}

	public static boolean greaterThan(Date date1, Date date2) {
		if (Objects.isNull(date2))
			return false;
		if (Objects.nonNull(date1)) {
			return date1.after(date2);
		}
		return false;
	}

	public static boolean greaterThanOrEqual(Date date1, Date date2) {
		if (Objects.isNull(date2))
			return false;
		if (Objects.nonNull(date1)) {
			return date1.after(date2) || date1.equals(date2);
		}
		return false;
	}

	public static boolean lessThan(Date date1, Date date2) {
		if (Objects.isNull(date2))
			return false;
		if (Objects.nonNull(date1)) {
			return date1.before(date2);
		}
		return false;
	}

	public static boolean lessThanOrEqual(Date date1, Date date2) {
		if (Objects.isNull(date2))
			return false;
		if (Objects.nonNull(date1)) {
			return date1.before(date2) || date1.equals(date2);
		}
		return false;
	}

	public static boolean equals(final Boolean b1, final Boolean b2) {
		if (Objects.nonNull(b1)) {
			return b1.equals(b2);
		}
		if (Objects.nonNull(b2)) {
			return b2.equals(b1);
		}
		return false;
	}

}
