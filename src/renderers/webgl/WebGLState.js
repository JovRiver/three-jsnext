import { NotEqualDepth, GreaterDepth, GreaterEqualDepth, EqualDepth, LessEqualDepth, LessDepth, AlwaysDepth, NeverDepth, CustomBlending, MultiplyBlending, SubtractiveBlending, AdditiveBlending, NoBlending } from '../../Three';

/**
* @author mrdoob / http://mrdoob.com/
*/

function WebGLState ( gl, paramThreeToGL ) {
	this.isWebGLState = true;

	var _this = this;

	var newAttributes = new Uint8Array( 16 );
	var enabledAttributes = new Uint8Array( 16 );

	var switches = {};

	var currentBlending = null;
	var currentBlendEquation = null;
	var currentBlendSrc = null;
	var currentBlendDst = null;
	var currentBlendEquationAlpha = null;
	var currentBlendSrcAlpha = null;
	var currentBlendDstAlpha = null;

	var currentDepthFunc = null;
	var currentDepthTest = null;
	var currentDepthWrite = null;

	var currentColorWrite = null;

	var currentFlipSided = null;

	var currentLineWidth = null;

	var currentPolygonOffset = null;
	var currentPolygonOffsetFactor = null;
	var currentPolygonOffsetUnits = null;

	var maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );

	var currentTextureSlot = undefined;
	var currentBoundTextures = {};

	this.init = function () {

		gl.clearColor( 0, 0, 0, 1 );
		gl.clearDepth( 1 );
		gl.clearStencil( 0 );

		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );

		gl.frontFace( gl.CCW );
		gl.cullFace( gl.BACK );
		this.enable( gl.CULL_FACE );

		this.enable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

	};

	this.initAttributes = function () {

		for ( var i = 0, l = newAttributes.length; i < l; i ++ ) {

			newAttributes[ i ] = 0;

		}

	};

	this.enableAttribute = function ( attribute ) {

		newAttributes[ attribute ] = 1;

		if ( enabledAttributes[ attribute ] === 0 ) {

			gl.enableVertexAttribArray( attribute );
			enabledAttributes[ attribute ] = 1;

		}

	};

	this.disableUnusedAttributes = function () {

		for ( var i = 0, l = enabledAttributes.length; i < l; i ++ ) {

			if ( enabledAttributes[ i ] !== newAttributes[ i ] ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

	};

	this.enable = function ( id ) {

		if ( switches[ id ] !== true ) {

			gl.enable( id );
			switches[ id ] = true;

		}

	};

	this.disable = function ( id ) {

		if ( switches[ id ] !== false ) {

			gl.disable( id );
			switches[ id ] = false;

		}

	};

	this.setBlending = function ( blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha ) {

		if ( blending !== currentBlending ) {

			if ( blending === NoBlending ) {

				this.disable( gl.BLEND );

			} else if ( blending === AdditiveBlending ) {

				this.enable( gl.BLEND );
				gl.blendEquation( gl.FUNC_ADD );
				gl.blendFunc( gl.SRC_ALPHA, gl.ONE );

			} else if ( blending === SubtractiveBlending ) {

				// TODO: Find blendFuncSeparate() combination

				this.enable( gl.BLEND );
				gl.blendEquation( gl.FUNC_ADD );
				gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );

			} else if ( blending === MultiplyBlending ) {

				// TODO: Find blendFuncSeparate() combination

				this.enable( gl.BLEND );
				gl.blendEquation( gl.FUNC_ADD );
				gl.blendFunc( gl.ZERO, gl.SRC_COLOR );

			} else if ( blending === CustomBlending ) {

				this.enable( gl.BLEND );

			} else {

				this.enable( gl.BLEND );
				gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
				gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );

			}

			currentBlending = blending;

		}

		if ( blending === CustomBlending ) {

			blendEquationAlpha = blendEquationAlpha || blendEquation;
			blendSrcAlpha = blendSrcAlpha || blendSrc;
			blendDstAlpha = blendDstAlpha || blendDst;

			if ( blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha ) {

				gl.blendEquationSeparate( paramThreeToGL( blendEquation ), paramThreeToGL( blendEquationAlpha ) );

				currentBlendEquation = blendEquation;
				currentBlendEquationAlpha = blendEquationAlpha;

			}

			if ( blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha ) {

				gl.blendFuncSeparate( paramThreeToGL( blendSrc ), paramThreeToGL( blendDst ), paramThreeToGL( blendSrcAlpha ), paramThreeToGL( blendDstAlpha ) );

				currentBlendSrc = blendSrc;
				currentBlendDst = blendDst;
				currentBlendSrcAlpha = blendSrcAlpha;
				currentBlendDstAlpha = blendDstAlpha;

			}

		} else {

			currentBlendEquation = null;
			currentBlendSrc = null;
			currentBlendDst = null;
			currentBlendEquationAlpha = null;
			currentBlendSrcAlpha = null;
			currentBlendDstAlpha = null;

		}

	};

	this.setDepthFunc = function ( depthFunc ) {

		if ( currentDepthFunc !== depthFunc ) {

			if ( depthFunc ) {

				switch ( depthFunc ) {

					case NeverDepth:

						gl.depthFunc( gl.NEVER );
						break;

					case AlwaysDepth:

						gl.depthFunc( gl.ALWAYS );
						break;

					case LessDepth:

						gl.depthFunc( gl.LESS );
						break;

					case LessEqualDepth:

						gl.depthFunc( gl.LEQUAL );
						break;

					case EqualDepth:

						gl.depthFunc( gl.EQUAL );
						break;

					case GreaterEqualDepth:

						gl.depthFunc( gl.GEQUAL );
						break;

					case GreaterDepth:

						gl.depthFunc( gl.GREATER );
						break;

					case NotEqualDepth:

						gl.depthFunc( gl.NOTEQUAL );
						break;

					default:

						gl.depthFunc( gl.LEQUAL );

				}

			} else {

				gl.depthFunc( gl.LEQUAL );

			}

			currentDepthFunc = depthFunc;

		}

	};

	this.setDepthTest = function ( depthTest ) {

		if ( currentDepthTest !== depthTest ) {

			if ( depthTest ) {

				gl.enable( gl.DEPTH_TEST );

			} else {

				gl.disable( gl.DEPTH_TEST );

			}

			currentDepthTest = depthTest;

		}

	};

	this.setDepthWrite = function ( depthWrite ) {

		if ( currentDepthWrite !== depthWrite ) {

			gl.depthMask( depthWrite );
			currentDepthWrite = depthWrite;

		}

	};

	this.setColorWrite = function ( colorWrite ) {

		if ( currentColorWrite !== colorWrite ) {

			gl.colorMask( colorWrite, colorWrite, colorWrite, colorWrite );
			currentColorWrite = colorWrite;

		}

	};

	this.setFlipSided = function ( flipSided ) {

		if ( currentFlipSided !== flipSided ) {

			if ( flipSided ) {

				gl.frontFace( gl.CW );

			} else {

				gl.frontFace( gl.CCW );

			}

			currentFlipSided = flipSided;

		}

	};

	this.setLineWidth = function ( width ) {

		if ( width !== currentLineWidth ) {

			gl.lineWidth( width );

			currentLineWidth = width;

		}

	};

	this.setPolygonOffset = function ( polygonoffset, factor, units ) {

		if ( currentPolygonOffset !== polygonoffset ) {

			if ( polygonoffset ) {

				gl.enable( gl.POLYGON_OFFSET_FILL );

			} else {

				gl.disable( gl.POLYGON_OFFSET_FILL );

			}

			currentPolygonOffset = polygonoffset;

		}

		if ( polygonoffset && ( currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units ) ) {

			gl.polygonOffset( factor, units );

			currentPolygonOffsetFactor = factor;
			currentPolygonOffsetUnits = units;

		}

	};

	// texture

	this.activeTexture = function ( webglSlot ) {

		if ( webglSlot === undefined ) webglSlot = gl.TEXTURE0 + maxTextures - 1;

		if ( currentTextureSlot !== webglSlot ) {

			gl.activeTexture( webglSlot );
			currentTextureSlot = webglSlot;

		}

	}

	this.bindTexture = function ( webglType, webglTexture ) {

		if ( currentTextureSlot === undefined ) {

			_this.activeTexture();

		}

		var boundTexture = currentBoundTextures[currentTextureSlot];

		if ( boundTexture === undefined ) {

			boundTexture = { type: undefined, texture: undefined };
			currentBoundTextures[currentTextureSlot] = boundTexture;

		}

		if ( boundTexture.type !== webglType || boundTexture.texture !== webglTexture ) {

			gl.bindTexture( webglType, webglTexture );

			boundTexture.type = webglType;
			boundTexture.texture = webglTexture;

		}

	};

	this.compressedTexImage2D = function () {

		try {

			gl.compressedTexImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( error );

		}

	};

	this.texImage2D = function () {

		try {

			gl.texImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( error );

		}

	};

	//

	this.reset = function () {

		for ( var i = 0; i < enabledAttributes.length; i ++ ) {

			if ( enabledAttributes[ i ] === 1 ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

		switches = {};

		currentBlending = null;
		currentDepthTest = null;
		currentDepthWrite = null;
		currentColorWrite = null;

		currentFlipSided = null;

	};

};


export { WebGLState };