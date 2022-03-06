// Copyright (c) 2022, repoteq and contributors
// For license information, please see license.txt

frappe.ui.form.on('Candidates', {
	refresh: function (frm) {
		frm.add_custom_button(__('Quiz Submissions'), function () {

			openCulturequizFilter(frm);
			//debugger;
		}, __("Get Candidates From"));
	}
});
/*
frappe.ui.form.on('Candidates Item', { // The child table is defined in a DoctType called "Dynamic Link"
	competitor_add(frm, cdt, cdn) { // "links" is the name of the table field in ToDo, "_add" is the event
		// frm: current ToDo form
		// cdt: child DocType 'Dynamic Link'
		// cdn: child docname (something like 'a6dfk76')
		// cdt and cdn are useful for identifying which row triggered this event
		var CompetitorName  = frappe.get_doc(cdt, cdn, 'competitor');
		frappe.msgprint(`${CompetitorName}A row has been added to the links table 🎉`);
	}
});
*/

function openCulturequizFilter(frm) {
	map_current_doc({
		method: "scholarships_management.scholarships_management.doctype.culturequiz.culturequiz.make_new_candidate",
		source_doctype: "Culturequiz",
		target: frm,
		setters: [
			{
				label: "Country",
				fieldname: "countryname",
				fieldtype: "Link",
				options: "Country"
			},
			{
				label: "Score",
				fieldname: "quiz_score",
				fieldtype: "Float"
				//options: "Culturequiz.quiz_score"
			},
			{
				label: "Gender",
				fieldname: "gender",
				fieldtype: "Select",
				options: "\nMale\nFemale"
			}
		]
	});
}
const _randomslice = (ar, size) => {
	let new_ar = [...ar];
	new_ar.splice(Math.floor(Math.random() * ar.length), 1);
	return ar.length <= (size + 1) ? new_ar : _randomslice(new_ar, size);
}

function map_current_doc(opts) {
	//debugger;
	function _map(random_no) {
		//debugger;
		var arr;
		if (typeof (random_no) != 'undefined')
			arr = _randomslice(opts.source_name, random_no);
		else
			arr = opts.source_name;
		arr.forEach(function (src) {
			//debugger;
			frappe.call({
				method: "frappe.client.get",
				args: {
					doctype: "Culturequiz",
					name: src,
				},
				callback(r) {
					if (r.message) {
						var task = r.message;
						var childTable = cur_frm.add_child("items");
						childTable.competitor = task.full_name;
						childTable.national_id = task.national_id;
						childTable.nationality = task.nationality;
						childTable.quiz_score = task.quiz_score;

						cur_frm.refresh_fields("items");
					}
				}
			});

		});


	}

	let query_args = {};
	if (opts.get_query_filters) {
		query_args.filters = opts.get_query_filters;
	}

	if (opts.get_query_method) {
		query_args.query = opts.get_query_method;
	}

	if (query_args.filters || query_args.query) {
		opts.get_query = () => query_args;
	}

	if (opts.source_doctype) {
		const d = new frappe.ui.form.MultiSelectDialog({
			doctype: opts.source_doctype,
			target: opts.target,
			date_field: opts.date_field || undefined,
			setters: opts.setters,
			//get_query: opts.get_query,
			add_filters_group: 1,
			allow_child_item_selection: opts.allow_child_item_selection,
			child_fieldname: opts.child_fielname,
			child_columns: opts.child_columns,
			size: opts.size,
			add_filters_group: 1,
			action: function (selections, args) {
				let values = selections;
				if (values.length === 0) {
					//debugger;
					//frappe.msgprint(__("Please select {0}", [opts.source_doctype]))
					frappe.msgprint(__("Please select at least one Quiz Submission"))
					return;
				}
				//debugger;
				opts.source_name = values;
				if (opts.allow_child_item_selection) {
					// args contains filtered child docnames
					opts.args = args;
				}
				d.dialog.hide();
				frappe.prompt({
					label: 'Enter random number to choose!',
					fieldname: 'random_no',
					fieldtype: 'Int'
				}, (values) => {
					//debugger;
					//console.log(values.random_no);
					//console.log(_randomslice(opts.source_name, values.random_no));
					_map(values.random_no);
				})

			},
		});

		return d;
	}

	if (opts.source_name) {
		opts.source_name = [opts.source_name];
		_map();
	}
}