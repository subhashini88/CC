/*
  This class has been generated by the Code Generator
*/

package com.opentext.apps.gc.custom;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.cordys.cpc.bsf.busobject.BusObjectConfig;


public class clauseutilities extends clauseutilitiesBase
{
    public clauseutilities()
    {
        this((BusObjectConfig)null);
    }

    public clauseutilities(BusObjectConfig config)
    {
        super(config);
    }

    public static String getTermsFromContent(String content, String seperator)
 	{
 		StringBuilder tokens = new StringBuilder();
 		Pattern pattern = Pattern.compile("\\[@+[a-zA-Z0-9~!`@#^$%&()_+={},.; -]+@\\]");//Term format Search
 		Matcher matcher = pattern.matcher(content);
 			
 		if (matcher.find()) {
 			String termToken = matcher.group();
 			tokens.append(termToken.substring(2, termToken.length()-2));
 			while(matcher.find()) {
 				termToken = matcher.group();
 				tokens.append(seperator).append(termToken.substring(2, termToken.length()-2));
 			}
 		}
 		
 		return tokens.toString();
 	}
    
    public static String getPlainContent(final String htmlContent) {
    	String plainContent = "";
    	if(null != htmlContent && !htmlContent.trim().equals("")) {
    		plainContent = htmlContent.replaceAll("\\<.*?\\>", "");
    	}
 		return plainContent;
 	}
    
    public void onInsert()
    {
    }

    public void onUpdate()
    {
    }

    public void onDelete()
    {
    }

}