import frappe


@frappe.whitelist(allow_guest=True)
def set_guest_message(guest_name, guest_email, guest_message_subject, guest_message_body):
    doc = frappe.get_doc({
        'doctype': 'Guest Messages',
        'guest_name': guest_name,
        'guest_email': guest_email,
        'message_subject': guest_message_subject,
        'message_content': guest_message_body})
    doc.insert(ignore_permissions=True)

    if doc:
        return True
    else:
        return False
