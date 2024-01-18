CKEDITOR.plugins.add( 'insertcontractmetadata', {
	init: function( editor ) {

		// Define the editor command that inserts a timestamp.
		editor.addCommand( 'insertContractMetadataCommand', {

			// Define the function that will be fired when the command is executed.
			exec: function( editor ) {
				callOpenContractMetadataList(editor.name);
			},
			allowedContent: 'span[contenteditable](fullselect)'
		});

		// Create the toolbar button that executes the above command.
		editor.ui.addButton( 'insertContractMetadata', {
			label: getTranslationMessage('Insert contract metadata'),
			command: 'insertContractMetadataCommand',
			toolbar: 'about',
			icon : this.path.substring(0,this.path.indexOf("ckeditor-plugins/"))+'img/insert_metadata.svg'
		});
	}
});