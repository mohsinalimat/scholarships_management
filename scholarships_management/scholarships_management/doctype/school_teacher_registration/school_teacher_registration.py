# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from bs4 import BeautifulSoup


class SchoolTeacherRegistration(Document):
    pass


@frappe.whitelist(allow_guest=True)
def mail_to_school_teacher(pmessage_content, pteacher_mail, pmail_subject):
    # check if message is empty or not..
    cleantext = BeautifulSoup(pmessage_content, "lxml").text
    if cleantext.strip():
        try:
            frappe.sendmail(recipients=[pteacher_mail],
                            subject=pmail_subject,
                            message=pmessage_content)
            return True
        except Exception as ex:
            return ex
    else:
        return False


"""@frappe.whitelist(allow_guest=True)
def send_whatsapp_message(pmessage_content, pteacher_phone_number):
    # check if message is empty or not..
    cleantext = BeautifulSoup(pmessage_content, "lxml").text
    if cleantext.strip():
        try:
            pywhatkit.sendwhatmsg_instantly(
                pteacher_phone_number, pmessage_content, 10)
            return True
        except Exception as ex:
            return ex
    else:
        return False"""
