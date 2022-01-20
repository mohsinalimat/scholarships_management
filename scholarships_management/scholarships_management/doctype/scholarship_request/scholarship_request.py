# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ScholarshipRequest(Document):
    def on_submit(self):
        # sender = 'muhammadnassef34@gmail.com'
        #frappe.throw(f'doc name {self.name}, {self.full_name_en}')
        frappe.sendmail(recipients=[self.email], subject='Security Scanner Forum',
                        template='Security Scanner Forum', 
                        args=dict(full_name_en = self.full_name_en, request_ID = self.name))

    def on_trash(self):
        name = frappe.db.get_value('Security Scanner Forum', {
                                   'email': f'{self.email}'}, 'name')
        if not name == None:
            frappe.db.set_value('Security Scanner Forum', name, 'docstatus', 2)
            frappe.delete_doc('Security Scanner Forum', name)
