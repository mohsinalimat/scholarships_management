// language picker..
frappe.call({
    method: "scholarships_management.www.culturequiz.competitions.get_enabled_languages",
    callback: function (r) {
        if (r.message) {
            var docHeader = document.getElementsByClassName("container")[0];

            var langSwitcher = document.createElement('select');
            langSwitcher.id = "langSwitcherID";
            langSwitcher.style.padding = '5px';
            docHeader.appendChild(langSwitcher);

            var opt = document.createElement('option');
            opt.value = '';
            opt.text = 'Select Language';
            langSwitcher.appendChild(opt);

            Object.entries(r.message).forEach((value) => {
                var opt = document.createElement('option');
                opt.value = value[1][0];
                opt.text = value[1][1];
                langSwitcher.appendChild(opt);
            });

            langSwitcher.addEventListener('change', function () {
                if (this.value !== '') {
                    lang = this.value;
                    window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/competitions' + '?_lang=' + lang);
                }
            });
        }
    }
});