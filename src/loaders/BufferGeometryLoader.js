import { Sphere } from '../math/Sphere';
import { Vector3 } from '../math/Vector3';
import { BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { XHRLoader } from './XHRLoader';
import { DefaultLoadingManager } from './LoadingManager';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function BufferGeometryLoader ( manager ) {
	this.isBufferGeometryLoader = true;

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

};

BufferGeometryLoader.prototype = {

	constructor: BufferGeometryLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometry = new BufferGeometry();

		var attributes = json.data.attributes;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];
			var typedArray = new self[ attribute.type ]( attribute.array );

			geometry.addAttribute( key, new BufferAttribute( typedArray, attribute.itemSize ) );

		}

		var offsets = json.data.offsets;

		if ( offsets !== undefined ) {

			geometry.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		var boundingSphere = json.data.boundingSphere;

		if ( boundingSphere !== undefined ) {

			var center = new Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

};


export { BufferGeometryLoader };