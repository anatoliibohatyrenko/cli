/**
 * Created by nikolai on 9/20/16.
 */
'use strict';
var debug   = require('debug')('login->index');
var Login   = require('../../login/connector');
var command = require('./../command');

exports.command = 'images <command> [options]';
exports.describe = 'images in Codefresh';

exports.builder = function (yargs) {
    return yargs.option('url', {
        alias: 'url',
        default: 'https://g.codefresh.io'
    }).option('account', {
        alias: 'a'
    }).option('imageName',{
        demand: true,
        type: 'string',
        describe: `name of the image`
    }).option('tofile',{
        type: 'string',
        describe: 'save results to file'
    }).option('table', {
        type: "boolean",
        describe: "output as table"
    })
        .help("h")
        .alias("h","help");
};

exports.handler = function (argv) {
    console.log('running');
    var info = {
        url: argv.url,
        account: argv.account,
        imageName: argv.imageName,
        tofile: argv.tofile,
        table: argv.table,
        targetUrl: `${argv.url}/api/images/${encodeURIComponent(argv.imageName)}/tags`
    };

    var login = new Login(argv.url,
        {
            access: {file: argv.tokenFile, token : argv.token},
            user: argv.user,
            password: argv.password
        });

    var images = command.getTags(info);

    login.connect().then(images.bind(login.token), (err) => {
        debug('error:' + err);
        process.exit(err);
    });
};