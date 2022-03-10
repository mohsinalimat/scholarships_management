// get data from url..
var urlParams = new URLSearchParams(window.location.search);
var competitionName = urlParams.get('competition_name');
var passingScore = urlParams.get('passing_score');
// set quiz banner image..
var quizBanner = urlParams.get('quiz_banner');
document.getElementById('qz-b').src = atob(quizBanner);
// set page language..
var lang = urlParams.get('_lang');
if (lang == '' || lang == 'null') {
    lang = 'en';
}

const checkTranslation = function (langValue) {
    if (langValue === 'ar' || langValue === 'en' || langValue === 'pt' || langValue === 'ha') {
        window.location.replace('https://test.cdafricaa.com/culturequiz/Quiz?competition_name=' + competitionName + '&passing_score=' + passingScore + '&quiz_banner=' + quizBanner + '&_lang=' + langValue);
    } else {
        window.location.replace('https://test.cdafricaa.com/culturequiz/loadingTranslation?_lang=' + langValue);
    }
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
                    checkTranslation(lang);
                }
            });
        }
    }
});

// quiz description..
frappe.call({
    method: "scholarships_management.www.culturequiz.Quiz.get_quiz_description",
    args: {
        competition_name: competitionName,
        system_lang: lang
    },
    callback: function (r) {
        if (r.message) {
            document.getElementById('quizDescription').innerHTML = r.message;
        }
    }
});


var quizContent = document.getElementById('quiz-content');

function changeColor(event) {
    //debugger;
    // The event's `target` property holds the element where the event happened
    const localReferenceToTheTextArea = event.target;
    // The text of a textarea  element lives in its `value` property
    localReferenceToTheTextArea.style.backgroundColor = 'lime';
    //console.log(text);
}

function returnColor(event) {
    //debugger;
    // The event's `target` property holds the element where the event happened
    const localReferenceToTheTextArea = event.target;
    // The text of a textarea  element lives in its `value` property
    localReferenceToTheTextArea.style.backgroundColor = 'yellow';
    //console.log(text);
}


const setAnswers = function (values) {
    let crntTime = (new Date().getTime()).toString()

    for (let optn in values) {
        // create radio button..
        let radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = values[0] + crntTime; // to avoid repeated first name.. 
        radioBtn.id = values[optn] + crntTime; // to avoid multi answers with the same name..
        radioBtn.value = values[optn];
        //radioBtn.required = true;

        //radioBtn.addEventListener("click", changeColor);
        //radioBtn.addEventListener("blur", returnColor);

        // create label for radio button..
        let option = document.createElement("label");
        option.style.fontFamily = "al-mohannad";
        option.style.fontWeight = "70px";
        let optionTxt = document.createTextNode(values[optn]);
        option.appendChild(optionTxt);
        option.htmlFor = radioBtn.id;

        radioBtn.appendChild(option);
        quizContent.appendChild(radioBtn);
        quizContent.appendChild(option);

        option.addEventListener("click", changeColor);
        option.addEventListener("blur", returnColor);

        quizContent.appendChild(document.createElement("br"));//hr
    }
}

const transquets = function () {
    frappe.call({
        method: "scholarships_management.www.culturequiz.Quiz.get_questions_options",
        args: {
            competition_title: competitionName,
            system_lang: lang
        },
        callback: function (oqn) {
            Object.entries(oqn.message).forEach(function (val) {
                //console.log(val[0]); // question text

                //document.appendChild("<div>");
                let questionHeader = document.createElement("h3");
                questionHeader.innerHTML = val[0];
                questionHeader.style.fontFamily = "al-mohannad";
                questionHeader.style.fontWeight = "100px";
                quizContent.appendChild(questionHeader);
                quizContent.appendChild(document.createElement("br"));

                //console.log(val[1]); // option list
                setAnswers(val[1]);
                //document.appendChild("</div>");
                var horizontalLine = document.createElement("hr");
                horizontalLine.style.width = '100%';
                horizontalLine.style.margin = 'auto';
                horizontalLine.style.borderTop = '1px solid';
                quizContent.appendChild(document.createElement("br"));
                quizContent.appendChild(horizontalLine);
                quizContent.appendChild(document.createElement("br"));
            });
        }
    });
}
transquets();

window.onload = () => {
    // numbering of questions ..
    setTimeout(function () {
        if (lang == 'ar' || lang == 'ha') {
            document.getElementsByClassName('row')[1].style.textAlign = 'right';
            document.getElementsByClassName('row')[1].style.direction = 'rtl';

            var numOfOptionLabels = document.getElementsByTagName('label').length;
            for (let optnLabelIndx = 0; optnLabelIndx < numOfOptionLabels; optnLabelIndx++) {
                document.getElementsByTagName('label')[optnLabelIndx].style.margin = '5px';
            }

            var numOfQuestions = document.getElementsByTagName('h3').length;
            for (let qustIndx = 0; qustIndx < numOfQuestions; qustIndx++) {
                document.getElementsByTagName('h3')[qustIndx].innerHTML = `${qustIndx + 1}- ` + document.getElementsByTagName('h3')[qustIndx].innerHTML;
            }
        } else {
            var numOfQuestions = document.getElementsByTagName('h3').length;
            for (let qustIndx = 0; qustIndx < numOfQuestions; qustIndx++) {
                document.getElementsByTagName('h3')[qustIndx].innerHTML = `${qustIndx + 1}- ` + document.getElementsByTagName('h3')[qustIndx].innerHTML;
            }
        }

    }, 5000);
}

// handle submitted quiz options..
quizContent.addEventListener('submit', (event) => {
    let selectedOptions = [];
    let outstr = $('#quiz-content').serializeArray();

    outstr.forEach((value) => {
        selectedOptions.push(value['value']);
    });
    // check answer of question number 6...
    
    if (selectedOptions.length != document.getElementsByTagName('h3').length) {
        console.log(selectedOptions);
        frappe.msgprint(__('Please Check Your Selectd Answers!!'));
    } else {
        frappe.call({
            method: "scholarships_management.www.culturequiz.Quiz.get_quiz_score",
            args: {
                selected_options: selectedOptions,
                competition_title: competitionName,
                passing_score: passingScore
            },
            callback: function (r) {
                if (r.message) {
                    var quizScore = r.message[0];
                    var quizStatus = r.message[1];
                    console.log(quizScore);
                    console.log(quizStatus);
                    window.location.replace('https://test.cdafricaa.com/culturequiz?new=1&quiz_score=' + btoa(quizScore) + '&quiz_status=' + btoa(quizStatus) + '&competition=' + competitionName + '&_lang=' + lang)
                }
            }
        });
    }
    event.preventDefault();
});


/*
const transquets = function () {
    frappe.call({
        method: "scholarships_management.www.culturequiz.Quiz.get_translated_question",
        args: {
            competition_title: competitionName,
            system_lang: lang
        },
        callback: function (oqn) {
            var horizontalLine = document.createElement("hr");
            horizontalLine.style.width = '100%';
            horizontalLine.style.margin = 'auto';
            horizontalLine.style.borderTop = '1px solid';

            Object.entries(oqn.message).forEach(function (val) {
                //console.log(val[1]);
                let questionHeader = document.createElement("h3");
                questionHeader.innerHTML = val[1];
                questionHeader.style.fontFamily = "al-mohannad";
                questionHeader.style.fontWeight = "100px";

                quizContent.appendChild(questionHeader);
                quizContent.appendChild(document.createElement("br"));
                quizContent.appendChild(horizontalLine);//br
                quizContent.appendChild(document.createElement("br"));
            });
        }
    });
}
transquets();
*/

/*
const translateQuestion = function (qst) {
    let translatedQuestion;

    frappe.call({
        method: "scholarships_management.www.culturequiz.Quiz.get_translated_question",
        args: {
            system_lang: 'pt', //lang
            question_text: qst
        },
        callback: function (trqst) {
            if (trqst.message) {
                //console.log(trqst.message);
                translatedQuestion = trqst.message;
            } else {
                //console.log(qst);
                translatedQuestion = qst;
            }
        }
    });

    return translatedQuestion;
}*/

const testquest = function () {
    let qlst = [];
    let olst = [];

    frappe.call({
        method: "scholarships_management.www.culturequiz.Quiz.get_question_option",
        args: {
            competition_title: competitionName
        },
        callback: function (oqn) {
            Object.entries(oqn.message).forEach(function (val) {
                // remove 'ql editior mode..' from question tag..
                let el = document.createElement('div');
                el.innerHTML = val[0];
                let questionText = el.getElementsByTagName('span')[0].innerHTML;

                qlst.push(questionText); // push question text

                olst.push(val[1]); // push array of options
            });
        }
    });

    return {
        'quest': qlst,
        'opts': olst
    };
}
//testquest();

const getTrans = function () {
    var xlst = testquest()['quest'];
    var xlstt = testquest()['opts'];

    let tqlst = [];
    let tolst = [];

    // translated questions..
    setTimeout(function () {
        for (let idx = 0; idx < xlst.length; idx++) {
            setTimeout(function () {
                frappe.call({
                    method: "scholarships_management.www.culturequiz.Quiz.get_translated_question",
                    args: {
                        system_lang: 'pt', //lang
                        question_text: xlst[idx]
                    },
                    callback: function (trqst) {
                        if (trqst.message) {
                            //console.log("translated: " + trqst.message);
                            tqlst.push(trqst.message);
                        } else {
                            //console.log("not translated: " + xlst[idx]);
                            tqlst.push(xlst[idx]);
                        }
                    }
                });
            }, 2000);
        }
    }, 5000);

    // translated options..
    /*
    setTimeout(function () {
        for (let oidx = 0; oidx < xlstt.length; oidx++) {
            console.log(xlstt[oidx]);
        }
    }, 5000);*/

    setTimeout(function () {
        console.log(tqlst);
    }, 5000);
    return tqlst;
    /*return new Promise(resolve => {
        resolve(tqlst);
    });*/
}
//getTrans();

//const gtrqst = async function () {
const gtrqst = function () {
    var ttqst = getTrans();

    setTimeout(function () {
        console.log('after await..');
        console.log(ttqst[0]);
        console.log(ttqst.length);
    }, 5000);
}
//gtrqst();

const qst = function () {
    var xlst = testquest()['quest'];
    var xlstt = testquest()['opts'];

    setTimeout(function () {
        for (let idx = 0; idx < xlst.length; idx++) {
            console.log(xlst[idx]);
            console.log('------------');
            console.log(xlstt[idx]);
        }
    }, 5000);
}
//qst();


/*
const getQuest = function () {
    frappe.call({
        method: "scholarships_management.www.culturequiz.Quiz.get_question_option",
        args: {
            competition_title: competitionName
        },
        callback: function (r) {
            if (r.message) {
                Object.entries(r.message).forEach(function (value) {
                    let questionHeader = document.createElement("h3");
                    var el = document.createElement('div');
                    el.innerHTML = value[0];
                    var questionText = el.getElementsByTagName('p')[0].innerHTML;
                    frappe.call({
                        method: "scholarships_management.www.culturequiz.Quiz.get_translated_question",
                        args: {
                            system_lang: lang,
                            question_text: questionText
                        },
                        callback: function (rr) {
                            var horizontalLine = document.createElement("hr");
                            horizontalLine.style.width = '100%';
                            horizontalLine.style.margin = 'auto';
                            horizontalLine.style.borderTop = '1px solid';

                            if (rr.message) {
                                questionHeader.innerHTML = rr.message;
                                questionHeader.style.fontFamily = "al-mohannad";
                                questionHeader.style.fontWeight = "100px";
                                //pquestion_lst.push([questionHeader, value[1]]);
                                quizContent.appendChild(questionHeader);
                                setAnswers(value[1]);
                                quizContent.appendChild(document.createElement("br"));
                                quizContent.appendChild(horizontalLine);//br
                                quizContent.appendChild(document.createElement("br"));
                            } else {
                                questionHeader.innerHTML = value[0];
                                questionHeader.style.fontFamily = "al-mohannad";
                                questionHeader.style.fontWeight = "100px";
                                //pquestion_lst.push([questionHeader, value[1]]);
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
        }
    });
}

//getQuest()


function changeColor(event) {
    //debugger;
    // The event's `target` property holds the element where the event happened
    const localReferenceToTheTextArea = event.target;
    // The text of a textarea  element lives in its `value` property
    localReferenceToTheTextArea.style.backgroundColor = 'red';
    //console.log(text);
}

function returnColor(event) {
    //debugger;
    // The event's `target` property holds the element where the event happened
    const localReferenceToTheTextArea = event.target;
    // The text of a textarea  element lives in its `value` property
    localReferenceToTheTextArea.style.backgroundColor = 'yellow';
    //console.log(text);
}


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
        //radioBtn.setAttribute('oninvalid','this.setCustomValidity(`${alert("please select an answer first")}`);');
        //radioBtn.setCustomValidity(`${alert("please select an answer first")}`);
        //radioBtn.oninvalid("alert('You must fill out the form!');");
        //radioBtn.setAttribute('oninput','this.setCustomValidity("");');
        quizContent.appendChild(radioBtn);
        radioBtn.addEventListener("click", changeColor);
        radioBtn.addEventListener("blur", returnColor);
        // create label for radio button..
        let option = document.createElement("label");
        option.style.fontFamily = "al-mohannad";
        option.style.fontWeight = "100px";

        frappe.call({
            method: "scholarships_management.www.culturequiz.Quiz.get_translated_option",
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
        method: "scholarships_management.www.culturequiz.Quiz.get_quiz_score",
        args: {
            selected_options: selectedOptions,
            competition_title: competitionName,
            passing_score: passingScore
        },
        callback: function (r) {
            if (r.message) {
                var quizScore = r.message[0];
                var quizStatus = r.message[1];
                console.log(quizScore);
                console.log(quizStatus);
                //window.location.replace('https://test.cdafricaa.com/culturequiz?new=1&quiz_score=' + btoa(quizScore) + '&quiz_status=' + btoa(quizStatus) + '&competition=' + competitionName + '&_lang=' + lang)
            }
        }
    });
    event.preventDefault();
});


if (lang == 'ar') {
    var qlEditorLength = document.getElementsByClassName('ql-editor read-mode').length;
    for (let qindx = 0; qindx < qlEditorLength; qindx++) {
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.textAlign = 'right';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.direction = 'rtl';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.margin = '10px';
        document.getElementsByClassName('ql-editor read-mode')[qindx].style.padding = '10px';
    }

    for (let spanIndx = 0; spanIndx < document.getElementsByTagName('span').length; spanIndx++) {
        document.getElementsByTagName('span')[spanIndx].setAttribute('style', 'font-family:"al-mohannad", sans;');
        //document.getElementsByTagName('span')[spanIndx].style.fontFamily="al-mohannad";
        document.getElementsByTagName('span')[spanIndx].style.fontWeight = "100px";
    }

    document.getElementsByClassName('row')[1].style.textAlign = 'right';
    document.getElementsByClassName('row')[1].style.direction = 'rtl';

    for (let inptIndx = 0; inptIndx < document.getElementsByTagName('input').length; inptIndx) {
        document.getElementsByTagName('input')[inptIndx].style.marginLeft = '5px';
    }

    document.getElementsByClassName('ql-editor read-mode')[qlEditorLength - 1].style.margin = '1px';
    document.getElementsByClassName('ql-editor read-mode')[qlEditorLength - 1].style.padding = '1px';

}
$(document).ready(function () {
    $('input[type="radio"]').bind('deselect', function () {
        debugger;
        console.log($(this));
    });
})

window.onload = () => {
    // run in onload
    setTimeout(() => {
        if (lang == 'ar') {
            for (let spanIndx = 0; spanIndx < document.getElementsByTagName('span').length; spanIndx++) {
                // spanIndx != 0 &&
                if (spanIndx != document.getElementsByTagName('span').length - 1) {
                    document.getElementsByClassName('ql-editor read-mode')[spanIndx].innerHTML = '<div style="float:right">' + (spanIndx + 1).toString() + ' - </div>' + document.getElementsByClassName('ql-editor read-mode')[spanIndx].innerHTML;
                }
                document.getElementsByClassName('ql-editor read-mode')[spanIndx].setAttribute('style', 'font-family:"al-mohannad" !important;font-weight: 100');
            }

            for (let spanIndx = 0; spanIndx < document.getElementsByTagName('input').length; spanIndx++) {
                document.getElementsByTagName('input')[spanIndx].setAttribute('style', 'position: relative;left: 5px;');
            }
            document.getElementsByClassName('ql-editor read-mode')[0].getElementsByTagName('p')[0].style.textAlign = 'right';
        }
        else { // any language other than arabic..
            for (let spanIndx = 0; spanIndx < document.getElementsByTagName('span').length; spanIndx++) {
                // spanIndx != 0 && spanIndx != document.getElementsByTagName('span').length-1
                document.getElementsByClassName('ql-editor read-mode')[spanIndx].innerHTML = '<div style="float:left">' + (spanIndx + 1).toString() + ' - </div>' + document.getElementsByClassName('ql-editor read-mode')[spanIndx].innerHTML;
                document.getElementsByClassName('ql-editor read-mode')[spanIndx].setAttribute('style', 'font-family:"al-mohannad" !important;font-weight: 100');
            }
        }
    }, 3000)
}
*/
// quiz description..
/*
frappe.call({
    method: "scholarships_management.www.culturequiz.culturequiz.get_quiz_description",
    args: {
        competition_name: competitionName
    },
    callback: function (r) {
        if (r.message) {
            var el = document.createElement('div');
            el.innerHTML = r.message;
            var quizDescription = el.getElementsByClassName('ql-editor read-mode')[0].innerHTML;
            console.log(__(quizDescription));
            document.getElementById('quizDescription').innerHTML = __(quizDescription);
        }
    }
});
*/
