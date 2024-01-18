package com.opentext.apps.salesforceintegrator.exceptions;

import javax.xml.namespace.QName;

import com.cordys.cpc.bsf.busobject.exception.WSAppServerRunTimeException;
import com.eibus.localization.IStringResource;

public class SalesforceApplicationException extends WSAppServerRunTimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2140981876420550206L;
	private static final QName qName = new QName("SalesforceJavaException");

	/**
	 * Creates an instance of the BsfRuntimeException
	 */
	public SalesforceApplicationException(String message) {
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
	public SalesforceApplicationException(String message, Throwable nestedException) {
		super(message, nestedException);
		setFaultCode(qName);
	}

	public SalesforceApplicationException(IStringResource localizableString, Object... insertions) {
		super(localizableString, insertions);
		setFaultCode(qName);
	}

	public SalesforceApplicationException(IStringResource localizableString, Throwable cause, Object... insertions) {
		super(cause, localizableString, insertions);
		setFaultCode(qName);
	}
}
