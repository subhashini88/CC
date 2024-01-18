package com.opentext.apps.ccworkflow.rule;

import java.util.Objects;

import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineAlertMessages;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineException;

public class CCLogicValidator {

	private static final CordysLogger logger = CordysLogger.getCordysLogger(CCLogicValidator.class);
	private static String logger_indentifier = "com.opentext.apps.commoncomponents.ccworkflow";

	private String expression;
	private int position;
	private char l;

	// For error detection.
	private int errorPosition;
	private String originalExpression;

	public boolean validate(String expression) {
		boolean result = false;
		try {
			// Check for null, empty and ($ , &, | and Z) symbols.
			if (Objects.isNull(expression) || expression.isBlank()) {
				errorPosition = 0;
				return result;
			}
			errorPosition = expression.indexOf("$");
			if (errorPosition >= 0) {
				return false;
			}
			errorPosition = expression.indexOf("&");
			if (errorPosition >= 0) {
				return false;
			}
			errorPosition = expression.indexOf("|");
			if (errorPosition >= 0) {
				return false;
			}
			errorPosition = expression.indexOf("Z");
			if (errorPosition >= 0) {
				return false;
			}
			errorPosition = expression.indexOf("z");
			if (errorPosition >= 0) {
				return false;
			}

			// Replace all integers with D.
			String exp = expression.replaceAll("(\\d)+", "z");

			// Replace and with &, or with |.
			exp = exp.toLowerCase().replaceAll("and", "&").replaceAll("or", "|");

			// Remove all spaces.
			exp = exp.replaceAll(" ", "");

			// Initialize;
			this.expression = exp + '$'; // Append $ at the end.
			this.originalExpression = expression + '$';
			this.position = 0;
			l = this.expression.charAt(position);
			this.errorPosition = 0;

			// Start execution.
			result = E();
			if (result)
				errorPosition = -1;
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e,
					CCRuleEngineAlertMessages.ERROR_IN_RULE_LOGIC_VALIDATION);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULE_LOGIC_VALIDATION);
		}
		return result;
	}

	private boolean E() {
		if ('z' == l) {
			match();
			return E1();
		} else if ('(' == l) {
			match();
			E();
			if (')' == l) {
				match();
				return E1();
			} else {
				return false;
			}

		}
		skipSpacesInOriginalExpression();
		return false;
	}

	private boolean E1() {
		if ('&' == l || '|' == l) {
			match();
			boolean matched = E();
			return matched ? E1() : matched;
		}
		return (l == '$' && (position + 1) == expression.length());
	}

	private void match() {
		updateErrorPosition();
		if (position < expression.length() - 1) {
			l = expression.charAt(++position);
		}
	}

	private void updateErrorPosition() {
		// Skip space in original string.
		skipSpacesInOriginalExpression();
		if (position < expression.length() - 1) {
			if (l == '(' || l == ')')
				errorPosition++;
			else if (l == '&')
				errorPosition = errorPosition + 3;
			else if (l == '|')
				errorPosition = errorPosition + 2;
			else if (l == 'z') {
				// Skip continuous digits in original string.
				while (Character.isDigit(originalExpression.charAt(errorPosition))) {
					errorPosition++;
				}
			}
		}
		skipSpacesInOriginalExpression();
	}

	private void skipSpacesInOriginalExpression() {
		while (originalExpression.charAt(errorPosition) == ' ') {
			errorPosition++;
		}
	}

	public int getErrorPosition() {
		return errorPosition;
	}

}
