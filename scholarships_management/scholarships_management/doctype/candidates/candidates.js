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
			},
			{
				label: "Rnadom Selection",
				fieldname: "random_select",
				fieldtype: "Int"
				//options: "\nMale\nFemale"
			}
		]
	});
}

function map_current_doc(opts) {
//debugger;
	function _map() {

			opts.source_name.forEach(function(src) {
            debugger;
          frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Culturequiz",
                    name: src,
                },
                callback(r) {
                    if(r.message) {
                        var task = r.message;
                        var childTable = cur_frm.add_child("items");
                        childTable.competitor=task.full_name;
                        childTable.national_id= task.national_id;
                        childTable.nationality= task.nationality;
                        childTable.quiz_score= task.quiz_score;
              
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
			get_query() {
				return {
					filters: { gender: ['=', 'Male'] }
				}},
			action: function(selections, args) {
				let values = selections;
				if (values.length === 0) {
          //debugger;
					frappe.msgprint(__("Please select {0}", [opts.source_doctype]))
					return;
				}
        //debugger;
				opts.source_name = values;
				if (opts.allow_child_item_selection) {
					// args contains filtered child docnames
					opts.args = args;
				}
				d.dialog.hide();
				_map();
			},
		});

		return d;
	}

	if (opts.source_name) {
		opts.source_name = [opts.source_name];
		_map();
	}
}