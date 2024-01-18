package com.opentext.apps.gc.contentlibrary.exceptions;

import javax.xml.namespace.QName;

import com.cordys.cpc.bsf.busobject.exception.WSAppServerRunTimeException;
import com.eibus.localization.IStringResource;

public class ContentLibraryException extends WSAppServerRunTimeException{
	
	private static final QName qName = new QName("ContentLibJavaException");	

	/**
	 * Creates an instance of the BsfRuntimeException
	 */
	public ContentLibraryException(String message)
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
	public ContentLibraryException(String message, Throwable nestedException)
	{
		super(message, nestedException);
		setFaultCode(qName);
	}

	public ContentLibraryException(IStringResource localizableString, Object... insertions)
	{
		super(localizableString, insertions);
		setFaultCode(qName);
	}

	public ContentLibraryException(IStringResource localizableString, Throwable cause, Object... insertions)
	{
		super(cause, localizableString, insertions);
		setFaultCode(qName);
	}

}