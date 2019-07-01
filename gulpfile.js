var gulp = require('gulp');
var watcher = gulp.watch(['**/*']);
var shelljs = require('shelljs');

var commands = {
  'init_server': 'node app.js test',
  'test': 'mocha --colors --recursive test/',
  'eslint': 'eslint --color .',
};

var terminal = function(command, clear, type) {
  if (clear === true) {
    process.stdout.write('\x1B[2J\x1B[0f');
  }

  shelljs.exec(command, function(code, stdout, stderr) {
    if (stderr) {
      console.log('Program stderr:', stderr);
    }

    console.log('Program output:', stdout);
    console.log('\n');
  });
}

gulp.task('default', function(){
  console.log('Choose one task ex. [gulp test]');
});

gulp.task('server', function(done) {
  watcher.on('change', function(path, stats) {
    terminal(commands.init_server, true, 'Server');
    process.stdout.write('changed starting server \n\n');
  })
});

gulp.task('test', function() {
  watcher.on('change', function(path, stats) {
    terminal(commands.test, true, 'Test');
    process.stdout.write('changed starting unit test \n\n');
  });
});

gulp.task('eslint', function(){
  watcher.on('change', function(path, stats) {
    terminal(commands.eslint, true, 'EsLint');
    process.stdout.write('changed starting eslint \n');
  });
});