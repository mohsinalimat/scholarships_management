var urlParams = new URLSearchParams(window.location.search);

var guestName = atob(urlParams.get('gst_name'));
var guestEmail = atob(urlParams.get('gst_mail'));
var guestMessageSubject = atob(urlParams.get('gst_msg_subjt'));
var guestMessageBody = atob(urlParams.get('gst_msg_body'));

const decodeText = function (codedText) {
    const myArray = codedText.split(" ");
    let decodedText = '';
    for (let idx = 0; idx < myArray.length; idx++) {
        decodedText = decodedText + String.fromCharCode(Number(myArray[idx])).toString();;
    }
    return decodedText;
}

/*console.log(decodeText(guestName));
console.log(decodeText(guestEmail));
console.log(decodeText(guestMessageSubject));
console.log(decodeText(guestMessageBody));*/


frappe.call({
    method: "scholarships_management.www.home.messagesent.set_guest_message",
    args: {
        guest_name: decodeText(guestName),
        guest_email: decodeText(guestEmail),
        guest_message_subject: decodeText(guestMessageSubject),
        guest_message_body: decodeText(guestMessageBody)
    },
    callback: function (r) {
        if (r.message) {
            document.getElementById('welcome-guest').innerHTML = `Hello, ${decodeText(guestName)}`;
        } else {
            frappe.msgprint('Check your inputs');
        }
    }
});

