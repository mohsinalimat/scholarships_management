// Copyright (c) 2022, repoteq and contributors
// For license information, please see license.txt

frappe.ui.form.on('Accredited Schools', {
	refresh: function (frm) {
	},
	show_school_data(frm) {
		window.open(frm.doc.school_data_url);
	},
	send_message(frm) {
		let mailDialog = new frappe.ui.Dialog({
			title: `Send Mail to: ${frm.doc.school_name}`,
			fields: [
				{
					label: 'Mail Subject',
					fieldname: 'mail_subject',
					fieldtype: 'Data',
					reqd: '1'
				},
				/*{
					label: 'Attachments',
					fieldname: 'attachments_content',
					fieldtype: 'Attach'
				},*/
				{
					label: 'Message Content',
					fieldname: 'message_content',
					fieldtype: 'Text Editor',
					reqd: '1'
				}

			],
			primary_action_label: 'Send Mail',
			primary_action(values) {
				/*
				if (values['attachments_content'] !== undefined) {
					values['message_content'] += "\n\nhttps://cdafricaa.com" + values['attachments_content'].trim().replaceAll(' ', '%20');
				}*/

				frappe.call({
					method: "scholarships_management.scholarships_management.doctype.accredited_schools.accredited_schools.mail_to_school",
					args: {
						pmessage_content: values['message_content'],
						pschool_mail: frm.doc.school_email,
						pmail_subject: values['mail_subject']
					},
					callback: function (r) {
						if (r.message) {
							frappe.msgprint(`Email Sent Successfully!!`);
							mailDialog.hide();
						} else {
							frappe.throw(`Can't send an Empty Message!!`);
						}
					}
				});
			},
			secondary_action_label: 'Cancel',
			secondary_action() {
				mailDialog.hide();
			}
		});
		mailDialog.show();
	},
});
