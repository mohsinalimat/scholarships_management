# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import getdate
from frappe import _
from frappe.model.document import Document


class Candidates(Document):
    pass
    """@frappe.whitelist(allow_guest=True)
    def get_flag(self):
        return True"""


def get_new_culturequiz(source_name):
    return frappe.db.get_value("Culturequiz", source_name, ["competition", "competition_title", "full_name", "national_id", "nationality", "quiz_score"], as_dict=1)


@frappe.whitelist(allow_guest=True)
def make_new_candidate(source_name, target_doc=None):
    new_culturequiz = get_new_culturequiz(source_name)

    new_candidate = frappe.get_doc({
        "doctype": "Candidates",
        "competition": new_culturequiz.competition,
        "competition_name": new_culturequiz.competition_title,
        "date": getdate(),
        "candidates_item": [
            {
                "competitor": new_culturequiz.full_name,
                "national_id": new_culturequiz.national_id,
                "nationality": new_culturequiz.nationality,
                "quiz_score": new_culturequiz.quiz_score
            }
        ]
    })
    new_candidate.insert(ignore_permissions=True)
    new_candidate.save(ignore_permissions=True)

    frappe.msgprint(
        _(f" len: {len(new_culturequiz)}, {new_culturequiz.full_name} : {new_culturequiz.national_id} : {new_culturequiz.nationality} : {new_culturequiz.quiz_score}"))
    return new_culturequiz
