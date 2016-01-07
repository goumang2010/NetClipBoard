/*
 * GET home page.
 */
import express = require('express');
import mongoose = require('mongoose');
import noteraw = require('../Models/noteModel');
var Note = <mongoose.Model<mongoose.Document>>noteraw;
//import noteschema = require('../Schemas/note');
//var NoteSchema = <mongoose.Schema> noteschema 
import _ = require('underscore');
export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

export function about(req: express.Request, res: express.Response) {

       //  console.log(req.headers);
        res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
       
};


    


export function contact(req: express.Request, res: express.Response) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
     
};
export function fetch(req: express.Request, res: express.Response) {
    res.write("mock");
    res.end();
};
export function addnote(req: express.Request, res: express.Response) {
    var note = req.body.noteText;
    if (note !== '') {
       // console.log(_dict);
        var newtext = new Note({ noteText: note, userIP: getClientIp(req)});
        newtext.save(function (err, note) {
            if (err) {
                console.log(err);
                console.log(note);
            }
        });
        //Return the url to generate QR
        var keyraw = newtext.get("_id");
        var key: string = String(keyraw);
        var trimkey = key.substr(6, 2) + key.substr(12, 2) + key.substr(22, 2);
        res.write(trimkey);
        res.end();
        console.log(newtext.errors);
        console.log("undefined is false");
        
      
    }
    else {
       
        res.end();
        console.log("undefined is true");
       // res.send("<Script>Alert('请输入内容')</Script>");
    }
    
};

