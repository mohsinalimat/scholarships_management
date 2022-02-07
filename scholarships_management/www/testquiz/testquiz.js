// Personal Information Section..

function StartQuiz() {
    let form = document.querySelector('#user-data-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    let userdata = get_form_data();
    frappe.msgprint(`user name: ${userdata['first_name']} ${userdata['last_name']}`);
}

function get_form_data() {
    userData = {};
    let inputs = ['first_name', 'last_name', 'phone_number', 'email_address'];
    inputs.forEach((id) => userData[id] = document.getElementById(`${id}`).value);
    return userData
}

// Quiz Section..

frappe.call({
    method: "scholarships_management.www.testquiz.testquiz.get_question_option",
    callback: function (r) {
        if (r.message) {
            Object.entries(r.message).forEach(function (value) {
                let quizContent = document.getElementById('quiz-content');

                let questionHeader = document.createElement("h1");
                questionHeader.innerHTML = value[0];
                quizContent.append(questionHeader);

                let questionOptions = document.createElement("ul");

                for (let optn in value[1]) {
                    let option = document.createElement("li");
                    option.innerHTML = value[1][optn]
                    questionOptions.appendChild(option)
                }
                quizContent.appendChild(questionOptions)
            });
        }
    }
})
