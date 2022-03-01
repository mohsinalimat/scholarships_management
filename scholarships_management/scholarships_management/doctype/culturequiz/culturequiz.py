# Copyright (c) 2022, repoteq and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.website.website_generator import WebsiteGenerator
from frappe.model.mapper import get_mapped_doc


class Culturequiz(WebsiteGenerator):
    pass

@frappe.whitelist(allow_guest=True)
def make_new_candidate(source_name, target_doc=None,ignore_permissions=False):
    #doc = frappe.get_doc({"doctype":"Candidates"})
    #row = doc.append('candidates_item', {})
    #row.competitor = {new_culturequiz.full_name}
    #row.national_id = new_culturequiz.national_id
    #row.nationality = new_culturequiz.nationality
    #row.quiz_score = new_culturequiz.quiz_score
    #frappe.msgprint(
    #    _(f" len: {len(new_culturequiz)}, {new_culturequiz.full_name} : {new_culturequiz.national_id} : {new_culturequiz.nationality} : {new_culturequiz.quiz_score}"))
    doclist = get_mapped_doc("Culturequiz", source_name, {
		"Culturequiz": {
			"doctype": "Candidates",
			"field_map": {
				"competition": "competition"
			}
		},
		"Culturequiz": {
			"doctype": "Candidates Item",
			"field_map": {
				"full_name": "competitor",
				"national_id": "national_id",
				"nationality": "nationality",
				"quiz_score": "quiz_score"
			}
		}
	}, target_doc, ignore_permissions=ignore_permissions)
    return doclist
"""
def get_new_culturequiz(source_name):
    return frappe.db.get_value("Culturequiz", source_name, ["full_name", "national_id", "nationality", "quiz_score"], as_dict=1)


@frappe.whitelist(allow_guest=True)
def make_new_candidate(source_name, target_doc=None):
    global new_culturequiz
    new_culturequiz = get_new_culturequiz(source_name)

    # insert values into newCandidate
    frappe.db.sql
    #INSERT INTO newCandidates(fullName, nationalId, nationality, quizScore)
    #VALUES (%(fullname)s, %(nationalid)s, %(nationality)s, %(quizscore)s);
    
    values={'fullname':new_culturequiz['full_name'],
    'nationalid': new_culturequiz['national_id'],
    'nationality': new_culturequiz['nationality'],
    'quizscore':new_culturequiz['quiz_score']},
    as_dict=0
    )
    
    frappe.msgprint(
        _(f"{new_culturequiz['full_name']} : {new_culturequiz['national_id']} : {new_culturequiz['nationality']} : {new_culturequiz['quiz_score']}"))

    return new_culturequiz


@frappe.whitelist(allow_guest=True)
def get_selected_quizsubmissions():
    return new_culturequiz
"""