/*
 * GET home page.
 */
import express = require('express');
import mongoose = require('mongoose');
import noteraw= require('../Models/noteModel');
var Note = <mongoose.Model<mongoose.Document>>noteraw
//import noteschema = require('../Schemas/note');
//var NoteSchema = <mongoose.Schema> noteschema 
import _ = require('underscore');
export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

export function about(req: express.Request, res: express.Response) {
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
export function addnote(req: express.Request, res: express.Response) {
    var note = req.body.noteText;
    if (note !== 'undefined') {
       // console.log(_dict);
        var newtext = new Note({ noteText: note.noteText, userIP: getClientIp(req)});
        newtext.save(function (err, note) {
            if (err) {
                console.log(err);
            }
         //Generate QR code and display in the page.
       


        });
       
        console.log(newtext.get("_id"));
        console.log("undefined is true");

      
    }
    else {
       
        
        console.log("undefined is false");
       // res.send("<Script>Alert('请输入内容')</Script>");
    }
};

