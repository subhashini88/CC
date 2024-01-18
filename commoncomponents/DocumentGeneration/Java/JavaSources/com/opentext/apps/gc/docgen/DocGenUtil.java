package com.opentext.apps.gc.docgen;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.*;

import com.cordys.cpc.bsf.busobject.BSF;
import com.eibus.xml.nom.Node;
import com.eibus.xml.nom.XMLException;

public class DocGenUtil {

	public static void cleanAll(final int... nodes) {
		for (final int node : nodes) {
			if (node != 0) {
				if (Node.getParent(node) > 0)
					Node.unlink(node);
				Node.delete(node);
			}
		}
	}

	public static int[] getNodeList(final String expression, final int node) {
		return com.eibus.xml.xpath.XPath.getMatchingNodes(expression, null, node);
	}

	public static int getNode(final String expression, final int node) {
		return com.eibus.xml.xpath.XPath.getFirstMatch(expression, null, node);
	}

	public static String writeToString(final int node) {
		return Node.writeToString(node, true);
	}
	
	public static Map<String, String> convertJsonToMap(String storageTicket,String seperator) {
		Map<String, String> map = new HashMap<String, String>();
		if (storageTicket != null && storageTicket.length() > 0) {
			String tokens[] = storageTicket.replace("\"", "").replace("{", "").replace("}", "").split(seperator);
			for (int i = 0; i < tokens.length; i++) {
				String[] fieldTokens = tokens[i].split(":");
				map.put(fieldTokens[0], fieldTokens[1]);
			}
		}
		return map;
	}
	
	public static Map<String, String> convertJsonToHashMap(String storageTicket) throws JsonParseException, IOException {
		Map<String,String> resultMap = new HashMap<String,String>();
		InputStream inputSource = new ByteArrayInputStream(storageTicket.getBytes(StandardCharsets.UTF_8));
		JsonParser jsonParser = new JsonFactory().createParser(inputSource);
		while(!(jsonParser.isClosed())){
			String key = jsonParser.getCurrentName();
			String value = jsonParser.getValueAsString();
			resultMap.put(key, value);
			jsonParser.nextToken();
		}
		while (resultMap.values().remove(null));
		return resultMap;
	}
	
	public static int parseXML(final String xml) {
		  int node = 0;
		  try {
			  node = BSF.getXMLDocument().load(xml.getBytes("UTF-8"));
		  } 
		  catch (XMLException | UnsupportedEncodingException e) {		  			    
		    throw new RuntimeException();
		  }		  
		  return node;
	  }
}
