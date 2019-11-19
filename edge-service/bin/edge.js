/*
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
*/

var http = require('http');

var count = 10;
var state = []

for (i = 0; i < count; i++)
    state.push('FREE');

function get(items, response) {
    if (items[0] == 'charger')
        response.write(JSON.stringify(state));
    if (items[0] == 'available') {
        available = 0;
        for (i = 0; i < count; i++)
            if (state[i] == 'FREE')
                available += 1;
        response.write(JSON.stringify(available));
    }
        
    response.end();
}

function post(items, response) {
    if (items.length == 3) {
        index = Number(items[2]);
        if (index >= 0 && index <= count) {
            if (items[0] == 'charger') {
                if (items[1] == 'reserve') {
                    if (state[index] == 'FREE')
                        state[index] = 'RESERVED';
                }

                if (items[1] == 'release') {
                    if (state[index] == 'RESERVED')
                        state[index] = 'FREE';
                }
            }
        }
    }

    response.end();
}

http.createServer(function (request, response) {
    console.log("Request: " + request.method + " " + request.url);
    items = request.url.split('/');
    items.shift();
    if (request.method == 'GET')
        get(items, response);
    if (request.method == 'POST')
        post(items, response);
}).listen(8080);
