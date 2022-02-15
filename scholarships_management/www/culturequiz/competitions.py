import frappe


@frappe.whitelist(allow_guest=True)
def get_competitions_data():
    competitions_data = frappe.db.get_list(
        'Competition', fields=['competition_image', 'competition_title', 'competition_description'], order_by='creation')
    return competitions_data
