"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD;

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

let findAccount = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, BillingStreet, BillingCity, BillingState, Picture_URL__c, Phone FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let accounts = resp.records;
                resolve(accounts);
            }
        });
    });

};

let findAccountById = accountId => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name FROM Account WHERE Id = '" + accountId + "' LIMIT 1";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let accounts = resp.records;
                resolve(accounts);
            }
        });
    });
};

let findContact = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title, Account.Name, Phone, MobilePhone, Email, Picture_URL__c FROM Contact WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
                resolve(contacts);
            }
        });
    });

};

let findContactsByAccount = accountId => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title, Account.Name, Phone, MobilePhone, Email, Picture_URL__c FROM Contact WHERE Account.Id = '" + accountId + "' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
                resolve(contacts);
            }
        });
    });

};

let findOpportunitiesByAccount = accountId => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate, Account.Name, Picture_URL__c FROM Opportunity WHERE isClosed=false AND Account.Id = '" + accountId + "' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let opportunities = resp.records;
                resolve(opportunities);
            }
        });
    });

};


let closeWonOpportunityById = opptyId => {
    
    console.log('closeWonOpportunityById');

    let q = "SELECT Id, StageName FROM Opportunity WHERE Id = '" + opptyId + "' LIMIT 1";
    org.query({query: q}, (err, resp) => {
        if (err) {
            console.error(err);
        } else if (resp.records && resp.records.length>0) { 
            console.log('record found');

            var oppty = resp.records[0];

            console.log(oppty);

            oppty.set('StageName', 'Closed Won');
            org.update({ sobject: oppty }, function(err, resp){
              if(!err){
                    console.log('It worked!');
                }else{
                    console.error(err);
                }
            });
        }
    });
};


let getTopOpportunities = count => {

    count = count || 5;

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate, Account.Name, Account.Picture_URL__c FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

login();

exports.org = org;
exports.findAccount = findAccount;
exports.findAccountById = findAccountById;
exports.findContact = findContact;
exports.findContactsByAccount = findContactsByAccount;
exports.getTopOpportunities = getTopOpportunities;
exports.findOpportunitiesByAccount = findOpportunitiesByAccount;
exports.closeWonOpportunityById = closeWonOpportunityById;