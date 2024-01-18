package com.opentext.apps.salesforceintegrator.exceptions;

import com.eibus.localization.message.Message;
import com.eibus.localization.message.MessageSet;

public class SalesforceAlertMessages {
	public static final MessageSet SALES_FORCE_MESSAGE_SET = MessageSet.getMessageSet("com.opentext.apps.accountmanagement.salesforce.Messages");

	public static final Message ERROR_PROCESSING_RESPONSE_FOR_ACCESS_TOKEN = SALES_FORCE_MESSAGE_SET
			.getMessage("processingResponseForAccessToken");
	public static final Message ERROR_UNSUPPORTED_ENCODING = SALES_FORCE_MESSAGE_SET.getMessage("unsupportedEncoding");
	public static final Message ERROR_ACCESS_TOKEN_CONNECTION = SALES_FORCE_MESSAGE_SET.getMessage("accessTokenConnection");
	public static final Message ERROR_ACCESS_TOKEN_PROTOCOL = SALES_FORCE_MESSAGE_SET.getMessage("accessTokenProtocolError");
	public static final Message ERROR_OUTPUT_STREAM = SALES_FORCE_MESSAGE_SET.getMessage("outputStreamError");
	public static final Message ERROR_RELEASING_RESOURCES = SALES_FORCE_MESSAGE_SET.getMessage("releasingResources");
	public static final Message ERROR_LOGIN_INFO_CONNECTION = SALES_FORCE_MESSAGE_SET.getMessage("loginInfoConnection");
	public static final Message ERROR_LOGIN_INFO_PROTOCOL = SALES_FORCE_MESSAGE_SET.getMessage("loginInfoProtocolError");
	public static final Message ERROR_HTTP_RESPONSE_NOT_OK = SALES_FORCE_MESSAGE_SET.getMessage("httpResponseError");
	public static final Message ERROR_WHILE_TRIGGERING_BPM = SALES_FORCE_MESSAGE_SET.getMessage("errorWhileTriggeringBPM");

}
