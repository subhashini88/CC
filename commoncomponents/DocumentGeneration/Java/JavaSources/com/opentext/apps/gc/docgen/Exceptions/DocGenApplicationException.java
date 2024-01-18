package com.opentext.apps.gc.docgen.Exceptions;

import javax.xml.namespace.QName;

import com.cordys.cpc.bsf.busobject.exception.WSAppServerRunTimeException;
import com.eibus.localization.IStringResource;

public class DocGenApplicationException extends WSAppServerRunTimeException{
	private static final long serialVersionUID = 2210360011725760032L;
	private static final QName qName = new QName("DocGenJavaException");	

	/**
	 * Creates an instance of the BsfRuntimeException
	 */
	public DocGenApplicationException(String message)
	{
		super(message, null);
		setFaultCode(qName);
	}

	/**
	 * Creates an instance of AssureException with the nested exception and the
	 * message.
	 * 
	 * @param message
	 *            The message string of the exception.
	 * @param nestedException
	 *            The nested Throwable object.
	 */
	public DocGenApplicationException(String message, Throwable nestedException)
	{
		super(message, nestedException);
		setFaultCode(qName);
	}

	public DocGenApplicationException(IStringResource localizableString, Object... insertions)
	{
		super(localizableString, insertions);
		setFaultCode(qName);
	}

	public DocGenApplicationException(IStringResource localizableString, Throwable cause, Object... insertions)
	{
		super(cause, localizableString, insertions);
		setFaultCode(qName);
	}

}