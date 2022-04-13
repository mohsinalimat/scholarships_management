# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from bs4 import BeautifulSoup


class AccreditedSchools(Document):
    def after_insert(self):
        frappe.delete_doc('Non_accredited Schools', self.school_name)


@frappe.whitelist(allow_guest=True)
def mail_to_school(pmessage_content, pschool_mail, pmail_subject):
    # check if message is empty or not..
    cleantext = BeautifulSoup(pmessage_content, "lxml").text
    if cleantext.strip():
        try:
            frappe.sendmail(recipients=[pschool_mail],
                            subject=pmail_subject,
                            message=pmessage_content)
            return True
        except Exception as ex:
            return ex
    else:
        return False
