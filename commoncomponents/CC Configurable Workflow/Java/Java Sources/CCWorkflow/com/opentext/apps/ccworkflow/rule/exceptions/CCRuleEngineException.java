package com.opentext.apps.ccworkflow.rule.exceptions;

import javax.xml.namespace.QName;

import com.cordys.cpc.bsf.busobject.exception.WSAppServerRunTimeException;
import com.eibus.localization.IStringResource;

public class CCRuleEngineException extends WSAppServerRunTimeException {

	/*** Default serial version. */
	private static final long serialVersionUID = 1L;
	private static final QName qName = new QName("CCRulEngineJavaException");

	/**
	 * Creates an instance of the BsfRuntimeException
	 */
	public CCRuleEngineException(String message) {
		super(message, null);
		setFaultCode(qName);
	}

	/**
	 * Creates an instance of AssureException with the nested exception and the
	 * message.
	 * 
	 * @param message         The message string of the exception.
	 * @param nestedException The nested Throwable object.
	 */
	public CCRuleEngineException(String message, Throwable nestedException) {
		super(message, nestedException);
		setFaultCode(qName);
	}

	public CCRuleEngineException(IStringResource localizableString, Object... insertions) {
		super(localizableString, insertions);
		setFaultCode(qName);
	}

	public CCRuleEngineException(IStringResource localizableString, Throwable cause, Object... insertions) {
		super(cause, localizableString, insertions);
		setFaultCode(qName);
	}

}
