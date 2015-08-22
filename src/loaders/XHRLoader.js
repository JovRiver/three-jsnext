import { Cache } from './Cache';
import { DefaultLoadingManager } from './LoadingManager';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function XHRLoader ( manager ) {
	this.isXHRLoader = true;

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

};

XHRLoader.prototype = {

	constructor: XHRLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = Cache.get( url );

		if ( cached !== undefined ) {

			if ( onLoad ) {

				setTimeout( function () {

					onLoad( cached );

				}, 0 );

			}

			return cached;

		}

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		request.addEventListener( 'load', function ( event ) {

			Cache.add( url, this.response );

			if ( onLoad ) onLoad( this.response );

			scope.manager.itemEnd( url );

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			request.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;
		if ( this.responseType !== undefined ) request.responseType = this.responseType;

		request.send( null );

		scope.manager.itemStart( url );

		return request;

	},

	setResponseType: function ( value ) {

		this.responseType = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};


export { XHRLoader };