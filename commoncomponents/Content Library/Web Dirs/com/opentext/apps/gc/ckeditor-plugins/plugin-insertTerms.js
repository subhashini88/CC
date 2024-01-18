CKEDITOR.plugins.add( 'insertterms', {
	init: function( editor ) {

		// Define the editor command that inserts a timestamp.
		editor.addCommand( 'insertTermsCommand', {

			// Define the function that will be fired when the command is executed.
			exec: function( editor ) {
				callOpenTermsList(editor.name);
			},
			allowedContent: 'span[contenteditable](fullselect)'
		});

		// Create the toolbar button that executes the above command.
		editor.ui.addButton( 'insertTerms', {
			label: getTranslationMessage('Insert Terms'),
			command: 'insertTermsCommand',
			toolbar: 'about',
			icon : this.path.substring(0,this.path.indexOf("ckeditor-plugins/"))+'img/insert_terms.svg'
		});
	}
});