package com.opentext.apps.gc.contentlibrary.exceptions;

import com.eibus.localization.message.Message;
import com.eibus.localization.message.MessageSet;

public class ContentLibAlertMessages {
	public static final MessageSet CONTENT_LIB_MESSAGE_SET = MessageSet.getMessageSet("com.opentext.apps.commoncomponents.contentLibrary.Messages");
	
	public static final Message WEBSERVICE_FAILURE_READ_TEMPLATE = CONTENT_LIB_MESSAGE_SET.getMessage("webserviceFailureReadTemplate");
	public static final Message MISSING_DOC_LAYOUT= CONTENT_LIB_MESSAGE_SET.getMessage("MissingDocLayoutForTemplate");
	public static final Message WEBSERVICE_FAILURE_GET_TEMPLATE_DETAILS = CONTENT_LIB_MESSAGE_SET.getMessage("webserviceFailureGetTemplateDetails");
	public static final Message ERROR_WHILE_GENERATING_INPUT_REQUEST = CONTENT_LIB_MESSAGE_SET.getMessage("errorWhileGeneratingInputRequest");
	public static final Message ERROR_WHILE_GETTING_LATEST_CLAUSE_VERSIONS = CONTENT_LIB_MESSAGE_SET.getMessage("errorWhileGettingLatestClauseVersions");
	
}
