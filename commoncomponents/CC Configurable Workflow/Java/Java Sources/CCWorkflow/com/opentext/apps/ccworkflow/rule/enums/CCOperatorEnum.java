package com.opentext.apps.ccworkflow.rule.enums;

public enum CCOperatorEnum {

	EQUALTO(1, "EQUALTO"), NOTEQUALTO(2, "NOTEQUALTO"), CONTAINS(3, "CONTAINS"), DOESNOTCONTAIN(4, "DOESNOTCONTAIN"),
	IN_LIST(5, "IN_LIST"), NOT_IN_LIST(6, "NOT_IN_LIST"), EMPTY(7, "EMPTY"), NOTEMPTY(8, "NOTEMPTY"),
	GREATERTHAN(9, "GREATERTHAN"), GREATERTHANOREQUALTO(10, "GREATERTHANOREQUALTO"), LESSTHAN(11, "LESSTHAN"),
	LESSTHANOREQUALTO(12, "LESSTHANOREQUALTO");

	private int id;
	private String value;

	private CCOperatorEnum(int id, String value) {
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
