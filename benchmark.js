#!/usr/bin/env node

// JavaScript RiveScript benchmark for A.L.I.C.E.

var RiveScript = require("rivescript"),
	printf = require("printf");

var test_inputs = [
	"Hello.",
	"Hello Alice",
	"Who is dr. wallace?",
	"What is your name?",
	"What is my name?",
	"What is the capital of Texas?",
];

var Benchmark = function() {
	var self = this;

	self.run = function() {
		self.timereps(5, self.test_rs);
	};

	self.test_rs = function() {
		var t = time();

		// Load Alice from disk.
		var bot = new RiveScript();
		bot.loadDirectory("./alice", function() {
			t = self.delta(t, "Loading A.L.I.C.E. from disk.");

			// Sort the replies.
			bot.sortReplies();
			t = self.delta(t, "Sort the replies.");

			// Get some responses.
			for (var i = 0; i < test_inputs.length; i++) {
				var message = test_inputs[i];
				var reply = bot.reply("user", message);
				t = self.delta(t, printf("Reply to %s => %s", message, reply));
			}

			bot = undefined;
			console.log("");
		});
	};

	self.delta = function(t, desc) {
		var delta = time() - t;
		console.log(printf("[%08fs] %s", delta, desc));
		return time();
	}

	self.timereps = function(reps, func) {
		var times = new Array();
		for (var i = 0; i < reps; i++) {
			var start = time();
			func();
			times.push(time() - start);
		}
	};

	self.mean = function(ints) {
		var sum = 0;
		for (var int in ints) {
			sum += int;
		}
		return sum / ints.length;
	};
};

function time() {
	return new Date().getTime() / 1000;
}

function printf() {
	console.log("HERE:", arguments);
	console.log(util.format(arguments));
}

var app = new Benchmark();
app.run();
