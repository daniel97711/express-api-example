const validator = require('validator');
const isEmail = validator.isEmail;
const {getData, updateData} = require('./data.js');
const { format, compareDesc } = require('date-fns');


const HTTPError = require('http-errors');


function sendRecord(userId, recipient, emailContent) {
    if (!isEmail(recipient)) {
        throw new HTTPError(400, 'Invalid recipient');
    } 
    let data = getData();

    let user = data.users.find(user => user.userId === userId);
    if (user === undefined) {
        throw new HTTPError(400, 'Invalid sender');
    }

    const timeStamp = new Date();
    const date = format(timeStamp, "HH:mm  yyyy/MM/dd");

    let newEmail = {
        from: user.email,
        recipient: recipient,
        sendTime: date,
        timeStamp: timeStamp,
        emailContent: emailContent
    }

    data.emails.push(newEmail);
    updateData(data);
    return;
}

function receiveList(userId) {
    let data = getData();
    let user = data.users.find(a => a.userId === userId);
    if (user === undefined) {
        throw new HTTPError(400, 'Invalid user');
    }
    let receives = data.emails.filter(email => email.recipient === user.email);
    receives.sort((a, b) => compareDesc(a.timeStamp, b.timeStamp));
    return receives;
}

function sendList(userId) {
    let data = getData();
    let user = data.users.find(a => a.userId === userId);
    if (user === undefined) {
        throw new HTTPError(400, 'Invalid user');
    }
    let sends = data.emails.filter(email => email.from === user.email);
    sends.sort((a, b) => compareDesc(a.timeStamp, b.timeStamp));
    return sends;
}

module.exports = {sendRecord, sendList, receiveList};
