package com.opentext.apps.gc.custom;

import java.io.UnsupportedEncodingException;

import com.cordys.cpc.bsf.busobject.BSF;
import com.cordys.cpc.bsf.busobject.BusObject;
import com.eibus.xml.nom.Node;
import com.eibus.xml.nom.XMLException;
import com.eibus.xml.xpath.XPath;

public class ContentLibraryUtils {

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
		return XPath.getMatchingNodes(expression, null, node);
	}

	public static int getNode(final String expression, final int node) {
		return XPath.getFirstMatch(expression, null, node);
	}

	public static String getData(final int node) {
		if (BusObject._isNull(node)) {
			return null;
		}
		return Node.getData(node);
	}

	public static int parseXML(final String xml) {
		int node = 0;
		try {
			node = BSF.getXMLDocument().load(xml.getBytes("UTF-8"));
		} catch (XMLException | UnsupportedEncodingException e) {

			throw new RuntimeException();
		}

		return node;
	}
}
