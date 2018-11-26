import cluster from 'cluster';
import os from 'os';

if (cluster.isMaster) {
	const cpus = os.cpus().length;
	console.log(`Forking for ${cpus} CPUs`);
	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}
} else {
	require('./src/server.js');
}


// Listen for dying workers
cluster.on('exit', function (worker) {
	// Replace the dead worker,
	// we're not sentimental
	console.log('Worker %d died :(', worker.id);
	cluster.fork();
});
