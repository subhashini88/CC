package com.opentext.apps.ccworkflow.rule.enums;

public enum CCPropertyDataTypeEnum {

	TEXT(1, "TEXT"), INTEGER(2, "INTEGER"), BOOLEAN(3, "BOOLEAN"), FLOAT(4, "FLOAT"), DATE(5, "DATE"),
	DECIMAL(6, "DECIMAL"), DURATION(7, "DURATION"), ENUMERATEDTEXT(8, "ENUMERATEDTEXT"), LONGTEXT(9, "LONGTEXT");

	private int id;
	private String value;

	private CCPropertyDataTypeEnum(int id, String value) {
		this.id = id;
		this.value = value;
	}

	public int getId() {
		return id;
	}

	public String getValue() {
		return value;
	}
}
