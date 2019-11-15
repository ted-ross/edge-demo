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

var amqp = require('rhea');
var env  = process.env;

var container      = amqp.create_container({enable_sasl_external:true});
var conn           = container.connect();
var price_sender   = conn.open_sender('mc/priceSequence');
var manage_sender  = conn.open_sender('$management');
var reply_receiver = conn.open_receiver({'source':{'dynamic':true}});
var reply_to;

function setup_link_route_destination() {
    ap      = {'operation':'CREATE', 'name':'hq-lrd', 'type':'org.apache.qpid.dispatch.router.connection.linkRoute'};
    body    = {'pattern':'edge_register', 'direction':'out'};
    request = {'reply_to':reply_to, 'application_properties':ap, 'correlation_id':'ERLR', 'body':body};
    manage_sender.send(request);
}

container.on('receiver_open', function(context) {
    if (context.receiver === reply_receiver) {
        reply_to = reply_receiver.source.address;
        console.log('Reply address: %s', reply_to);
        setup_link_route_destination();
    }
});

container.on('message', function(context) {
    if (context.message.correlation_id == 'ERLR') {
        if (context.message.application_properties.statusCode == 201)
            console.log('Established destination for edge registration');
        else
            console.log('Reply ', context.message);
    }
});

container.on('sender_open', function(context) {
    if (context.sender.source.address == 'edge_register') {
        console.log('Edge detected');
    }
});

container.on('sender_close', function(context) {
    if (context.sender.source.address == 'edge_register') {
        console.log('Edge lost');
    }
});

//
// Publish price sequence every five seconds
//
setInterval((function() {
    if (price_sender.credit > 0) {
        price_sender.send({body:{'priceSequence': 1}});
        console.log('Sent price sequence');
    }
}), 5000);




