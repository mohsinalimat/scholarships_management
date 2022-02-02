// Copyright (c) 2022, repoteq and contributors
// For license information, please see license.txt

frappe.ui.form.on('Non_accredited Schools', {
	refresh: function (frm) {
	},
	school_data(frm) {
		window.open(frm.doc.school_data_url);
	},
});
