var urlParams = new URLSearchParams(window.location.search);

var lang = urlParams.get('_lang');
if (lang == '' || lang == 'null'){
    lang = 'en';
}

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

            langSwitcher.addEventListener('change', function() {
                if (this.value !== ''){
                    lang = this.value;
                    window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/competitions' + '?_lang=' + lang);
                }
            });
        }
    }
});

var startQuizBtn = document.getElementsByClassName('btn btn-primary');

// items to be sent
var ct = document.getElementsByClassName('c-t');
var ps = document.getElementsByClassName('p-s');
var qb = document.getElementsByClassName('q-b');
var ur = document.getElementsByClassName('u-r');
var nd_dt = document.getElementsByClassName('nd-dt');

var crnt_date = getDateOnly();

// items to be hidden based on End date
var tc = document.getElementsByClassName('all-qz-contnt');

for (let indx = 0; indx < startQuizBtn.length; indx++) {

    var parmND_DT = nd_dt[indx].innerHTML;

    if (crnt_date >= parmND_DT) {
        tc[indx].style.display = "none";
    }

    startQuizBtn[indx].addEventListener('click', (event) => {

        var parmCT = ct[indx].innerHTML;
        var parmPS = ps[indx].innerHTML;
        var parmQP = btoa(qb[indx].innerHTML);
        var parmUR = ur[indx].innerHTML;

        /*
        if (parmQP == btoa('None') || parmQP == btoa('') ) {
            parmQP = btoa("/files/dawah-33.png"); // default quiz banner image..
        }*/

        if (parmUR == 'Administrator') {
            var me = this;
            me.logged_out = true;
            return frappe.call({
                method: 'logout',
                callback: function (r) {
                    window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + parmCT + '&passing_score=' + parmPS + '&quiz_banner=' + parmQP + '&_lang=' + lang);
                }
            });
        } else { // guest case
            window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + parmCT + '&passing_score=' + parmPS + '&quiz_banner=' + parmQP + '&_lang=' + lang);
        }
    });
}

function getDateOnly() {
    var MyDate = new Date();
    var MyDateString = MyDate.getFullYear() + '-'
        + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-'
        + ('0' + MyDate.getDate()).slice(-2);
    return MyDateString;
}
