/* MIT License

Copyright (c) 2017  M.Delory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.  */

var util = require('util');
var youtube_node = require('youtube-node');
var AuthDetails = require("./auth.json");


function YoutubePlugin () {

    this.RickrollUrl = 'http://www.youtube.com/watch?v=oHg5SJYRHA0';
    this.youtube = new youtube_node();
    this.youtube.setKey(AuthDetails.youtube_api_key);
    this.youtube.addParam('type', 'video');

};


YoutubePlugin.prototype.respond = function (query, channel, client) {
    this.youtube.search(query, 1, function(error, result) {
            if (error) {
                channel.sendMessage("¯\\_(ツ)_/¯");
            }
            else {
                if (!result || !result.items || result.items.length < 1) {
                    channel.sendMessage("¯\\_(ツ)_/¯");
                } else {
                    channel.sendMessage("http://www.youtube.com/watch?v=" + result.items[0].id.videoId );
                }
            }
        });
};

module.exports = YoutubePlugin;
