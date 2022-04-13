// Copyright (c) 2022, repoteq and contributors
// For license information, please see license.txt

frappe.ui.form.on('Non_accredited Schools', {
	refresh: function (frm) {
	},
	school_data(frm) {
		window.open(frm.doc.school_data_url);
	},
	approve__registration(frm) {
		frappe.confirm('Confirm School Registration?',
			() => {
				frappe.call({
					method: "scholarships_management.scholarships_management.doctype.non_accredited_schools.non_accredited_schools.confirm_school_registration",
					args: {
						pschool_name: frm.doc.school_name,
						pschool_email: frm.doc.school_email,
						pschool_country: frm.doc.school_country,
						pschool_city: frm.doc.school_city,
						current_signed_user: frappe.session.user_fullname,
						pschool_data_url: frm.doc.school_data_url,
						pschool_manager_email: frm.doc.school_manager_email,
						pvice_manager_email: frm.doc.vice_manager_email
					},
					callback: function (r) {
						if (r.message) {
							frappe.msgprint(`${frm.doc.school_name}, Accredited by ${frappe.session.user_fullname}!!`);
							setTimeout(() => {
								frappe.set_route('Form', 'Accredited Schools');
							}, 5000);
						} else {
							frappe.throw(`Something went wrong!!`);
						}
					}
				});
			}, () => {
				frappe.msgprint(`${frm.doc.school_name}, still Non Accredited!!`);
			})
	},
});
