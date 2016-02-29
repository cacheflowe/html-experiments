// @author alteredq / http://alteredqualia.com/
//
// Film grain & scanlines shader
//
// - ported from HLSL to WebGL / GLSL
// http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
//
// Screen Space Static Postprocessor
//
// Produces an analogue noise overlay similar to a film grain / TV static
//
// Original implementation and noise algorithm
// Pat 'Hawthorne' Shearon
//
// Optimized scanlines + noise version with intensity scaling
// Georg 'Leviathan' Steinrohder
//
// This version is provided under a Creative Commons Attribution 3.0 License
// http://creativecommons.org/licenses/by/3.0/

function TVFilter()
{
    PIXI.AbstractFilter.call(this,
        // vertex shader
        null,
        // fragment shader
        [
            'precision mediump float;',

            'uniform sampler2D uSampler;',
            'varying vec4 vertColor;',
            'varying vec2 vTextureCoord;',

            'uniform float time;',
            'uniform float grayscale;',
            'uniform float nIntensity;',
            'uniform float sIntensity;',
            'uniform float sCount;',

            'void main() {',
            '    vec4 color = texture2D(uSampler, vTextureCoord);',
            '    vec3 cResult = color.rgb;',
            '    vec2 sc = vec2( sin( vTextureCoord.y * sCount ), cos( vTextureCoord.y * sCount ) );',
            '    cResult += color.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;',
            '    cResult = color.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - color.rgb );',
            '    if( grayscale > 0.5 ) {',
            '        cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );',
            '    }',
            '    gl_FragColor =  vec4( cResult, color.a );',
            '}'
        ].join('\n'),
        // set the uniforms
        {
            time:  {type: '1f', value: Date.now()},
            grayscale: {type: '1f', value: 0.6},
            nIntensity: {type: '1f', value: 0.75},
            sIntensity: {type: '1f', value: 0.65},
            sCount: {type: '1f', value: window.innerHeight},
            dimensions: {type: '4fv', value:[0,0,0,0]}
        }
    );
}

TVFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
TVFilter.prototype.constructor = TVFilter;

Object.defineProperties(TVFilter.prototype, {
    /**
     * The strength of the gray. 1 will make the object black and white, 0 will make the object its normal color.
     *
     * @member {number}
     * @memberof PIXI.filters.TVFilter#
     */
    time: {
        get: function ()
        {
            return this.uniforms.time.value;
        },
        set: function (value)
        {
            this.uniforms.time.value = value;
        }
    }
});
