// Copyright (c) 2022, repoteq and contributors
// For license information, please see license.txt

frappe.ui.form.on('School Teacher Registration', {
	refresh: function (frm) {
	},
	send_message(frm) {
		let mailDialog = new frappe.ui.Dialog({
			title: `Send Mail to: ${frm.doc.teacher_name}`,
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
					values['message_content'] += "\n\r\nhttps://cdafricaa.com" + values['attachments_content'].trim().replaceAll(' ', '%20');
				}*/

				frappe.call({
					method: "scholarships_management.scholarships_management.doctype.school_teacher_registration.school_teacher_registration.mail_to_school_teacher",
					args: {
						pmessage_content: values['message_content'],
						pteacher_mail: frm.doc.email_address,
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
	/*send_whatsapp_message(frm) {
		let whatsDialog = new frappe.ui.Dialog({
			title: `Send WhatsApp Message to: ${frm.doc.teacher_name}`,
			fields: [
				{
					label: 'Message Content',
					fieldname: 'message_content',
					fieldtype: 'Text Editor',
					reqd: '1'
				}
			],
			primary_action_label: 'Send Message',
			primary_action(values) {
				frappe.call({
					method: "scholarships_management.scholarships_management.doctype.school_teacher_registration.school_teacher_registration.send_whatsapp_message",
					args: {
						pmessage_content: values['message_content'],
						pteacher_phone_number: frm.doc.phone_number
					},
					callback: function (r) {
						if (r.message) {
							frappe.msgprint(`Message Sent Successfully!!`);
							whatsDialog.hide();
						} else {
							frappe.throw(`Can't send an Empty Message!!`);
						}
					}
				});
			},
			secondary_action_label: 'Cancel',
			secondary_action() {
				whatsDialog.hide();
			}
		});
		whatsDialog.show();
	}*/
});
