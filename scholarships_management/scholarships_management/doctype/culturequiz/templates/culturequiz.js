// language picker..
frappe.call({
    method: "scholarships_management.www.culturequiz.lang_picker.get_enabled_languages",
    callback: function (r) {
        if (r.message) {
            var docHeader = document.getElementsByClassName("container")[0];

            var langSwitcher = document.createElement('select');
            langSwitcher.id = "langSwitcherID";
            langSwitcher.style.padding = '5px';
            docHeader.appendChild(langSwitcher);

            var defaultopt = document.createElement('option');
            defaultopt.id = 'defaultoptt'; 
            defaultopt.value = '';
            // make default selected option hidden..
            defaultopt.selected = true;
            defaultopt.disabled = true;
            defaultopt.style.display = 'none';
            defaultopt.text = ''; 
            langSwitcher.appendChild(defaultopt);
            // change default selected option text based on current used language..
            frappe.call({
                method: "scholarships_management.www.culturequiz.lang_picker.get_current_selected_language",
                args: {
                    lang_code: lang
                },
                callback: function (r) {
                    if (r.message){
                        document.getElementById('defaultoptt').innerHTML = r.message;
                    } else {
                        document.getElementById('defaultoptt').innerHTML = 'Select Language';
                    }
                }
            });
            // list of options based on enabled languages..
            Object.entries(r.message).forEach((value) => {
                var opt = document.createElement('option');
                opt.value = value[1][0];
                opt.text = value[1][1];
                langSwitcher.appendChild(opt);
            });

            langSwitcher.addEventListener('change', function () {
                if (this.value !== '') {
                    lang = this.value;
                    window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz-data/' + document.getElementById('fullName').innerHTML.trim().replaceAll(' ', '-') + '?_lang=en' + lang);
                }
            });
        }
    }
});