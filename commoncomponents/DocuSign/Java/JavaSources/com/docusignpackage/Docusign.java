package com.docusignpackage;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.cordys.cpc.bsf.busobject.BusObjectConfig;
import com.cordys.util.NomUtil;
import com.docusignpackage.exceptions.DocuSignAlertMessages;
import com.docusignpackage.exceptions.DocuSignApplicationException;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;

public class Docusign extends DocusignBase {
	private static final CordysLogger logger = CordysLogger.getCordysLogger(DocusignBase.class);
	private static final String base_url = "https://demo.docusign.net/restapi/v2/";
	private static String callback_url = "https://www.docusign.com/devcenter";

	public Docusign() {
		this((BusObjectConfig) null);
	}

	public Docusign(BusObjectConfig config) {
		super(config);
	}

	public static int proceedToEsign(Element inputxml, String access_token, String account_id, Element recepients,
			String return_url, String item_id, String docuSignURL) {
		if (return_url != null && !(return_url.equalsIgnoreCase("")))
			callback_url = return_url;
		NodeList nodes = inputxml.getElementsByTagName("Document");
		List<DocumentDetails> docsList = new ArrayList<DocumentDetails>();
		for (int i = 0; i < nodes.getLength(); i++) {
			NodeList childNodes = nodes.item(i).getChildNodes();
			DocumentDetails documentDetails = new DocumentDetails();
			for (int j = 0; j < childNodes.getLength(); j++) {
				Node childNode = childNodes.item(j);
				if ("base64".equalsIgnoreCase(childNode.getNodeName())) {
					documentDetails.setDocumentBase64(childNode.getTextContent());
				}
				if ("documentname".equalsIgnoreCase(childNode.getNodeName())) {
					String filename = childNode.getTextContent();
					int index = filename.lastIndexOf(".");
					documentDetails.setName(filename.substring(0, index));
					documentDetails.setFileExtension(filename.substring(index + 1, filename.length()));
				}
				if ("documentid".equalsIgnoreCase(childNode.getNodeName())) {
					documentDetails.setDocumentId(childNode.getTextContent());
				}

			}
			docsList.add(documentDetails);
		}

		List<String> recipientsList = new ArrayList<String>();
		nodes = recepients.getElementsByTagName("signers");
		for (int i = 0; i < nodes.getLength(); i++) {
			recipientsList.add(nodes.item(i).getTextContent().trim());
		}
		int i = 0;
		List<Signers> signersList = new ArrayList<Signers>();
		for (String email : recipientsList) {
			Signers signer = new Signers();
			signer.setEmail(email);
			signer.setName(email);
			signer.setRecipientId(String.valueOf(++i));
			signer.setRoutingOrder(String.valueOf(i));
			signersList.add(signer);
		}
		Recipients recipients = new Recipients();
		recipients.setSigners(signersList);
		HashMap<String, String> bodyMap = new HashMap<String, String>();

		String url = null;
		if (Objects.nonNull(docuSignURL) && !docuSignURL.isBlank()) {
			url = docuSignURL.endsWith("/") ? docuSignURL + "accounts/" + account_id + "/envelopes"
					: docuSignURL + "/" + "accounts/" + account_id + "/envelopes";
		} else {
			url = base_url + "accounts/" + account_id + "/envelopes";
		}

		bodyMap.put("emailSubject", "\"Please review the documents [#" + item_id + "]\"");
		bodyMap.put("status", "\"created\"");
		bodyMap.put("documents", docsList.toString());
		bodyMap.put("recipients", recipients.toString());
		HttpURLConnection conn = sendRequest(url, "POST", "application/xml", "application/json", access_token,
				"createEnvelope", bodyMap);
		Document parser = getDomXmlfromResponse(conn);
		NodeList envelopeNodes = parser.getElementsByTagName("envelopeId");
		String envelopeId = envelopeNodes.item(0).getTextContent();
		String senderViewUrl = getSenderViewUrl(account_id, envelopeId, access_token, docuSignURL);
		// Create Dom Element
		DocumentBuilderFactory documentFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder = null;
		try {
			documentBuilder = documentFactory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
					DocuSignAlertMessages.ERROR_PROCESSING_RESPONSE_FOR_ESIGN);
			throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_PROCESSING_RESPONSE_FOR_ESIGN);
		}
		Document document = documentBuilder.newDocument();
		Element root = document.createElement("docusign");
		Element senderViewUrlElement = document.createElement("senderViewUrl");
		senderViewUrlElement.setTextContent(senderViewUrl);
		root.appendChild(senderViewUrlElement);
		Element envelopeIdElement = document.createElement("envelopeId");
		envelopeIdElement.setTextContent(envelopeId);
		root.appendChild(envelopeIdElement);
		return NomUtil.convertToNom((Node) root);

	}

	public static String getStatus(String envelopeId, String accountId, String accessToken, String docuSignURL) {
		String url = null;
		if (Objects.nonNull(docuSignURL) && !docuSignURL.isBlank()) {
			url = docuSignURL.endsWith("/") ? docuSignURL + "accounts/" + accountId + "/envelopes/" + envelopeId
					: docuSignURL + "/" + "accounts/" + accountId + "/envelopes/" + envelopeId;
		} else {
			url = base_url + "accounts/" + accountId + "/envelopes/" + envelopeId;
		}

		HttpURLConnection conn = sendRequest(url, "GET", "application/xml", "application/json", accessToken,
				"getStatus", null);
		Document parser = getDomXmlfromResponse(conn);
		if (parser != null) {
			NodeList nodes = parser.getElementsByTagName("status");
			return nodes.item(0).getTextContent();
		}
		return null;
	}

	public static String getSenderViewUrl(String accountId, String envelopeId, String accessToken, String docuSignURL) {
		String url = null;
		if (Objects.nonNull(docuSignURL) && !docuSignURL.isBlank()) {
			url = docuSignURL.endsWith("/")
					? docuSignURL + "accounts/" + accountId + "/envelopes/" + envelopeId + "/views/sender"
					: docuSignURL + "/" + "accounts/" + accountId + "/envelopes/" + envelopeId + "/views/sender";
		} else {
			url = base_url + "accounts/" + accountId + "/envelopes/" + envelopeId + "/views/sender";
		}
		HashMap<String, String> bodyMap = new HashMap<String, String>();
		bodyMap.put("returnUrl", "\"" + callback_url + "\"");
		HttpURLConnection conn = sendRequest(url, "POST", "application/xml", "application/json", accessToken,
				"senderView", bodyMap);
		Document parser = getDomXmlfromResponse(conn);
		NodeList nodes = parser.getElementsByTagName("url");
		return nodes.item(0).getTextContent();
	}

	private static HttpURLConnection sendRequest(String url, String method, String acceptType, String contentType,
			String accessToken, String operation_type, HashMap<String, String> bodyMap) {
		HttpURLConnection conn = null;
		try {
			conn = (HttpURLConnection) new URL(url).openConnection();
		} catch (IOException e) {
			logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
					DocuSignAlertMessages.ERROR_ACCESS_TOKEN_CONNECTION);
			throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_ACCESS_TOKEN_CONNECTION);
		}
		try {
			conn.setRequestMethod(method);
		} catch (ProtocolException e) {
			logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
					DocuSignAlertMessages.ERROR_ACCESS_TOKEN_PROTOCOL);
			throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_ACCESS_TOKEN_PROTOCOL);
		}
		conn.setRequestProperty("Content-Type", contentType);
		conn.setRequestProperty("Accept", acceptType);
		if (!("".equalsIgnoreCase(accessToken))) {
			String bearer = "Bearer " + accessToken;
			conn.setRequestProperty("Authorization", bearer);
		}
		if ("createEnvelope".equalsIgnoreCase(operation_type) || "senderView".equalsIgnoreCase(operation_type)) {
			conn.setDoInput(true);
			conn.setDoOutput(true);
			OutputStream os = null;
			BufferedWriter writer = null;
			try {
				os = conn.getOutputStream();
				writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
				writer.write(getPostDataString(bodyMap, "json"));
				writer.flush();
			} catch (UnsupportedEncodingException e) {
				logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
						DocuSignAlertMessages.ERROR_UNSUPPORTED_ENCODING);
				throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_UNSUPPORTED_ENCODING);
			} catch (IOException e) {
				logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
						DocuSignAlertMessages.ERROR_OUTPUT_STREAM);
				throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_OUTPUT_STREAM);
			} finally {
				try {
					if(null!=writer){
						writer.close();
					}
					if(null!=os){
						os.close();
					}
				
				} catch (IOException e) {
					logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
							DocuSignAlertMessages.ERROR_RELEASING_RESOURCES);
					throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_RELEASING_RESOURCES);
				}
			}

		}
		return conn;
	}

	private static Document getDomXmlfromResponse(HttpURLConnection conn) {
		DocumentBuilderFactory newInstance = DocumentBuilderFactory.newInstance();
		newInstance.setNamespaceAware(true);
		InputStream is = null;
		InputStream er = null;
		try {
			newInstance.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
			is = conn.getInputStream();
			return newInstance.newDocumentBuilder().parse(is);
		} catch (SAXException | IOException | ParserConfigurationException e) {
			try {
				er = conn.getErrorStream();
				Document parser = newInstance.newDocumentBuilder().parse(er);
				NodeList nodes = parser.getElementsByTagName("errorCode");
				if (nodes.getLength() > 0) {
					if (nodes.item(0).getTextContent().equalsIgnoreCase("USER_LACKS_PERMISSIONS")) {
						logger._log("com.opentext.apps.docusignintegrator", Severity.WARN, e,
								DocuSignAlertMessages.ERROR_PROCESSING_RESPONSE_FOR_ACCESS_TOKEN);
						return null;
					}
				}
			} catch (SAXException | IOException | ParserConfigurationException e1) {
				logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
						DocuSignAlertMessages.ERROR_OUTPUT_STREAM);
				throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_OUTPUT_STREAM);
			}
			logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
					DocuSignAlertMessages.ERROR_PROCESSING_RESPONSE_FOR_ACCESS_TOKEN);
			throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_PROCESSING_RESPONSE_FOR_ACCESS_TOKEN);
		} finally {
			try {
				if (is != null)
					is.close();
				if (er != null)
					er.close();
			} catch (IOException e) {
				logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
						DocuSignAlertMessages.ERROR_RELEASING_RESOURCES);
				throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_RELEASING_RESOURCES);
			}

		}
	}

	private static String getPostDataString(HashMap<String, String> params, String type) {
		StringBuilder result = new StringBuilder();
		boolean first = true;
		if ("json".equalsIgnoreCase(type))
			result.append("{");
		for (Map.Entry<String, String> entry : params.entrySet()) {
			if ("json".equalsIgnoreCase(type)) {
				if (first) {
					first = false;
				} else
					result.append(",");
				result.append("\"" + entry.getKey() + "\"");
				result.append(":");
				result.append(entry.getValue());
			} else if ("auth".equalsIgnoreCase(type)) {
				if (first)
					first = false;
				else
					result.append("&");
				try {
					result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
					result.append("=");
					result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
				} catch (UnsupportedEncodingException e) {
					logger._log("com.opentext.apps.docusignintegrator", Severity.ERROR, e,
							DocuSignAlertMessages.ERROR_UNSUPPORTED_ENCODING);
					throw new DocuSignApplicationException(DocuSignAlertMessages.ERROR_UNSUPPORTED_ENCODING);
				}

			}
		}
		if ("json".equalsIgnoreCase(type))
			result.append("}");
		return result.toString();
	}

	public void onInsert() {
	}

	public void onUpdate() {
	}

	public void onDelete() {
	}
}

class DocumentDetails {

	private String name;
	private String fileExtension;
	private String documentId;
	private String documentBase64;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFileExtension() {
		return fileExtension;
	}

	public void setFileExtension(String fileExtension) {
		this.fileExtension = fileExtension;
	}

	public String getDocumentId() {
		return documentId;
	}

	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}

	public String getDocumentBase64() {
		return documentBase64;
	}

	public void setDocumentBase64(String documentBase64) {
		this.documentBase64 = documentBase64;
	}

	@Override
	public String toString() {
		return "{\"name\": \"" + this.getName() + "\", \"fileExtension\":\"" + this.getFileExtension() + "\", "
				+ "\"documentId\":\"" + this.getDocumentId() + "\", \"documentBase64\":\"" + this.getDocumentBase64()
				+ "\"}";
	}
}

class Signers {

	private String email;
	private String name;
	private String recipientId;
	private String routingOrder;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRecipientId() {
		return recipientId;
	}

	public void setRecipientId(String recipientId) {
		this.recipientId = recipientId;
	}

	public String getRoutingOrder() {
		return routingOrder;
	}

	public void setRoutingOrder(String routingOrder) {
		this.routingOrder = routingOrder;
	}

	@Override
	public String toString() {
		return "{\"email\": \"" + this.getEmail() + "\", \"name\":\"" + this.getName() + "\", " + "\"recipientId\":\""
				+ this.getRecipientId() + "\", \"routingOrder\":\"" + this.getRoutingOrder() + "\"}";
	}
}

class Recipients {

	private List<Signers> signers;

	public List<Signers> getSigners() {
		return signers;
	}

	public void setSigners(List<Signers> signers) {
		this.signers = signers;
	}

	@Override
	public String toString() {
		return "{\"signers\":" + this.getSigners() + "}";
	}
}