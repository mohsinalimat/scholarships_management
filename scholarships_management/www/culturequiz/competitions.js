var urlParams = new URLSearchParams(window.location.search);

var lang = urlParams.get('_lang');
if (lang == '' || lang == 'null') {
    lang = 'en';
}
// to avoid "invalid request" error in case of administrator 
if (document.getElementsByClassName("u-r")[0].innerHTML !== 'Administrator') {
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
                //defaultopt.style.display = 'none';
                //defaultopt.text = ''; 
                langSwitcher.appendChild(defaultopt);
                // change default selected option text based on current used language..
                frappe.call({
                    method: "scholarships_management.www.culturequiz.lang_picker.get_current_selected_language",
                    args: {
                        lang_code: lang
                    },
                    callback: function (r) {
                        if (r.message) {
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
                        window.location.replace('https://cdafricaa.com/culturequiz/competitions' + '?_lang=' + lang);
                    }
                });
            }
        }
    });
}

var startQuizBtn = document.getElementsByClassName('btn btn-primary');

// items to be sent
var ct = document.getElementsByClassName('c-t');
var ps = document.getElementsByClassName('p-s');
var qb = document.getElementsByClassName('q-b');
var nd_dt = document.getElementsByClassName('nd-dt');
var i_a = document.getElementsByClassName('i-a');
var r_q = document.getElementsByClassName('r-q');
var ur = document.getElementsByClassName('u-r');
var crnt_date = getDateOnly();

// items to be hidden based on End date
var tc = document.getElementsByClassName('all-qz-contnt');

for (let indx = 0; indx < startQuizBtn.length; indx++) {

    var parmND_DT = nd_dt[indx].innerHTML;
    var parmI_A = i_a[indx].innerHTML;

    if (parmI_A == '0') {
        tc[indx].style.display = "none";
    }
    else {
        if (crnt_date >= parmND_DT) {
            tc[indx].style.display = "none";
        }
    }

    startQuizBtn[indx].addEventListener('click', (event) => {

        var parmCT = ct[indx].innerHTML;
        var parmPS = ps[indx].innerHTML;
        var parmQP = btoa(qb[indx].innerHTML);
        var parmRQ = r_q[indx].innerHTML;
        var parmUR = ur[indx].innerHTML;

        if (parmUR == 'Administrator') {
            var me = this;
            me.logged_out = true;
            return frappe.call({
                method: 'logout',
                callback: function (r) {
                    window.location.replace('https://cdafricaa.com/culturequiz/Quiz?competition_name=' + parmCT + '&passing_score=' + parmPS + '&quiz_banner=' + parmQP + '&rand_quest=' + parmRQ + '&_lang=' + lang);
                }
            });
        } else { // guest case
            window.location.replace('https://cdafricaa.com/culturequiz/Quiz?competition_name=' + parmCT + '&passing_score=' + parmPS + '&quiz_banner=' + parmQP + '&rand_quest=' + parmRQ + '&_lang=' + lang);
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
