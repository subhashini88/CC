package com.opentext.apps.gc.docgen.Exceptions;

import com.eibus.localization.message.Message;
import com.eibus.localization.message.MessageSet;

public class DocGenAlertMessages {
	public static final MessageSet DOC_GEN_MESSAGE_SET = MessageSet.getMessageSet("com.opentext.apps.commoncomponents.documentgeneration.Messages");
	
	public static final Message WEBSERVICE_FAILURE_READ_VALIDATION_INPUT = DOC_GEN_MESSAGE_SET.getMessage("webserviceFailureReadValidationInput");
	public static final Message WEBSERVICE_FAILURE_READ_DOC_LAYOUT = DOC_GEN_MESSAGE_SET.getMessage("webserviceFailureReadDocLayout");
	public static final Message WEBSERVICE_FAILURE_GET_DOCUMENT = DOC_GEN_MESSAGE_SET.getMessage("webserviceFailureGetDocument");
	public static final Message EMPTY_DOCSTORAGETICKET = DOC_GEN_MESSAGE_SET.getMessage("emptyDocStorageTicket");
	public static final Message EMPTY_DOCCONTENTSTREAM = DOC_GEN_MESSAGE_SET.getMessage("emptyDocContentStream");
	public static final Message EMPTY_GENERATEDDOCLOCATION = DOC_GEN_MESSAGE_SET.getMessage("emptyGeneratedDocLocation");	
	public static final Message FORMAT_ERROR_INPUTXML = DOC_GEN_MESSAGE_SET.getMessage("formatErrorInputXML");		
	public static final Message UPDATE_ERROR_MAPPING= DOC_GEN_MESSAGE_SET.getMessage("updateErrorMapping");	
	public static final Message DOCUMENT_GENERATION_FAILURE= DOC_GEN_MESSAGE_SET.getMessage("documentGenerationFailure");	
	public static final Message PARSING_FAILURE_PARAGRAPH = DOC_GEN_MESSAGE_SET.getMessage("parsingFailureParagraph");	
	public static final Message PARSER_CONFIGURATION_ERROR = DOC_GEN_MESSAGE_SET.getMessage("parserConfigurationError");	
	public static final Message DOCUMENT_BUILDER_FAILURE = DOC_GEN_MESSAGE_SET.getMessage("documentBuilderFailure");	
	public static final Message READ_FAILURE_VALIDATION_INPUT = DOC_GEN_MESSAGE_SET.getMessage("readFailureValidationInput");
	public static final Message PATTERN_COUNTER_ERROR = DOC_GEN_MESSAGE_SET.getMessage("patternCounterError");
	public static final Message CLONE_PARAGRAPH_ERROR = DOC_GEN_MESSAGE_SET.getMessage("cloneParagraphError");
	public static final Message CLONE_RUN_ERROR = DOC_GEN_MESSAGE_SET.getMessage("cloneRunError");
	public static final Message MAPPING_BUILDER_ERROR = DOC_GEN_MESSAGE_SET.getMessage("mappingBuilderError");
	public static final Message REPLACE_MAPPING_IN_CLONED_RUN_FOR_PARAGRAPH = DOC_GEN_MESSAGE_SET.getMessage("replaceMappingClonedRunForParapraphError");
	public static final Message REPLACE_MAPPING_IN_CLONED_RUN_FOR_PARAGRAPH_XML_ERROR = DOC_GEN_MESSAGE_SET.getMessage("replaceMappingClonedRunForParapraphXMLError");
	public static final Message RELEASE_FILE_OUTPUT_STREAM = DOC_GEN_MESSAGE_SET.getMessage("releaseFileOutputStream");
	public static final Message RTE_PARSER_ERROR= DOC_GEN_MESSAGE_SET.getMessage("RTEParserError");	
}
