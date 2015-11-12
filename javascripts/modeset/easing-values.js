function EaseToValueCallback( value, easeFactor, callback, finishRange ) {
  this.easingFloat = new EasingFloat( value, easeFactor );
  this.callback = callback;
  this.finishRange = finishRange || 0.1;
  this.timeout = null;
};

EaseToValueCallback.prototype.setTarget = function( value ) {
  this.easingFloat.setTarget( value );
  this.easeToTarget();
};

EaseToValueCallback.prototype.easeToTarget = function(){
  if( this.timeout != null ) clearTimeout( this.timeout );
  // ease the EasingFloat towards its target
  this.easingFloat.update();
  // call the callback and pass in the current value
  this.callback( this.easingFloat.value() );
  // keep easing if we're not close enough
  if( Math.abs( this.easingFloat.value() - this.easingFloat.target() ) > this.finishRange ) {
    var self = this;
    this.timeout = setTimeout(function(){
      self.easeToTarget();
    },16);
  } else {
    this.easingFloat.setValue( this.easingFloat.target() );
    this.timeout = null;
    // call the callback one last time with the final value
    this.callback( this.easingFloat.value() );
  }
};





function EasingFloat( value, easeFactor, completeRange ) {
  this.val = value;
  this.targetVal = value;
  this.easeFactor = easeFactor;
  this.completeRange = completeRange || 0.01;
};

EasingFloat.prototype.setTarget = function( value ) {
  if(!isNaN(parseFloat(value))) this.targetVal = value;
};

EasingFloat.prototype.setValue = function( value ) {
  this.val = value;
};

EasingFloat.prototype.setEaseFactor = function( value ) {
  this.easeFactor = value;
};

EasingFloat.prototype.value = function() {
  return this.val;
};

EasingFloat.prototype.target = function() {
  return this.targetVal;
};

EasingFloat.prototype.update = function() {
  if( this.val == this.targetVal) return;
  this.val += ( this.targetVal - this.val ) / this.easeFactor;
  if( Math.abs( this.targetVal - this.val ) < this.completeRange ) {
    this.val = this.targetVal;
  }
};

EasingFloat.TWO_PI = Math.PI * 2;
EasingFloat.prototype.updateRadians = function() {
  if( this.val == this.targetVal) return;
  var angleDifference = this.targetVal - this.val;
  var addToLoop = 0;
  if( angleDifference > Math.PI) {
    addToLoop = -EasingFloat.TWO_PI;
  } else if(angleDifference < -Math.PI ) {
    addToLoop = EasingFloat.TWO_PI;
  }
  this.val += ( ( this.targetVal - this.val + addToLoop ) / this.easeFactor );
  if( Math.abs( this.val - this.targetVal ) < this.completeRange ) {
    this.val = this.targetVal;
  }
};






function EasingFloat3d( x, y, z, easeFactor ) {
  this.x = new EasingFloat( x, easeFactor );
  this.y = new EasingFloat( y, easeFactor );
  this.z = new EasingFloat( z, easeFactor );
};

EasingFloat3d.prototype.setTarget = function( x, y, z ) {
  if(x != null) this.x.setTarget( x );
  if(y != null) this.y.setTarget( y );
  if(z != null) this.z.setTarget( z );
};
  
EasingFloat3d.prototype.setValue = function( x, y, z ) {
  if(x != null) this.x.setValue( x );
  if(y != null) this.y.setValue( y );
  if(z != null) this.z.setValue( z );
};
  
EasingFloat3d.prototype.setEaseFactor = function( x, y, z ) {
  if(x != null) this.x.setEaseFactor( x );
  if(y != null) this.y.setEaseFactor( y );
  if(z != null) this.z.setEaseFactor( z );
};
  
EasingFloat3d.prototype.valueX = function() { return this.x.value(); };
EasingFloat3d.prototype.valueY = function() { return this.y.value(); };
EasingFloat3d.prototype.valueZ = function() { return this.z.value(); };
  
EasingFloat3d.prototype.update = function() {
  this.x.update();
  this.y.update();
  this.z.update();
};
