package com.opentext.apps.ccworkflow.rule.enums;

public enum CCValueTypeEnum {

	PROPERTY(1, "PROPERTY"), VALUE(2, "VALUE"), EXPRESSION(3, "EXPRESSION");

	private int id;
	private String value;

	private CCValueTypeEnum(int id, String value) {
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
