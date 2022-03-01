// Quiz Section..
var urlParams = new URLSearchParams(window.location.search);

var competitionName = urlParams.get('competition_name');
//console.log(competitionName);

var passingScore = urlParams.get('passing_score');
//console.log(passingScore);

var quizBanner = urlParams.get('quiz_banner');
//console.log(quizBanner);
document.getElementById('qz-b').src = atob(quizBanner);

var lang = urlParams.get('_lang');

if (lang == '' || lang == 'null') {
    lang = 'en';
}

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

            langSwitcher.addEventListener('change', function() {
                if (this.value !== ''){
                    lang = this.value;
                    window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + competitionName + '&passing_score=' + passingScore + '&quiz_banner=' + quizBanner + '&_lang=' + lang);
                }
            });
        }
    }
});

var quizContent = document.getElementById('quiz-content');

frappe.call({
    method: "scholarships_management.www.culturequiz.culturequiz.get_question_option",
    args: {
        competition_title: competitionName
    },
    async: false,
    callback: function (r) {
        if (r.message) {
            Object.entries(r.message).forEach(function (value, index) {
                let questionHeader = document.createElement("h3");
                //console.log(frappe.preferred_language);
                var el = document.createElement('div');
                el.innerHTML = value[0];
                var questionText = el.getElementsByTagName('p')[0].innerHTML;
                frappe.call({
                    method: "scholarships_management.www.culturequiz.culturequiz.get_translated_question",
                    args: {
                        system_lang: lang,
                        question_text: questionText
                    },
                    callback: function (rr) {
                        var horizontalLine = document.createElement("hr");
                        horizontalLine.style.width = '100%';
                        horizontalLine.style.margin ='auto';
                        horizontalLine.style.borderTop = '1px solid';
                        
                        if (rr.message) {
                            questionHeader.innerHTML = rr.message;
                            questionHeader.style.fontFamily = "al-mohannad";
                            questionHeader.style.fontWeight = "100px";
                            quizContent.appendChild(questionHeader);
                            setAnswers(value[1]);
                            quizContent.appendChild(document.createElement("br"));
                            quizContent.appendChild(horizontalLine);//br
                            quizContent.appendChild(document.createElement("br"));
                        } else {
                            questionHeader.innerHTML = value[0];
                            questionHeader.style.fontFamily = "al-mohannad";
                            questionHeader.style.fontWeight = "100px";
                            quizContent.appendChild(questionHeader);
                            setAnswers(value[1]);
                            quizContent.appendChild(document.createElement("br"));
                            quizContent.appendChild(horizontalLine);//br
                            quizContent.appendChild(document.createElement("br"));
                        }
                    }
                });
            });

        }
        // create submit quiz button..
        /*let submitBtn = document.createElement("input");
        submitBtn.type = "submit";
        submitBtn.value = "Submit Quiz";
        submitBtn.className = "col-md-3 ml-auto btn btn-block btn-primary text-white py-3 px-5";
        quizContent.appendChild(submitBtn);*/
    }

});


function setAnswers(values) {
    for (let optn in values) {
        // create radio button..
        let radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.style.fontWeight = 'bold';
        
        radioBtn.name = values[0];
        radioBtn.id = values[optn];
        radioBtn.value = values[optn];
        radioBtn.required = true;
        quizContent.appendChild(radioBtn);
        // create label for radio button..
        let option = document.createElement("label");
        option.style.fontFamily = "al-mohannad";
        option.style.fontWeight = "100px";

        frappe.call({
            method: "scholarships_management.www.culturequiz.culturequiz.get_translated_option",
            args: {
                system_lang: lang,
                option_text: values[optn]
            },
            callback: function (rrr) {
                if (rrr.message) {
                    let optionTxt = document.createTextNode(rrr.message);
                    option.appendChild(optionTxt);
                } else {
                    let optionTxt = document.createTextNode(values[optn]);
                    option.appendChild(optionTxt);
                }
            }
        });

        option.htmlFor = radioBtn.id;
        option.appendChild(radioBtn);
        quizContent.appendChild(option);
        quizContent.appendChild(document.createElement("br"));//hr
    }
}

// handle submitted quiz options..
quizContent.addEventListener('submit', (event) => {
    let selectedOptions = [];
    let outstr = $('#quiz-content').serializeArray();
    outstr.forEach((value) => {
        selectedOptions.push(value['value']);
    });
    //console.log(selectedOptions);
    frappe.call({
        method: "scholarships_management.www.culturequiz.culturequiz.get_quiz_score",
        args: {
            selected_options: selectedOptions,
            competition_title: competitionName,
            passing_score: passingScore
        },
        callback: function (r) {
            if (r.message) {
                var quizScore = r.message[0];
                var quizStatus = r.message[1];
                window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz?new=1&quiz_score=' + btoa(quizScore) + '&quiz_status=' + btoa(quizStatus) + '&competition=' + competitionName + '&_lang=' + lang)
            }
        }
    });
    event.preventDefault();
});


if (lang == 'ar') {
    var qlEditorLength = document.getElementsByClassName('ql-editor read-mode').length ;
    for (let qindx = 0; qindx < qlEditorLength; qindx++ ){
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.textAlign='right';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.direction = 'rtl';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.margin = '10px';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.padding = '10px';
    }

    for (let spanIndx = 0; spanIndx < document.getElementsByTagName('span').length; spanIndx++  ){
        document.getElementsByTagName('span')[spanIndx].setAttribute('style', 'font-family:"al-mohannad", sans;');
        //document.getElementsByTagName('span')[spanIndx].style.fontFamily="al-mohannad";
        document.getElementsByTagName('span')[spanIndx].style.fontWeight = "100px";
    }

    document.getElementsByClassName('row')[1].style.textAlign='right';
    document.getElementsByClassName('row')[1].style.direction = 'rtl';
    
    for (let inptIndx = 0; inptIndx < document.getElementsByTagName('input').length; inptIndx){
        document.getElementsByTagName('input')[inptIndx].style.marginLeft = '5px';
    }

    document.getElementsByClassName('ql-editor read-mode')[qlEditorLength -1].style.margin = '1px';
    document.getElementsByClassName('ql-editor read-mode')[qlEditorLength -1].style.padding = '1px';

}
window.onload = () => {
    // run in onload
    setTimeout(() => {
    if(lang == 'ar') {
    for (let spanIndx = 0; spanIndx < document.getElementsByTagName('span').length; spanIndx++  ){
        if (spanIndx !=0 && spanIndx !=  document.getElementsByTagName('span').length -1 ){
            document.getElementsByClassName('ql-editor read-mode')[spanIndx].getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerHTML = (spanIndx).toString() + document.getElementsByClassName('ql-editor read-mode')[spanIndx].innerHTML;
        }
        document.getElementsByClassName('ql-editor read-mode')[spanIndx].setAttribute('style', 'font-family:"al-mohannad" !important;font-weight: 100');
        
    }
    
    for (let spanIndx = 0; spanIndx < document.getElementsByTagName('input').length; spanIndx++  ){
        document.getElementsByTagName('input')[spanIndx].setAttribute('style', 'position: relative;left: 5px;');
    }
    document.getElementsByClassName('ql-editor read-mode')[0].getElementsByTagName('p')[0].style.textAlign ='right';
    }
    //alert("done");
}, 3000)
}

    //alert("done");