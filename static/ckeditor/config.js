/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
        { name: 'print' },
        { name: 'stuff', groups:['print','preview','find' ]},
        '/',
        { name: 'document' },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
        { name: 'links' },
        { name: 'insert' },
        '/',
        { name: 'styles' },
        { name: 'colors' },
        { name: 'tools' },
        { name: 'others' },
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	// config.removeButtons = 'Underline,Subscript,Superscript';
	
	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';
	config.extraPlugins = 'floatpanel';
	config.extraPlugins = 'panel';
	config.extraPlugins = 'font';
	config.extraPlugins = 'richcombo';
	config.extraPlugins = 'listblock';
	config.extraPlugins = 'panelbutton';
	config.extraPlugins = 'colorbutton';
	config.extraPlugins = 'html5video';
	config.extraPlugins = 'colordialog';
	config.extraPlugins = 'dialog';
	config.extraPlugins = 'emoji';
	config.extraPlugins = 'autocomplete';
	config.extraPlugins = 'textwatcher';
	config.colorButton_colors = 'CF5D4E,454545,FFF,DDD,CCEAEE,66AB16';
	config.extraPlugins = 'filetools';
	config.extraPlugins = 'popup';


	// Simplify the dialog windows.
	// config.removeDialogTabs = 'image:advanced;link:advanced';
	// config.clipboard_handleImages = false;
};



