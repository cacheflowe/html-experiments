
function ChromaColorFilter()
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

            'uniform sampler2D diffFrame;',
            'uniform float thresholdSensitivity;',
            'uniform float smoothing;',
            'uniform vec3 colorToReplace;',
            'uniform int chromaStyle;',

            '\
            vec3 blendDifference(vec3 base, vec3 blend) { \
            	return abs(base-blend); \
            } \
            \
            vec3 blendDifference(vec3 base, vec3 blend, float opacity) { \
            	return (blendDifference(base, blend) * opacity + blend * (1.0 - opacity)); \
            } \
            ',

            'void main() {',
            '    vec4 cameraColor = texture2D(uSampler, vTextureCoord.xy);',
            '    vec4 frameColor = texture2D(diffFrame, vTextureCoord.xy);',
            // attempt 4
            '    float d = abs(length(abs(frameColor.rgb - cameraColor.rgb)));',
            '    float edge0 = thresholdSensitivity * (1.0 - smoothing);',
            '    float alpha = smoothstep(edge0, thresholdSensitivity, d);',
            '    if(alpha < 0.2) {',
            '        cameraColor = vec4(0,0,0,0);',
            '    }',
            '    gl_FragColor = vec4(cameraColor.rgb, alpha);',
            // attempt 3
            // '    if(distance(cameraColor, frameColor) < thresholdSensitivity) {',
            // '        // float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(colorToReplace, frameColor.rgb));',
            // '        gl_FragColor = vec4(blendDifference(frameColor.rgb, cameraColor.rgb), 0.5);',
            // '    } else {',
            // '        gl_FragColor = vec4(cameraColor.rgb, 1.0);',
            // '    }',
            // attempt 2
            // '    gl_FragColor = vec4(blendDifference(frameColor.rgb, cameraColor.rgb), 1.0);',
            // attempt 1
            // '    if(abs(cameraColor.r - frameColor.r) < thresholdSensitivity && abs(cameraColor.g - frameColor.g) < thresholdSensitivity && abs(cameraColor.b - frameColor.b) < thresholdSensitivity) {',
            // '        // float blendValue = smoothstep(thresholdSensitivity, thresholdSensitivity + smoothing, distance(colorToReplace, frameColor.rgb));',
            // '        gl_FragColor = vec4(0,0,0, 0.0);',
            // '    } else {',
            // '        gl_FragColor = vec4(cameraColor.rgb, 1.0);',
            // '    }',
            '}'
        ].join('\n'),
        // set the uniforms
        {
            chromaStyle:  {type: '1i', value: 0},
            thresholdSensitivity:  {type: '1f', value: 0.1},
            smoothing: {type: '1f', value: 0.7},
            colorToReplace: {type: '3f', value:[0,0.7,0]},
            diffFrame: {type: 't', value: null}
        }
    );
}

ChromaColorFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
ChromaColorFilter.prototype.constructor = ChromaColorFilter;

Object.defineProperties(ChromaColorFilter.prototype, {
    /**
     * The strength of the gray. 1 will make the object black and white, 0 will make the object its normal color.
     *
     * @member {number}
     * @memberof PIXI.filters.ChromaColorFilter#
     */
     chromaStyle: {
         get: function ()
         {
             return this.uniforms.chromaStyle.value;
         },
         set: function (value)
         {
             this.uniforms.chromaStyle.value = value;
         }
     },
     thresholdSensitivity: {
         get: function ()
         {
             return this.uniforms.thresholdSensitivity.value;
         },
         set: function (value)
         {
             this.uniforms.thresholdSensitivity.value = value;
         }
     },
     smoothing: {
         get: function ()
         {
             return this.uniforms.smoothing.value;
         },
         set: function (value)
         {
             this.uniforms.smoothing.value = value;
         }
     },
     colorToReplace: {
         get: function ()
         {
             return this.uniforms.colorToReplace.value;
         },
         set: function (value)
         {
             this.uniforms.colorToReplace.value = value;
         }
     },
     diffFrame: {
         get: function ()
         {
             return this.uniforms.diffFrame.value;
         },
         set: function (value)
         {
             this.uniforms.diffFrame.value = value;
         }
     }
});
