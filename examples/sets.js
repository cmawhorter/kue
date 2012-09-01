// This will generate three "sets" of data.  A set is data that should be processed together.
// Jobs will be created in random order, but processed based on sets.  Set processing order is not guaranteed.
// 
// Sample Output for 10 Jobs with insert_all_jobs_before_starting = true:
// Creating Job -> three: Job 1
// Creating Job -> one: Job 2
// Creating Job -> three: Job 3
// Creating Job -> one: Job 4
// Creating Job -> two: Job 5
// Processing Job -> three: Job 1 		<- set name switch
// Processing Job -> three: Job 3
// Processing Job -> one: Job 2 		<- set name switch
// Processing Job -> one: Job 4
// Processing Job -> two: Job 5 		<- set name switch

var kue = require('../')
  , jobs = kue.createQueue()
  , totaljobs = 100
  , insert_all_jobs_before_starting = false;

var jobidx=0;
function createjob(set)
{
	jobidx++;
	var data = {
	    title: 'Job '+jobidx
	  , setname: set
	};

	console.log('Creating Job -> ' + data.setname + ': ' + data.title);

	jobs.create('jobsets', data, 'setname').save(function(err) {
		if (err) return console.error(err);

		if ( jobidx < totaljobs ) createjob(sets[ getRandomInt(0, setlen) ]);
		else if (insert_all_jobs_before_starting) start();
	});
}


var last_set = null;
function start()
{
	jobs.process('jobsets', function(job, done){
	  console.log('Processing Job -> ' + job.data.setname + ': ' + job.data.title, (last_set != job.data.setname ? '\t\t<- set name switch' : ''));
	  last_set = job.data.setname;
	  done();
	});
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var sets = [ 'one', 'one', 'one', 'one', 'one', 'one', 'two', 'two', 'two', 'three' ]
	, setlen = sets.length-1;


if (!insert_all_jobs_before_starting) start();
createjob(sets[ getRandomInt(0, setlen) ]);