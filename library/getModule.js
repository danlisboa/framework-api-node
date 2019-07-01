module.exports =  function getModule( modulePath ) {
  var path = require( 'path' );
  return require( path.resolve( modulePath ) );
};