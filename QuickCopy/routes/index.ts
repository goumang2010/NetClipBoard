/*
 * GET home page.
 */
import express = require('express');
import mongoose = require('mongoose');
import noteraw = require('../Models/noteModel');
import method = require('./sharedmethod');
var Note = <mongoose.Model<mongoose.Document>>noteraw;
//import noteschema = require('../Schemas/note');
//var NoteSchema = <mongoose.Schema> noteschema 
import _ = require('underscore');
export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'NetClipBoard', year: new Date().getFullYear() });

};

export function about(req: express.Request, res: express.Response) {
        res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
       
};


    


export function contact(req: express.Request, res: express.Response) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};


export function ajaxfetch(req: express.Request, res: express.Response) {
    //console.log("start");
    var key = req.query.key;
    var keystr: string = key;
    if (keystr.length == 6) {
        // var array = [keystr.substr(0, 2), keystr.substr(2, 2), keystr.substr(4, 2)];
        //var re = new RegExp(".{6}" + array[0] + ".{4}" + array[1] + ".{8}" + array[2]);
        // res.write("test");
        Note.findOne({ "fetchKey": keystr }, function (err, bsonres) {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                var text = bsonres.get("noteText");
                res.write(text);               
             res.end();
            }

        });
    }
    else {
        res.end();
    }
};

export function fetch(req: express.Request, res: express.Response) {

    var key = req.query.key;
    var keystr: string = key;
    if (keystr.length == 6) {
        Note.findOne({ "fetchKey": keystr }, function (err, bsonres) {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                var text = bsonres.get("noteText");
                res.render('index', { title: 'NetClipBoard', year: new Date().getFullYear(), noteText: text });
            }

        });
    }
    else {
        res.end();
    }
};
export function addnote(req: express.Request, res: express.Response) {
    var note = req.body.noteText;
    if (note !== '') {
       // console.log(_dict);
        var newtext = new Note({ noteText: note, userIP: method.getClientIp(req)});
        var keyraw = newtext.get("_id");
        var key: string = String(keyraw);
        var trimkey = key.substr(6, 2) + key.substr(12, 2) + key.substr(22, 2);
        newtext.set("fetchKey", trimkey)
        newtext.save(function (err, note) {
            if (err) {
                console.log(err);
                console.log(note);
            }
        });
        res.write(trimkey);
        res.end();   
    }
    else {
       
        res.end();
        console.log("undefined is true");
       // res.send("<Script>Alert('请输入内容')</Script>");
    }
    
};

